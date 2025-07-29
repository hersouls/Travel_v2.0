import { useState, useRef, useCallback, useEffect } from 'react';

interface AudioPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isLoading: boolean;
  error: string | null;
}

interface UseAudioPlayerReturn extends AudioPlayerState {
  play: () => void;
  pause: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  loadTrack: (src: string) => void;
  audioRef: React.RefObject<HTMLAudioElement>;
}

export const useAudioPlayer = (): UseAudioPlayerReturn => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [state, setState] = useState<AudioPlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    isMuted: false,
    isLoading: false,
    error: null,
  });

  // 오디오 이벤트 핸들러들
  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setState(prev => ({
        ...prev,
        currentTime: audioRef.current!.currentTime,
      }));
    }
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      setState(prev => ({
        ...prev,
        duration: audioRef.current!.duration,
        isLoading: false,
        error: null,
      }));
    }
  }, []);

  const handlePlay = useCallback(() => {
    setState(prev => ({
      ...prev,
      isPlaying: true,
      error: null,
    }));
  }, []);

  const handlePause = useCallback(() => {
    setState(prev => ({
      ...prev,
      isPlaying: false,
    }));
  }, []);

  const handleEnded = useCallback(() => {
    setState(prev => ({
      ...prev,
      isPlaying: false,
      currentTime: 0,
    }));
  }, []);

  const handleError = useCallback((error: Event) => {
    console.error('Audio error:', error);
    setState(prev => ({
      ...prev,
      error: '오디오를 재생할 수 없습니다.',
      isLoading: false,
      isPlaying: false,
    }));
  }, []);

  const handleLoadStart = useCallback(() => {
    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
    }));
  }, []);

  // 오디오 이벤트 리스너 설정
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('loadstart', handleLoadStart);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('loadstart', handleLoadStart);
    };
  }, [handleTimeUpdate, handleLoadedMetadata, handlePlay, handlePause, handleEnded, handleError, handleLoadStart]);

  // 재생/정지 토글
  const play = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(error => {
        console.error('Play failed:', error);
        setState(prev => ({
          ...prev,
          error: '재생을 시작할 수 없습니다.',
        }));
      });
    }
  }, []);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  // 특정 시간으로 이동
  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setState(prev => ({
        ...prev,
        currentTime: time,
      }));
    }
  }, []);

  // 볼륨 설정
  const setVolume = useCallback((volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      setState(prev => ({
        ...prev,
        volume,
        isMuted: volume === 0,
      }));
    }
  }, []);

  // 음소거 토글
  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      if (state.isMuted) {
        audioRef.current.volume = state.volume;
        setState(prev => ({
          ...prev,
          isMuted: false,
        }));
      } else {
        audioRef.current.volume = 0;
        setState(prev => ({
          ...prev,
          isMuted: true,
        }));
      }
    }
  }, [state.isMuted, state.volume]);

  // 트랙 로드
  const loadTrack = useCallback((src: string) => {
    if (audioRef.current) {
      audioRef.current.src = src;
      audioRef.current.load();
      setState(prev => ({
        ...prev,
        currentTime: 0,
        isLoading: true,
        error: null,
      }));
    }
  }, []);

  return {
    ...state,
    play,
    pause,
    seek,
    setVolume,
    toggleMute,
    loadTrack,
    audioRef,
  };
};