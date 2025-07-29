// Track 인터페이스 정의
export interface Track {
  id: string;
  title: string;
  artist: string;
  description: string;
  audioUrl: string;
  coverUrl: string;
  duration: number;
  lyrics?: SyncLine[];
  interpretation?: string;
  releaseDate?: string;
}

// 가사 싱크 라인 인터페이스
export interface SyncLine {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
  translation?: string;
}

// 플레이어 상태 인터페이스
export interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  repeatMode: 'none' | 'one' | 'all';
  shuffle: boolean;
  playlist: Track[];
  currentIndex: number;
}

// 앱 상태 인터페이스
export interface AppState {
  currentPage: string;
  isLoading: boolean;
  error: string | null;
  userPreferences: {
    theme: 'light' | 'dark' | 'auto';
    language: 'ko' | 'en';
    autoplay: boolean;
  };
}

// 오안나 프로필 인터페이스
export interface Profile {
  name: string;
  birthYear: number;
  sport: string;
  achievements: Achievement[];
  timeline: TimelineEvent[];
  story: string;
  quotes: string[];
}

// 성과 인터페이스
export interface Achievement {
  year: number;
  title: string;
  description: string;
  category: 'national' | 'international' | 'personal';
}

// 타임라인 이벤트 인터페이스
export interface TimelineEvent {
  year: number;
  title: string;
  description: string;
  image?: string;
}

// UI 컴포넌트 props 인터페이스
export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export interface TrackCardProps {
  track: Track;
  isPlaying?: boolean;
  onPlay?: (track: Track) => void;
  onPause?: () => void;
  className?: string;
}

// 오디오 이벤트 인터페이스
export interface AudioEvent {
  type: 'play' | 'pause' | 'ended' | 'timeupdate' | 'error';
  data?: any;
}