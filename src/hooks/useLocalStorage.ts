import { useEffect, useRef } from 'react';
import { usePlayerState } from './usePlayerState';

const STORAGE_KEY = 'moonwave-player-state';

interface StoredPlayerState {
  volume: number;
  isMuted: boolean;
  repeatMode: 'none' | 'one' | 'all';
  isShuffled: boolean;
  currentTrackId?: string;
  currentTime?: number;
}

export const useLocalStorage = () => {
  const { state, dispatch } = usePlayerState();
  const isInitialized = useRef(false);

  // 상태를 로컬 스토리지에 저장
  const saveToStorage = (playerState: StoredPlayerState) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(playerState));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  };

  // 로컬 스토리지에서 상태 복원
  const loadFromStorage = (): StoredPlayerState | null => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      return null;
    }
  };

  // 초기 상태 복원
  useEffect(() => {
    if (isInitialized.current) return;

    const storedState = loadFromStorage();
    if (storedState) {
      // 볼륨 설정 복원
      if (storedState.volume !== undefined) {
        dispatch({ type: 'SET_VOLUME', payload: storedState.volume });
      }
      
      // 음소거 상태 복원
      if (storedState.isMuted !== undefined) {
        dispatch({ type: 'SET_MUTED', payload: storedState.isMuted });
      }
      
      // 반복 모드 복원
      if (storedState.repeatMode) {
        dispatch({ type: 'SET_REPEAT_MODE', payload: storedState.repeatMode });
      }
      
      // 셔플 상태 복원
      if (storedState.isShuffled !== undefined) {
        dispatch({ type: 'SET_SHUFFLED', payload: storedState.isShuffled });
      }
    }

    isInitialized.current = true;
  }, [dispatch]);

  // 상태 변경 시 로컬 스토리지에 저장
  useEffect(() => {
    if (!isInitialized.current) return;

    const stateToStore: StoredPlayerState = {
      volume: state.volume,
      isMuted: state.isMuted,
      repeatMode: state.repeatMode,
      isShuffled: state.isShuffled,
      currentTrackId: state.currentTrack?.id,
      currentTime: state.currentTime,
    };

    saveToStorage(stateToStore);
  }, [
    state.volume,
    state.isMuted,
    state.repeatMode,
    state.isShuffled,
    state.currentTrack?.id,
    state.currentTime,
  ]);

  // 현재 트랙 ID로 트랙 찾기
  const findTrackById = (trackId: string) => {
    return state.playlist.find(track => track.id === trackId);
  };

  // 저장된 트랙 복원
  const restoreCurrentTrack = () => {
    const storedState = loadFromStorage();
    if (storedState?.currentTrackId) {
      const track = findTrackById(storedState.currentTrackId);
      if (track) {
        dispatch({ type: 'SET_CURRENT_TRACK', payload: track });
        if (storedState.currentTime) {
          dispatch({ type: 'SET_CURRENT_TIME', payload: storedState.currentTime });
        }
      }
    }
  };

  // 저장된 상태 초기화
  const clearStoredState = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  };

  return {
    restoreCurrentTrack,
    clearStoredState,
    loadFromStorage,
    saveToStorage,
  };
};