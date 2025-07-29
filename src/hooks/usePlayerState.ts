import { createContext, useContext, useReducer, ReactNode } from 'react';

export interface Track {
  id: string;
  title: string;
  artist: string;
  src: string;
  cover: string;
  duration?: number;
  lyrics?: string;
  interpretation?: string;
}

export interface PlayerState {
  currentTrack: Track | null;
  playlist: Track[];
  currentIndex: number;
  isPlaying: boolean;
  isShuffled: boolean;
  repeatMode: 'none' | 'one' | 'all';
  volume: number;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  isLoading: boolean;
  error: string | null;
}

type PlayerAction =
  | { type: 'SET_CURRENT_TRACK'; payload: Track }
  | { type: 'SET_PLAYLIST'; payload: Track[] }
  | { type: 'SET_CURRENT_INDEX'; payload: number }
  | { type: 'SET_PLAYING'; payload: boolean }
  | { type: 'SET_SHUFFLED'; payload: boolean }
  | { type: 'SET_REPEAT_MODE'; payload: 'none' | 'one' | 'all' }
  | { type: 'SET_VOLUME'; payload: number }
  | { type: 'SET_MUTED'; payload: boolean }
  | { type: 'SET_CURRENT_TIME'; payload: number }
  | { type: 'SET_DURATION'; payload: number }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'NEXT_TRACK' }
  | { type: 'PREVIOUS_TRACK' }
  | { type: 'TOGGLE_SHUFFLE' }
  | { type: 'TOGGLE_REPEAT' }
  | { type: 'RESET' };

const initialState: PlayerState = {
  currentTrack: null,
  playlist: [],
  currentIndex: -1,
  isPlaying: false,
  isShuffled: false,
  repeatMode: 'none',
  volume: 1,
  isMuted: false,
  currentTime: 0,
  duration: 0,
  isLoading: false,
  error: null,
};

function playerReducer(state: PlayerState, action: PlayerAction): PlayerState {
  switch (action.type) {
    case 'SET_CURRENT_TRACK':
      return { ...state, currentTrack: action.payload };
    
    case 'SET_PLAYLIST':
      return { ...state, playlist: action.payload };
    
    case 'SET_CURRENT_INDEX':
      return { ...state, currentIndex: action.payload };
    
    case 'SET_PLAYING':
      return { ...state, isPlaying: action.payload };
    
    case 'SET_SHUFFLED':
      return { ...state, isShuffled: action.payload };
    
    case 'SET_REPEAT_MODE':
      return { ...state, repeatMode: action.payload };
    
    case 'SET_VOLUME':
      return { ...state, volume: action.payload };
    
    case 'SET_MUTED':
      return { ...state, isMuted: action.payload };
    
    case 'SET_CURRENT_TIME':
      return { ...state, currentTime: action.payload };
    
    case 'SET_DURATION':
      return { ...state, duration: action.payload };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'NEXT_TRACK': {
      const nextIndex = state.currentIndex + 1;
      if (nextIndex >= state.playlist.length) {
        if (state.repeatMode === 'all') {
          return { ...state, currentIndex: 0 };
        }
        return state; // 재생 목록 끝
      }
      return { ...state, currentIndex: nextIndex };
    }
    
    case 'PREVIOUS_TRACK': {
      const prevIndex = state.currentIndex - 1;
      if (prevIndex < 0) {
        if (state.repeatMode === 'all') {
          return { ...state, currentIndex: state.playlist.length - 1 };
        }
        return state; // 재생 목록 시작
      }
      return { ...state, currentIndex: prevIndex };
    }
    
    case 'TOGGLE_SHUFFLE':
      return { ...state, isShuffled: !state.isShuffled };
    
    case 'TOGGLE_REPEAT': {
      const modes: ('none' | 'one' | 'all')[] = ['none', 'one', 'all'];
      const currentIndex = modes.indexOf(state.repeatMode);
      const nextIndex = (currentIndex + 1) % modes.length;
      return { ...state, repeatMode: modes[nextIndex] };
    }
    
    case 'RESET':
      return initialState;
    
    default:
      return state;
  }
}

interface PlayerContextType {
  state: PlayerState;
  dispatch: React.Dispatch<PlayerAction>;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(playerReducer, initialState);

  return (
    <PlayerContext.Provider value={{ state, dispatch }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayerState = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayerState must be used within a PlayerProvider');
  }
  return context;
};

// 편의 함수들
export const usePlayerActions = () => {
  const { dispatch } = usePlayerState();
  
  return {
    setCurrentTrack: (track: Track) => dispatch({ type: 'SET_CURRENT_TRACK', payload: track }),
    setPlaylist: (playlist: Track[]) => dispatch({ type: 'SET_PLAYLIST', payload: playlist }),
    setCurrentIndex: (index: number) => dispatch({ type: 'SET_CURRENT_INDEX', payload: index }),
    setPlaying: (playing: boolean) => dispatch({ type: 'SET_PLAYING', payload: playing }),
    setVolume: (volume: number) => dispatch({ type: 'SET_VOLUME', payload: volume }),
    setMuted: (muted: boolean) => dispatch({ type: 'SET_MUTED', payload: muted }),
    setCurrentTime: (time: number) => dispatch({ type: 'SET_CURRENT_TIME', payload: time }),
    setDuration: (duration: number) => dispatch({ type: 'SET_DURATION', payload: duration }),
    setLoading: (loading: boolean) => dispatch({ type: 'SET_LOADING', payload: loading }),
    setError: (error: string | null) => dispatch({ type: 'SET_ERROR', payload: error }),
    nextTrack: () => dispatch({ type: 'NEXT_TRACK' }),
    previousTrack: () => dispatch({ type: 'PREVIOUS_TRACK' }),
    toggleShuffle: () => dispatch({ type: 'TOGGLE_SHUFFLE' }),
    toggleRepeat: () => dispatch({ type: 'TOGGLE_REPEAT' }),
    reset: () => dispatch({ type: 'RESET' }),
  };
};