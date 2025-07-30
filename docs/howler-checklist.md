# Howler.js 개발 체크리스트

## 🎵 기본 설정

### 1. 설치 및 초기화
- [ ] **패키지 설치**
  ```bash
  npm install howler
  npm install --save-dev @types/howler
  ```

- [ ] **기본 설정**
  ```typescript
  import { Howl, Howler } from 'howler';

  // 전역 설정
  Howler.volume(0.5);
  Howler.html5PoolSize = 10;
  ```

### 2. 오디오 컨텍스트 설정
- [ ] **사용자 인터랙션 처리**
  ```typescript
  // 사용자 인터랙션 후 오디오 컨텍스트 활성화
  const unlockAudio = () => {
    Howler.ctx.resume();
    document.removeEventListener('click', unlockAudio);
    document.removeEventListener('touchstart', unlockAudio);
  };

  document.addEventListener('click', unlockAudio);
  document.addEventListener('touchstart', unlockAudio);
  ```

## 🎵 오디오 로딩

### 1. 단일 오디오 로딩
- [ ] **기본 로딩**
  ```typescript
  const sound = new Howl({
    src: ['/audio/track.mp3'],
    html5: false,
    preload: true,
    volume: 0.8,
    onload: () => {
      console.log('오디오 로딩 완료');
    },
    onloaderror: (id, error) => {
      console.error('오디오 로딩 실패:', error);
    }
  });
  ```

- [ ] **다중 포맷 지원**
  ```typescript
  const sound = new Howl({
    src: [
      '/audio/track.mp3',
      '/audio/track.ogg',
      '/audio/track.wav'
    ],
    html5: true, // 브라우저 호환성을 위해 HTML5 Audio 사용
  });
  ```

### 2. 스프라이트 오디오
- [ ] **스프라이트 설정**
  ```typescript
  const sound = new Howl({
    src: ['/audio/sounds.mp3'],
    sprite: {
      play: [0, 1000],
      pause: [1000, 500],
      next: [1500, 800],
      prev: [2300, 600],
      click: [2900, 200]
    }
  });
  ```

## 🎮 재생 제어

### 1. 기본 재생 기능
- [ ] **재생/일시정지/정지**
  ```typescript
  class AudioPlayer {
    private sound: Howl | null = null;

    play(trackUrl: string) {
      if (this.sound) {
        this.sound.stop();
      }

      this.sound = new Howl({
        src: [trackUrl],
        html5: true,
        onplay: () => {
          console.log('재생 시작');
        },
        onpause: () => {
          console.log('일시정지');
        },
        onstop: () => {
          console.log('정지');
        },
        onend: () => {
          console.log('재생 완료');
        }
      });

      this.sound.play();
    }

    pause() {
      this.sound?.pause();
    }

    stop() {
      this.sound?.stop();
    }
  }
  ```

### 2. 볼륨 제어
- [ ] **볼륨 조절**
  ```typescript
  class VolumeController {
    private sound: Howl;

    constructor(sound: Howl) {
      this.sound = sound;
    }

    setVolume(volume: number) {
      // 0.0 ~ 1.0 범위로 제한
      const clampedVolume = Math.max(0, Math.min(1, volume));
      this.sound.volume(clampedVolume);
    }

    getVolume(): number {
      return this.sound.volume();
    }

    mute() {
      this.sound.mute(true);
    }

    unmute() {
      this.sound.mute(false);
    }

    fade(from: number, to: number, duration: number) {
      this.sound.fade(from, to, duration);
    }
  }
  ```

## ⏱️ 시간 제어

### 1. 시크 기능
- [ ] **시간 이동**
  ```typescript
  class SeekController {
    private sound: Howl;

    constructor(sound: Howl) {
      this.sound = sound;
    }

    seek(time: number) {
      this.sound.seek(time);
    }

    getCurrentTime(): number {
      return this.sound.seek();
    }

    getDuration(): number {
      return this.sound.duration();
    }

    // 진행률 계산 (0-100%)
    getProgress(): number {
      const current = this.getCurrentTime();
      const duration = this.getDuration();
      return duration > 0 ? (current / duration) * 100 : 0;
    }
  }
  ```

