# TypeScript 개발 체크리스트

## 🔒 타입 안정성

### 1. 엄격한 타입 체크 설정
- [ ] **tsconfig.json 설정**
  - [ ] `strict: true` 활성화
  - [ ] `noImplicitAny: true`
  - [ ] `strictNullChecks: true`
  - [ ] `noImplicitReturns: true`
  - [ ] `noUnusedLocals: true`
  - [ ] `noUnusedParameters: true`

- [ ] **ESLint TypeScript 규칙**
  - [ ] `@typescript-eslint/no-explicit-any`
  - [ ] `@typescript-eslint/no-unused-vars`
  - [ ] `@typescript-eslint/explicit-function-return-type`
  - [ ] `@typescript-eslint/no-non-null-assertion`

### 2. 인터페이스 정의
- [ ] **오디오 관련 인터페이스**
  ```typescript
  interface AudioTrack {
    id: string;
    title: string;
    artist: string;
    album?: string;
    duration: number;
    url: string;
    coverImage?: string;
  }

  interface PlaybackState {
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    volume: number;
    isMuted: boolean;
    currentTrackIndex: number;
  }

  interface Playlist {
    id: string;
    name: string;
    tracks: AudioTrack[];
    createdAt: Date;
    updatedAt: Date;
  }
  ```

- [ ] **컴포넌트 Props 인터페이스**
  ```typescript
  interface MusicPlayerProps {
    tracks: AudioTrack[];
    onTrackChange?: (track: AudioTrack) => void;
    onPlaybackStateChange?: (state: PlaybackState) => void;
    className?: string;
  }

  interface TrackCardProps {
    track: AudioTrack;
    isPlaying: boolean;
    isCurrentTrack: boolean;
    onPlay: (track: AudioTrack) => void;
    onPause: () => void;
  }
  ```

### 3. 제네릭 활용
- [ ] **재사용 가능한 컴포넌트**
  ```typescript
  interface ListProps<T> {
    items: T[];
    renderItem: (item: T, index: number) => React.ReactNode;
    keyExtractor: (item: T) => string;
    className?: string;
  }

  interface ApiResponse<T> {
    data: T;
    status: 'success' | 'error';
    message?: string;
  }
  ```

- [ ] **유틸리티 함수**
  ```typescript
  function debounce<T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): (...args: Parameters<T>) => void;

  function memoize<T extends (...args: any[]) => any>(
    func: T
  ): T;
  ```

### 4. 타입 가드 구현
- [ ] **런타임 타입 체크**
  ```typescript
  function isAudioTrack(obj: any): obj is AudioTrack {
    return (
      typeof obj === 'object' &&
      typeof obj.id === 'string' &&
      typeof obj.title === 'string' &&
      typeof obj.duration === 'number'
    );
  }

  function isPlaylist(obj: any): obj is Playlist {
    return (
      typeof obj === 'object' &&
      Array.isArray(obj.tracks) &&
      obj.tracks.every(isAudioTrack)
    );
  }
  ```

## 🎵 오디오 플레이어 특화 타입

### 1. 오디오 이벤트 타입
- [ ] **이벤트 핸들러 타입**
  ```typescript
  type AudioEventType = 
    | 'loadstart'
    | 'durationchange'
    | 'loadedmetadata'
    | 'loadeddata'
    | 'progress'
    | 'canplay'
    | 'canplaythrough'
    | 'play'
    | 'playing'
    | 'waiting'
    | 'seeking'
    | 'seeked'
    | 'timeupdate'
    | 'ended'
    | 'ratechange'
    | 'durationchange'
    | 'volumechange'
    | 'suspend'
    | 'abort'
    | 'error'
    | 'emptied'
    | 'stalled'
    | 'loadedmetadata'
    | 'loadstart'
    | 'progress'
    | 'suspend'
    | 'abort'
    | 'error'
    | 'emptied'
    | 'stalled'
    | 'loadedmetadata'
    | 'loadstart'
    | 'progress'
    | 'suspend'
    | 'abort'
    | 'error'
    | 'emptied'
    | 'stalled';

  interface AudioEventHandler {
    (event: Event): void;
  }
  ```

