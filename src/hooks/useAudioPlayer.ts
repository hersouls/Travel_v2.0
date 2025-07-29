import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Track } from '@/types';

interface AudioPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isLoading: boolean;
  error: string | null;
}

interface UseAudioPlayerReturn {
  state: AudioPlayerState;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  play: () => Promise<void>;
  pause: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  loadTrack: (track: Track) => void;
  onTimeUpdate: () => void;
  onLoadedMetadata: () => void;
  onEnded: () => void;
  onError: (error: Event) => void;
}

export const useAudioPlayer = (): UseAudioPlayerReturn => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [state, setState] = useState<AudioPlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.7,
    isLoading: false,
    error: null,
  });

  const play = useCallback(async () => {
    if (audioRef.current) {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        await audioRef.current.play();
        setState(prev => ({ ...prev, isPlaying: true, isLoading: false }));
      } catch (error) {
        setState(prev => ({ 
          ...prev, 
          isPlaying: false, 
          isLoading: false, 
          error: error instanceof Error ? error.message : '재생 중 오류가 발생했습니다.' 
        }));
      }
    }
  }, []);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setState(prev => ({ ...prev, isPlaying: false }));
    }
  }, []);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setState(prev => ({ ...prev, currentTime: time }));
    }
  }, []);

  const setVolume = useCallback((volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      setState(prev => ({ ...prev, volume }));
    }
  }, []);

  const loadTrack = useCallback((track: Track) => {
    if (audioRef.current) {
      audioRef.current.src = track.file;
      audioRef.current.load();
      setState(prev => ({ 
        ...prev, 
        currentTime: 0, 
        duration: 0, 
        isPlaying: false,
        isLoading: true,
        error: null 
      }));
    }
  }, []);

  const onTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setState(prev => ({ 
        ...prev, 
        currentTime: audioRef.current!.currentTime 
      }));
    }
  }, []);

  const onLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      setState(prev => ({ 
        ...prev, 
        duration: audioRef.current!.duration,
        isLoading: false 
      }));
    }
  }, []);

  const onEnded = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: false }));
  }, []);

  const onError = useCallback((_error: Event) => {
    setState(prev => ({ 
      ...prev, 
      isPlaying: false, 
      isLoading: false,
      error: '오디오 파일을 로드할 수 없습니다.' 
    }));
  }, []);

  // 볼륨 초기 설정
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = state.volume;
    }
  }, [state.volume]);

  return {
    state,
    audioRef,
    play,
    pause,
    seek,
    setVolume,
    loadTrack,
    onTimeUpdate,
    onLoadedMetadata,
    onEnded,
    onError,
  };
};