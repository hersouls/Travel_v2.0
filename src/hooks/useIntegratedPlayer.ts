import { useEffect, useCallback } from 'react';
import { useAudioPlayer } from './useAudioPlayer';
import { usePlayerState, usePlayerActions, Track } from './usePlayerState';
import { useAudioPreloader } from './useAudioPreloader';

export const useIntegratedPlayer = () => {
  const audioPlayer = useAudioPlayer();
  const { state } = usePlayerState();
  const actions = usePlayerActions();
  const preloader = useAudioPreloader();

  // 오디오 플레이어 상태를 전역 상태와 동기화
  useEffect(() => {
    actions.setPlaying(audioPlayer.isPlaying);
    actions.setCurrentTime(audioPlayer.currentTime);
    actions.setDuration(audioPlayer.duration);
    actions.setVolume(audioPlayer.volume);
    actions.setMuted(audioPlayer.isMuted);
    actions.setLoading(audioPlayer.isLoading);
    actions.setError(audioPlayer.error);
  }, [
    audioPlayer.isPlaying,
    audioPlayer.currentTime,
    audioPlayer.duration,
    audioPlayer.volume,
    audioPlayer.isMuted,
    audioPlayer.isLoading,
    audioPlayer.error,
    actions,
  ]);

  // 현재 트랙이 변경되면 오디오 로드
  useEffect(() => {
    if (state.currentTrack) {
      audioPlayer.loadTrack(state.currentTrack.src);
    }
  }, [state.currentTrack, audioPlayer]);

  // 트랙 재생
  const playTrack = useCallback((track: Track) => {
    actions.setCurrentTrack(track);
    audioPlayer.loadTrack(track.src);
    audioPlayer.play();
  }, [actions, audioPlayer]);

  // 재생/정지 토글
  const togglePlay = useCallback(() => {
    if (audioPlayer.isPlaying) {
      audioPlayer.pause();
    } else {
      audioPlayer.play();
    }
  }, [audioPlayer]);

  // 다음 트랙
  const playNext = useCallback(() => {
    if (state.currentIndex < state.playlist.length - 1) {
      actions.nextTrack();
      const nextTrack = state.playlist[state.currentIndex + 1];
      if (nextTrack) {
        playTrack(nextTrack);
      }
    }
  }, [state.currentIndex, state.playlist, actions, playTrack]);

  // 이전 트랙
  const playPrevious = useCallback(() => {
    if (state.currentIndex > 0) {
      actions.previousTrack();
      const prevTrack = state.playlist[state.currentIndex - 1];
      if (prevTrack) {
        playTrack(prevTrack);
      }
    }
  }, [state.currentIndex, state.playlist, actions, playTrack]);

  // 플레이리스트 설정 및 프리로드
  const setPlaylist = useCallback(async (tracks: Track[]) => {
    actions.setPlaylist(tracks);
    
    // 첫 번째 트랙 자동 재생
    if (tracks.length > 0) {
      actions.setCurrentIndex(0);
      playTrack(tracks[0]);
    }

    // 나머지 트랙들 프리로드
    const sources = tracks.slice(1).map(track => track.src);
    if (sources.length > 0) {
      preloader.preloadQueue(sources);
    }
  }, [actions, playTrack, preloader]);

  // 볼륨 조절
  const setVolume = useCallback((volume: number) => {
    audioPlayer.setVolume(volume);
  }, [audioPlayer]);

  // 음소거 토글
  const toggleMute = useCallback(() => {
    audioPlayer.toggleMute();
  }, [audioPlayer]);

  // 특정 시간으로 이동
  const seek = useCallback((time: number) => {
    audioPlayer.seek(time);
  }, [audioPlayer]);

  // 셔플 토글
  const toggleShuffle = useCallback(() => {
    actions.toggleShuffle();
  }, [actions]);

  // 반복 모드 토글
  const toggleRepeat = useCallback(() => {
    actions.toggleRepeat();
  }, [actions]);

  // 오디오 종료 시 다음 트랙 자동 재생
  useEffect(() => {
    const handleEnded = () => {
      if (state.repeatMode === 'one') {
        // 현재 트랙 반복
        audioPlayer.seek(0);
        audioPlayer.play();
      } else if (state.repeatMode === 'all') {
        // 전체 플레이리스트 반복
        if (state.currentIndex < state.playlist.length - 1) {
          playNext();
        } else {
          actions.setCurrentIndex(0);
          const firstTrack = state.playlist[0];
          if (firstTrack) {
            playTrack(firstTrack);
          }
        }
      } else {
        // 반복 없음 - 다음 트랙으로
        if (state.currentIndex < state.playlist.length - 1) {
          playNext();
        }
      }
    };

    if (audioPlayer.audioRef.current) {
      audioPlayer.audioRef.current.addEventListener('ended', handleEnded);
      return () => {
        if (audioPlayer.audioRef.current) {
          audioPlayer.audioRef.current.removeEventListener('ended', handleEnded);
        }
      };
    }
  }, [state.repeatMode, state.currentIndex, state.playlist, playNext, playTrack, actions, audioPlayer]);

  return {
    // 상태
    currentTrack: state.currentTrack,
    playlist: state.playlist,
    currentIndex: state.currentIndex,
    isPlaying: state.isPlaying,
    isShuffled: state.isShuffled,
    repeatMode: state.repeatMode,
    volume: state.volume,
    isMuted: state.isMuted,
    currentTime: state.currentTime,
    duration: state.duration,
    isLoading: state.isLoading,
    error: state.error,

    // 액션
    playTrack,
    togglePlay,
    playNext,
    playPrevious,
    setPlaylist,
    setVolume,
    toggleMute,
    seek,
    toggleShuffle,
    toggleRepeat,

    // 오디오 참조
    audioRef: audioPlayer.audioRef,

    // 프리로더
    preloader,
  };
};