### 2. 상태 관리 타입
- [ ] **Redux 스타일 액션 타입**
  ```typescript
  type AudioAction =
    | { type: 'PLAY'; payload: AudioTrack }
    | { type: 'PAUSE' }
    | { type: 'STOP' }
    | { type: 'SET_VOLUME'; payload: number }
    | { type: 'SET_CURRENT_TIME'; payload: number }
    | { type: 'SET_TRACK'; payload: AudioTrack }
    | { type: 'SET_PLAYLIST'; payload: Playlist }
    | { type: 'NEXT_TRACK' }
    | { type: 'PREVIOUS_TRACK' }
    | { type: 'TOGGLE_SHUFFLE' }
    | { type: 'TOGGLE_REPEAT' };
  ```

## 🔧 유틸리티 타입

### 1. 기본 유틸리티 타입 활용
- [ ] **Partial, Required, Pick, Omit**
  ```typescript
  type CreateTrackRequest = Omit<AudioTrack, 'id'>;
  type UpdateTrackRequest = Partial<AudioTrack>;
  type TrackDisplay = Pick<AudioTrack, 'title' | 'artist' | 'duration'>;
  type RequiredTrack = Required<AudioTrack>;
  ```

- [ ] **Record, ReturnType, Parameters**
  ```typescript
  type EventHandlers = Record<AudioEventType, AudioEventHandler>;
  type ApiFunction = (url: string) => Promise<ApiResponse<AudioTrack[]>>;
  type ApiReturnType = ReturnType<ApiFunction>;
  type ApiParameters = Parameters<ApiFunction>;
  ```

### 2. 고급 타입 패턴
- [ ] **조건부 타입**
  ```typescript
  type NonNullableFields<T> = {
    [P in keyof T]: NonNullable<T[P]>;
  };

  type OptionalFields<T> = {
    [P in keyof T]?: T[P];
  };

  type AudioTrackWithRequiredFields = NonNullableFields<AudioTrack>;
  ```

- [ ] **템플릿 리터럴 타입**
  ```typescript
  type AudioFormat = 'mp3' | 'wav' | 'ogg' | 'aac';
  type AudioQuality = 'low' | 'medium' | 'high';
  type AudioFileName = `${string}.${AudioFormat}`;
  type AudioQualitySetting = `${AudioQuality}_${AudioFormat}`;
  ```

## 🧪 테스트 타입

### 1. 테스트 유틸리티 타입
- [ ] **모킹 타입**
  ```typescript
  type MockAudioContext = {
    createMediaElementSource: jest.MockedFunction<AudioContext['createMediaElementSource']>;
    createAnalyser: jest.MockedFunction<AudioContext['createAnalyser']>;
    createGain: jest.MockedFunction<AudioContext['createGain']>;
  };

  type MockHowl = {
    play: jest.MockedFunction<() => void>;
    pause: jest.MockedFunction<() => void>;
    stop: jest.MockedFunction<() => void>;
    volume: jest.MockedFunction<(volume: number) => void>;
    seek: jest.MockedFunction<(time: number) => void>;
    on: jest.MockedFunction<(event: string, callback: () => void) => void>;
  };
  ```

### 2. 테스트 데이터 타입
- [ ] **팩토리 함수 타입**
  ```typescript
  type CreateMockTrackOptions = Partial<AudioTrack> & {
    id?: string;
  };

  type CreateMockPlaylistOptions = Partial<Playlist> & {
    trackCount?: number;
  };

  function createMockTrack(options?: CreateMockTrackOptions): AudioTrack;
  function createMockPlaylist(options?: CreateMockPlaylistOptions): Playlist;
  ```

## 📦 외부 라이브러리 타입

### 1. Howler.js 타입 정의
- [ ] **Howler 타입 확장**
  ```typescript
  interface HowlOptions {
    src: string | string[];
    html5?: boolean;
    preload?: boolean;
    autoplay?: boolean;
    volume?: number;
    rate?: number;
    sprite?: { [key: string]: [number, number] };
    onload?: () => void;
    onloaderror?: (id: number, error: any) => void;
    onplay?: (id: number) => void;
    onplayerror?: (id: number, error: any) => void;
    onstop?: (id: number) => void;
    onend?: (id: number) => void;
    onpause?: (id: number) => void;
    onvolume?: (id: number) => void;
    onrate?: (id: number) => void;
    onseek?: (id: number) => void;
    onfade?: (id: number) => void;
    onunlock?: () => void;
  }
  ```