### 2. 실시간 업데이트
- [ ] **시간 추적**
  ```typescript
  class TimeTracker {
    private sound: Howl;
    private interval: NodeJS.Timeout | null = null;

    constructor(sound: Howl) {
      this.sound = sound;
    }

    startTracking(onUpdate: (currentTime: number, duration: number) => void) {
      this.interval = setInterval(() => {
        const currentTime = this.sound.seek();
        const duration = this.sound.duration();
        onUpdate(currentTime, duration);
      }, 100); // 100ms마다 업데이트
    }

    stopTracking() {
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;
      }
    }
  }
  ```

## 📋 재생 목록 관리

### 1. 플레이리스트 클래스
- [ ] **재생 목록 구현**
  ```typescript
  interface Track {
    id: string;
    title: string;
    artist: string;
    url: string;
    duration?: number;
  }

  class Playlist {
    private tracks: Track[] = [];
    private currentIndex: number = 0;
    private sounds: Map<string, Howl> = new Map();
    private currentSound: Howl | null = null;

    addTrack(track: Track) {
      this.tracks.push(track);
      this.loadTrack(track);
    }

    private loadTrack(track: Track) {
      const sound = new Howl({
        src: [track.url],
        html5: true,
        preload: true,
        onload: () => {
          track.duration = sound.duration();
        }
      });
      this.sounds.set(track.id, sound);
    }

    playTrack(index: number) {
      if (index >= 0 && index < this.tracks.length) {
        this.currentIndex = index;
        const track = this.tracks[index];
        this.currentSound = this.sounds.get(track.id) || null;
        this.currentSound?.play();
      }
    }

    next() {
      this.playTrack(this.currentIndex + 1);
    }

    previous() {
      this.playTrack(this.currentIndex - 1);
    }

    getCurrentTrack(): Track | null {
      return this.tracks[this.currentIndex] || null;
    }
  }
  ```

### 2. 셔플 및 반복
- [ ] **재생 모드**
  ```typescript
  enum PlayMode {
    NORMAL = 'normal',
    REPEAT_ONE = 'repeat_one',
    REPEAT_ALL = 'repeat_all',
    SHUFFLE = 'shuffle'
  }

  class PlaylistController {
    private playlist: Playlist;
    private playMode: PlayMode = PlayMode.NORMAL;
    private shuffledIndices: number[] = [];
    private originalIndices: number[] = [];

    constructor(playlist: Playlist) {
      this.playlist = playlist;
    }

    setPlayMode(mode: PlayMode) {
      this.playMode = mode;
      if (mode === PlayMode.SHUFFLE) {
        this.createShuffledIndices();
      }
    }

    private createShuffledIndices() {
      this.shuffledIndices = [...Array(this.playlist.getTracks().length).keys()];
      for (let i = this.shuffledIndices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.shuffledIndices[i], this.shuffledIndices[j]] = 
        [this.shuffledIndices[j], this.shuffledIndices[i]];
      }
    }

    onTrackEnd() {
      switch (this.playMode) {
        case PlayMode.NORMAL:
          this.playlist.next();
          break;
        case PlayMode.REPEAT_ONE:
          this.playlist.playTrack(this.playlist.getCurrentIndex());
          break;
        case PlayMode.REPEAT_ALL:
          this.playlist.next();
          break;
        case PlayMode.SHUFFLE:
          this.playNextShuffled();
          break;
      }
    }
  }
  ```

## 🎛️ 오디오 효과

### 1. 이퀄라이저
- [ ] **주파수 분석**
  ```typescript
  class AudioVisualizer {
    private sound: Howl;
    private analyser: AnalyserNode;
    private dataArray: Uint8Array;

    constructor(sound: Howl) {
      this.sound = sound;
      this.setupAnalyser();
    }

    private setupAnalyser() {
      const audioContext = Howler.ctx;
      const source = audioContext.createMediaElementSource(this.sound._sounds[0]._node);
      this.analyser = audioContext.createAnalyser();
      
      this.analyser.fftSize = 256;
      const bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(bufferLength);
      
      source.connect(this.analyser);
      this.analyser.connect(audioContext.destination);
    }

    getFrequencyData(): Uint8Array {
      this.analyser.getByteFrequencyData(this.dataArray);
      return this.dataArray;
    }

    getWaveformData(): Uint8Array {
      this.analyser.getByteTimeDomainData(this.dataArray);
      return this.dataArray;
    }
  }
  ```

