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

// 가사 싱크 라인 타입 (개선된 버전)
export interface SyncLine {
  id: string;
  startTime: number; // 시작 시간 (초)
  endTime: number;   // 끝 시간 (초)
  text: string;      // 가사 텍스트
  translation?: string; // 번역 (선택사항)
  isHighlighted?: boolean; // 현재 하이라이트 여부
  confidence?: number; // 타이밍 정확도 (0-1)
}

// 가사 싱크 설정 타입
export interface LyricsSyncSettings {
  autoScroll: boolean;
  highlightCurrent: boolean;
  showTranslation: boolean;
  syncOffset: number; // 싱크 오프셋 (초)
  fontSize: 'small' | 'medium' | 'large';
  theme: 'light' | 'dark' | 'auto';
}

// 가사 싱크 상태 타입
export interface LyricsSyncState {
  currentLineIndex: number;
  isVisible: boolean;
  settings: LyricsSyncSettings;
  error: string | null;
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