### 2. React Hook 타입
- [ ] **커스텀 훅 타입**
  ```typescript
  interface UseAudioPlayerReturn {
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    volume: number;
    currentTrack: AudioTrack | null;
    playlist: Playlist | null;
    play: (track?: AudioTrack) => void;
    pause: () => void;
    stop: () => void;
    setVolume: (volume: number) => void;
    seek: (time: number) => void;
    nextTrack: () => void;
    previousTrack: () => void;
    toggleShuffle: () => void;
    toggleRepeat: () => void;
  }

  function useAudioPlayer(): UseAudioPlayerReturn;
  ```

## 🔍 타입 검증

### 1. 런타임 타입 검증
- [ ] **Zod 스키마 정의**
  ```typescript
  import { z } from 'zod';

  const AudioTrackSchema = z.object({
    id: z.string(),
    title: z.string(),
    artist: z.string(),
    album: z.string().optional(),
    duration: z.number().positive(),
    url: z.string().url(),
    coverImage: z.string().url().optional(),
  });

  const PlaylistSchema = z.object({
    id: z.string(),
    name: z.string(),
    tracks: z.array(AudioTrackSchema),
    createdAt: z.date(),
    updatedAt: z.date(),
  });

  type ValidatedAudioTrack = z.infer<typeof AudioTrackSchema>;
  type ValidatedPlaylist = z.infer<typeof PlaylistSchema>;
  ```

### 2. API 응답 타입 검증
- [ ] **API 타입 가드**
  ```typescript
  function validateApiResponse<T>(
    response: unknown,
    schema: z.ZodSchema<T>
  ): response is T {
    return schema.safeParse(response).success;
  }

  async function fetchTracks(): Promise<AudioTrack[]> {
    const response = await fetch('/api/tracks');
    const data = await response.json();
    
    if (!validateApiResponse(data, z.array(AudioTrackSchema))) {
      throw new Error('Invalid API response');
    }
    
    return data;
  }
  ```

## 📊 성능 최적화 타입

### 1. 메모이제이션 타입
- [ ] **메모이제이션 유틸리티**
  ```typescript
  type MemoizedFunction<T extends (...args: any[]) => any> = T & {
    clear: () => void;
  };

  function memoize<T extends (...args: any[]) => any>(
    fn: T,
    resolver?: (...args: Parameters<T>) => string
  ): MemoizedFunction<T>;
  ```

### 2. 지연 로딩 타입
- [ ] **동적 임포트 타입**
  ```typescript
  type LazyComponent<T> = {
    default: React.ComponentType<T>;
  };

  type AsyncComponent<T> = Promise<LazyComponent<T>>;

  function lazyLoad<T>(
    importFn: () => AsyncComponent<T>
  ): React.LazyExoticComponent<React.ComponentType<T>>;
  ```

## 🚨 에러 처리 타입

### 1. 에러 타입 정의
- [ ] **커스텀 에러 클래스**
  ```typescript
  class AudioError extends Error {
    constructor(
      message: string,
      public code: 'LOAD_ERROR' | 'PLAY_ERROR' | 'NETWORK_ERROR',
      public originalError?: Error
    ) {
      super(message);
      this.name = 'AudioError';
    }
  }

  class PlaylistError extends Error {
    constructor(
      message: string,
      public playlistId: string,
      public originalError?: Error
    ) {
      super(message);
      this.name = 'PlaylistError';
    }
  }
  ```

### 2. Result 타입 패턴
- [ ] **Result 타입 구현**
  ```typescript
  type Result<T, E = Error> = 
    | { success: true; data: T }
    | { success: false; error: E };

  function safeAudioOperation<T>(
    operation: () => Promise<T>
  ): Promise<Result<T, AudioError>>;
  ```

---

*이 체크리스트는 TypeScript를 활용하여 타입 안전하고 유지보수 가능한 오디오 플레이어 애플리케이션을 개발하기 위한 가이드입니다.* 