### 2. 필터 및 이펙트
- [ ] **오디오 필터**
  ```typescript
  class AudioEffects {
    private sound: Howl;
    private filters: Map<string, BiquadFilterNode> = new Map();

    constructor(sound: Howl) {
      this.sound = sound;
      this.setupFilters();
    }

    private setupFilters() {
      const audioContext = Howler.ctx;
      const source = audioContext.createMediaElementSource(this.sound._sounds[0]._node);

      // 로우패스 필터
      const lowpass = audioContext.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.value = 1000;
      this.filters.set('lowpass', lowpass);

      // 하이패스 필터
      const highpass = audioContext.createBiquadFilter();
      highpass.type = 'highpass';
      highpass.frequency.value = 1000;
      this.filters.set('highpass', highpass);

      // 연결
      source.connect(lowpass);
      lowpass.connect(highpass);
      highpass.connect(audioContext.destination);
    }

    setLowpassFrequency(frequency: number) {
      const filter = this.filters.get('lowpass');
      if (filter) {
        filter.frequency.value = frequency;
      }
    }

    setHighpassFrequency(frequency: number) {
      const filter = this.filters.get('highpass');
      if (filter) {
        filter.frequency.value = frequency;
      }
    }
  }
  ```

## 🚨 에러 처리

### 1. 오디오 에러 처리
- [ ] **에러 핸들링**
  ```typescript
  class AudioErrorHandler {
    static handleLoadError(sound: Howl, error: any) {
      console.error('오디오 로딩 에러:', error);
      
      // 사용자에게 에러 알림
      this.showErrorNotification('오디오 파일을 로드할 수 없습니다.');
      
      // 대체 오디오 시도
      this.tryAlternativeFormat(sound);
    }

    static handlePlayError(sound: Howl, error: any) {
      console.error('오디오 재생 에러:', error);
      
      // 브라우저 정책 에러인 경우 사용자 인터랙션 요청
      if (error.message.includes('user interaction')) {
        this.requestUserInteraction();
      }
    }

    private static showErrorNotification(message: string) {
      // 토스트 메시지 또는 알림 표시
      console.log(message);
    }

    private static tryAlternativeFormat(sound: Howl) {
      // 다른 포맷으로 재시도
      const alternativeFormats = ['ogg', 'wav', 'aac'];
      // 구현...
    }

    private static requestUserInteraction() {
      // 사용자에게 클릭이나 터치를 요청하는 UI 표시
      console.log('사용자 인터랙션이 필요합니다.');
    }
  }
  ```

### 2. 네트워크 에러 처리
- [ ] **네트워크 재시도**
  ```typescript
  class NetworkRetryHandler {
    private maxRetries: number = 3;
    private retryDelay: number = 1000;

    async loadAudioWithRetry(url: string): Promise<Howl> {
      let retries = 0;

      while (retries < this.maxRetries) {
        try {
          return new Promise((resolve, reject) => {
            const sound = new Howl({
              src: [url],
              html5: true,
              onload: () => resolve(sound),
              onloaderror: (id, error) => {
                retries++;
                if (retries >= this.maxRetries) {
                  reject(error);
                } else {
                  setTimeout(() => {
                    // 재시도
                    sound.load();
                  }, this.retryDelay * retries);
                }
              }
            });
          });
        } catch (error) {
          retries++;
          if (retries >= this.maxRetries) {
            throw error;
          }
          await this.delay(this.retryDelay * retries);
        }
      }

      throw new Error('최대 재시도 횟수를 초과했습니다.');
    }

    private delay(ms: number): Promise<void> {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  }
  ```

