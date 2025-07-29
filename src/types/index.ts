// Track 관련 타입
export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  coverUrl: string;
  audioUrl: string;
  description?: string;
  lyrics?: SyncLine[];
  interpretation?: string;
  releaseDate?: string;
}

// 가사 싱크 라인 타입
export interface SyncLine {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
  translation?: string;
}

// 플레이어 상태 타입
export interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  repeatMode: 'none' | 'one' | 'all';
  isShuffled: boolean;
  playlist: Track[];
  currentIndex: number;
}

// 앱 상태 타입
export interface AppState {
  isLoading: boolean;
  error: string | null;
  theme: 'light' | 'dark' | 'auto';
  language: 'ko' | 'en';
  isFirstVisit: boolean;
}

// 오디오 이벤트 타입
export interface AudioEvent {
  type: 'play' | 'pause' | 'ended' | 'timeupdate' | 'error';
  data?: any;
}

// UI 상태 타입
export interface UIState {
  isPlayerVisible: boolean;
  isPlaylistVisible: boolean;
  isLyricsVisible: boolean;
  activeTab: 'lyrics' | 'interpretation' | 'sync';
}

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 사용자 설정 타입
export interface UserSettings {
  autoPlay: boolean;
  crossfade: boolean;
  highQuality: boolean;
  downloadEnabled: boolean;
  notifications: boolean;
}