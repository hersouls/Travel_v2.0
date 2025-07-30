export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  coverUrl: string;
  url: string;
  lyrics?: string;
  soundInterpretation?: string;
  lyricsInterpretation?: string;
  theme: 'beginning' | 'growth' | 'challenge' | 'shine';
  trackNumber?: number;
}

// 재생 모드 정의
// sequential: 현재 곡 이후 다음 순서 곡 자동재생 (전체재생)
// repeat-one: 현재 곡 반복재생
// shuffle: 현재 곡 이후 랜덤으로 재생
export type PlayMode = 'sequential' | 'repeat-one' | 'shuffle';

export interface MusicState {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playlist: Track[];
  currentIndex: number;
  playMode: PlayMode;
  shuffledPlaylist: Track[];
}

export type Page = 'intro' | 'main' | 'detail' | 'about';