## 📱 모바일 최적화

### 1. 모바일 브라우저 대응
- [ ] **모바일 특화 설정**
  ```typescript
  class MobileAudioOptimizer {
    static optimizeForMobile() {
      // 모바일에서는 HTML5 Audio 사용
      Howler.html5PoolSize = 5; // 메모리 절약
      
      // 자동 재생 정책 대응
      this.handleAutoplayPolicy();
    }

    private static handleAutoplayPolicy() {
      // iOS Safari 대응
      if (this.isIOS()) {
        this.setupIOSAudio();
      }

      // Android Chrome 대응
      if (this.isAndroid()) {
        this.setupAndroidAudio();
      }
    }

    private static isIOS(): boolean {
      return /iPad|iPhone|iPod/.test(navigator.userAgent);
    }

    private static isAndroid(): boolean {
      return /Android/.test(navigator.userAgent);
    }

    private static setupIOSAudio() {
      // iOS에서는 사용자 인터랙션 후 오디오 컨텍스트 활성화
      document.addEventListener('touchstart', () => {
        Howler.ctx.resume();
      }, { once: true });
    }

    private static setupAndroidAudio() {
      // Android에서는 HTML5 Audio 사용 권장
      Howler.html5PoolSize = 3;
    }
  }
  ```

### 2. 배터리 최적화
- [ ] **배터리 절약**
  ```typescript
  class BatteryOptimizer {
    private isLowPowerMode: boolean = false;

    constructor() {
      this.detectLowPowerMode();
    }

    private detectLowPowerMode() {
      // 배터리 API 지원 확인
      if ('getBattery' in navigator) {
        navigator.getBattery().then(battery => {
          this.isLowPowerMode = battery.level < 0.2;
          this.optimizeForBattery();
        });
      }
    }

    private optimizeForBattery() {
      if (this.isLowPowerMode) {
        // 저전력 모드에서는 품질 낮춤
        Howler.html5PoolSize = 2;
        // 자동 재생 비활성화
        // 백그라운드 재생 제한
      }
    }

    setAudioQuality(quality: 'low' | 'medium' | 'high') {
      if (this.isLowPowerMode && quality !== 'low') {
        console.warn('배터리 절약을 위해 낮은 품질로 설정됩니다.');
        quality = 'low';
      }

      switch (quality) {
        case 'low':
          Howler.html5PoolSize = 2;
          break;
        case 'medium':
          Howler.html5PoolSize = 5;
          break;
        case 'high':
          Howler.html5PoolSize = 10;
          break;
      }
    }
  }
  ```

## 🧪 테스트

### 1. 단위 테스트
- [ ] **Jest 테스트 설정**
  ```typescript
  // __mocks__/howler.ts
  export const Howl = jest.fn().mockImplementation((options) => ({
    play: jest.fn(),
    pause: jest.fn(),
    stop: jest.fn(),
    volume: jest.fn(),
    seek: jest.fn(),
    duration: jest.fn(() => 180),
    on: jest.fn(),
    off: jest.fn(),
    ...options
  }));

  export const Howler = {
    volume: jest.fn(),
    ctx: {
      resume: jest.fn(),
      createMediaElementSource: jest.fn(),
      createAnalyser: jest.fn(),
      createBiquadFilter: jest.fn(),
      destination: {}
    }
  };
  ```

### 2. 통합 테스트
- [ ] **Playwright 테스트**
  ```typescript
  // tests/audio.spec.ts
  test('오디오 재생 기능', async ({ page }) => {
    await page.goto('/');
    
    // 재생 버튼 클릭
    await page.click('[data-testid="play-button"]');
    
    // 재생 상태 확인
    await expect(page.locator('[data-testid="play-button"]'))
      .toHaveAttribute('aria-pressed', 'true');
    
    // 시간 업데이트 확인
    await expect(page.locator('[data-testid="current-time"]'))
      .not.toHaveText('0:00');
  });
  ```

---

*이 체크리스트는 Howler.js를 활용하여 안정적이고 성능 좋은 오디오 플레이어를 구현하기 위한 가이드입니다.* 