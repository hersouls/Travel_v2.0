# 테스트 개발 체크리스트

## 🧪 Jest 단위 테스트

### 1. Jest 설정
- [ ] **기본 Jest 설정**
  ```javascript
  // jest.config.js
  module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
    moduleNameMapping: {
      '^@/(.*)$': '<rootDir>/src/$1',
      '^@components/(.*)$': '<rootDir>/src/components/$1',
      '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
      '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    },
    collectCoverageFrom: [
      'src/**/*.{js,jsx,ts,tsx}',
      '!src/**/*.d.ts',
      '!src/main.tsx',
      '!src/vite-env.d.ts',
    ],
    coverageThreshold: {
      global: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
  }
  ```

- [ ] **테스트 설정 파일**
  ```typescript
  // src/setupTests.ts
  import '@testing-library/jest-dom';
  import { server } from './mocks/server';

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  // 전역 모킹 설정
  global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));

  // Audio API 모킹
  global.AudioContext = jest.fn().mockImplementation(() => ({
    createMediaElementSource: jest.fn(),
    createAnalyser: jest.fn(),
    createBiquadFilter: jest.fn(),
    destination: {},
    resume: jest.fn(),
  }));
  ```

### 2. 컴포넌트 테스트
- [ ] **MusicPlayer 컴포넌트 테스트**
  ```typescript
  // src/components/__tests__/MusicPlayer.test.tsx
  import { render, screen, fireEvent, waitFor } from '@testing-library/react';
  import { MusicPlayer } from '../MusicPlayer';
  import { mockTracks } from '../../mocks/tracks';

  describe('MusicPlayer', () => {
    const defaultProps = {
      tracks: mockTracks,
      onTrackChange: jest.fn(),
      onPlaybackStateChange: jest.fn(),
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('렌더링이 올바르게 되는지 확인', () => {
      render(<MusicPlayer {...defaultProps} />);
      
      expect(screen.getByRole('button', { name: /재생/i })).toBeInTheDocument();
      expect(screen.getByText(mockTracks[0].title)).toBeInTheDocument();
      expect(screen.getByText(mockTracks[0].artist)).toBeInTheDocument();
    });

    test('재생 버튼 클릭 시 재생 상태가 변경되는지 확인', async () => {
      render(<MusicPlayer {...defaultProps} />);
      
      const playButton = screen.getByRole('button', { name: /재생/i });
      fireEvent.click(playButton);
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /일시정지/i })).toBeInTheDocument();
      });
    });

    test('볼륨 조절이 작동하는지 확인', () => {
      render(<MusicPlayer {...defaultProps} />);
      
      const volumeSlider = screen.getByRole('slider', { name: /볼륨/i });
      fireEvent.change(volumeSlider, { target: { value: '50' } });
      
      expect(volumeSlider).toHaveValue('50');
    });

    test('트랙 변경 시 콜백이 호출되는지 확인', () => {
      render(<MusicPlayer {...defaultProps} />);
      
      const nextButton = screen.getByRole('button', { name: /다음/i });
      fireEvent.click(nextButton);
      
      expect(defaultProps.onTrackChange).toHaveBeenCalledWith(mockTracks[1]);
    });
  });
  ```

- [ ] **TrackCard 컴포넌트 테스트**
  ```typescript
  // src/components/__tests__/TrackCard.test.tsx
  import { render, screen, fireEvent } from '@testing-library/react';
  import { TrackCard } from '../TrackCard';
  import { mockTrack } from '../../mocks/tracks';

  describe('TrackCard', () => {
    const defaultProps = {
      track: mockTrack,
      isPlaying: false,
      isCurrentTrack: false,
      onPlay: jest.fn(),
      onPause: jest.fn(),
    };

    test('트랙 정보가 올바르게 표시되는지 확인', () => {
      render(<TrackCard {...defaultProps} />);
      
      expect(screen.getByText(mockTrack.title)).toBeInTheDocument();
      expect(screen.getByText(mockTrack.artist)).toBeInTheDocument();
      expect(screen.getByAltText(mockTrack.title)).toBeInTheDocument();
    });

    test('재생 중일 때 재생 버튼이 일시정지로 변경되는지 확인', () => {
      render(<TrackCard {...defaultProps} isPlaying={true} />);
      
      expect(screen.getByRole('button', { name: /일시정지/i })).toBeInTheDocument();
    });

    test('현재 트랙일 때 하이라이트가 적용되는지 확인', () => {
      render(<TrackCard {...defaultProps} isCurrentTrack={true} />);
      
      const card = screen.getByRole('button');
      expect(card).toHaveClass('bg-music-100');
    });

    test('재생 버튼 클릭 시 onPlay 콜백이 호출되는지 확인', () => {
      render(<TrackCard {...defaultProps} />);
      
      const playButton = screen.getByRole('button', { name: /재생/i });
      fireEvent.click(playButton);
      
      expect(defaultProps.onPlay).toHaveBeenCalledWith(mockTrack);
    });
  });
  ```

### 3. 훅 테스트
- [ ] **useMusicPlayer 훅 테스트**
  ```typescript
  // src/hooks/__tests__/useMusicPlayer.test.ts
  import { renderHook, act } from '@testing-library/react';
  import { useMusicPlayer } from '../useMusicPlayer';
  import { mockTracks } from '../../mocks/tracks';

  describe('useMusicPlayer', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('초기 상태가 올바른지 확인', () => {
      const { result } = renderHook(() => useMusicPlayer(mockTracks));
      
      expect(result.current.isPlaying).toBe(false);
      expect(result.current.currentTrack).toBe(mockTracks[0]);
      expect(result.current.currentTime).toBe(0);
      expect(result.current.volume).toBe(1);
    });

    test('재생 기능이 작동하는지 확인', () => {
      const { result } = renderHook(() => useMusicPlayer(mockTracks));
      
      act(() => {
        result.current.play();
      });
      
      expect(result.current.isPlaying).toBe(true);
    });

    test('일시정지 기능이 작동하는지 확인', () => {
      const { result } = renderHook(() => useMusicPlayer(mockTracks));
      
      act(() => {
        result.current.play();
        result.current.pause();
      });
      
      expect(result.current.isPlaying).toBe(false);
    });

    test('볼륨 조절이 작동하는지 확인', () => {
      const { result } = renderHook(() => useMusicPlayer(mockTracks));
      
      act(() => {
        result.current.setVolume(0.5);
      });
      
      expect(result.current.volume).toBe(0.5);
    });

    test('다음 트랙으로 이동하는지 확인', () => {
      const { result } = renderHook(() => useMusicPlayer(mockTracks));
      
      act(() => {
        result.current.nextTrack();
      });
      
      expect(result.current.currentTrack).toBe(mockTracks[1]);
    });
  });
  ```

### 4. 유틸리티 함수 테스트
- [ ] **오디오 유틸리티 테스트**
  ```typescript
  // src/utils/__tests__/audioUtils.test.ts
  import { formatDuration, formatTime, calculateProgress } from '../audioUtils';

  describe('audioUtils', () => {
    describe('formatDuration', () => {
      test('초 단위를 mm:ss 형식으로 변환', () => {
        expect(formatDuration(61)).toBe('1:01');
        expect(formatDuration(125)).toBe('2:05');
        expect(formatDuration(0)).toBe('0:00');
      });

      test('음수 값 처리', () => {
        expect(formatDuration(-1)).toBe('0:00');
      });
    });

    describe('formatTime', () => {
      test('시간을 읽기 쉬운 형식으로 변환', () => {
        expect(formatTime(65)).toBe('1분 5초');
        expect(formatTime(3600)).toBe('1시간');
        expect(formatTime(3661)).toBe('1시간 1분 1초');
      });
    });

    describe('calculateProgress', () => {
      test('진행률 계산', () => {
        expect(calculateProgress(30, 60)).toBe(50);
        expect(calculateProgress(0, 100)).toBe(0);
        expect(calculateProgress(100, 100)).toBe(100);
      });

      test('0으로 나누기 방지', () => {
        expect(calculateProgress(30, 0)).toBe(0);
      });
    });
  });
  ```

## 🎭 Playwright E2E 테스트

### 1. Playwright 설정
- [ ] **기본 설정**
  ```typescript
  // playwright.config.ts
  import { defineConfig, devices } from '@playwright/test';

  export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',
    use: {
      baseURL: 'http://localhost:3000',
      trace: 'on-first-retry',
      screenshot: 'only-on-failure',
      video: 'retain-on-failure',
    },
    projects: [
      {
        name: 'chromium',
        use: { ...devices['Desktop Chrome'] },
      },
      {
        name: 'firefox',
        use: { ...devices['Desktop Firefox'] },
      },
      {
        name: 'webkit',
        use: { ...devices['Desktop Safari'] },
      },
      {
        name: 'Mobile Chrome',
        use: { ...devices['Pixel 5'] },
      },
      {
        name: 'Mobile Safari',
        use: { ...devices['iPhone 12'] },
      },
    ],
    webServer: {
      command: 'npm run dev',
      url: 'http://localhost:3000',
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000,
    },
  });
  ```

### 2. 오디오 플레이어 E2E 테스트
- [ ] **기본 재생 기능 테스트**
  ```typescript
  // tests/audio-player.spec.ts
  import { test, expect } from '@playwright/test';

  test.describe('오디오 플레이어', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
    });

    test('재생 버튼 클릭 시 재생이 시작되는지 확인', async ({ page }) => {
      // 재생 버튼 클릭
      await page.click('[data-testid="play-button"]');
      
      // 재생 상태 확인
      await expect(page.locator('[data-testid="play-button"]'))
        .toHaveAttribute('aria-pressed', 'true');
      
      // 시간이 업데이트되는지 확인
      await expect(page.locator('[data-testid="current-time"]'))
        .not.toHaveText('0:00');
    });

    test('일시정지 버튼 클릭 시 재생이 멈추는지 확인', async ({ page }) => {
      // 재생 시작
      await page.click('[data-testid="play-button"]');
      
      // 일시정지
      await page.click('[data-testid="pause-button"]');
      
      // 일시정지 상태 확인
      await expect(page.locator('[data-testid="pause-button"]'))
        .toHaveAttribute('aria-pressed', 'true');
    });

    test('볼륨 조절이 작동하는지 확인', async ({ page }) => {
      const volumeSlider = page.locator('[data-testid="volume-slider"]');
      
      // 볼륨을 50%로 설정
      await volumeSlider.fill('50');
      
      // 값이 변경되었는지 확인
      await expect(volumeSlider).toHaveValue('50');
    });

    test('프로그레스 바 클릭 시 시간이 변경되는지 확인', async ({ page }) => {
      // 재생 시작
      await page.click('[data-testid="play-button"]');
      
      // 프로그레스 바 클릭
      const progressBar = page.locator('[data-testid="progress-bar"]');
      await progressBar.click({ position: { x: 100, y: 5 } });
      
      // 시간이 변경되었는지 확인
      await expect(page.locator('[data-testid="current-time"]'))
        .not.toHaveText('0:00');
    });
  });
  ```

- [ ] **플레이리스트 기능 테스트**
  ```typescript
  // tests/playlist.spec.ts
  import { test, expect } from '@playwright/test';

  test.describe('플레이리스트', () => {
    test('트랙 목록이 표시되는지 확인', async ({ page }) => {
      await page.goto('/playlist');
      
      // 트랙 목록 확인
      await expect(page.locator('[data-testid="track-item"]')).toHaveCount(3);
      
      // 첫 번째 트랙 정보 확인
      await expect(page.locator('[data-testid="track-title"]').first())
        .toContainText('Sample Track 1');
    });

    test('트랙 클릭 시 재생이 시작되는지 확인', async ({ page }) => {
      await page.goto('/playlist');
      
      // 첫 번째 트랙 클릭
      await page.click('[data-testid="track-item"]').first();
      
      // 재생 상태 확인
      await expect(page.locator('[data-testid="play-button"]'))
        .toHaveAttribute('aria-pressed', 'true');
    });

    test('다음/이전 버튼이 작동하는지 확인', async ({ page }) => {
      await page.goto('/');
      
      // 재생 시작
      await page.click('[data-testid="play-button"]');
      
      // 다음 트랙으로 이동
      await page.click('[data-testid="next-button"]');
      
      // 트랙 정보가 변경되었는지 확인
      await expect(page.locator('[data-testid="track-title"]'))
        .toContainText('Sample Track 2');
    });
  });
  ```

### 3. 반응형 디자인 테스트
- [ ] **모바일 레이아웃 테스트**
  ```typescript
  // tests/responsive.spec.ts
  import { test, expect } from '@playwright/test';

  test.describe('반응형 디자인', () => {
    test('모바일에서 플레이어가 하단에 고정되는지 확인', async ({ page }) => {
      // 모바일 뷰포트 설정
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      
      // 플레이어가 하단에 있는지 확인
      const player = page.locator('[data-testid="music-player"]');
      const playerBox = await player.boundingBox();
      
      expect(playerBox?.y).toBeGreaterThan(500);
    });

    test('태블릿에서 그리드 레이아웃이 올바른지 확인', async ({ page }) => {
      // 태블릿 뷰포트 설정
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/playlist');
      
      // 2열 그리드 확인
      const trackItems = page.locator('[data-testid="track-item"]');
      const firstItem = trackItems.first();
      const secondItem = trackItems.nth(1);
      
      const firstBox = await firstItem.boundingBox();
      const secondBox = await secondItem.boundingBox();
      
      expect(firstBox?.y).toBe(secondBox?.y);
    });

    test('데스크톱에서 사이드바가 표시되는지 확인', async ({ page }) => {
      // 데스크톱 뷰포트 설정
      await page.setViewportSize({ width: 1200, height: 800 });
      await page.goto('/');
      
      // 사이드바 확인
      await expect(page.locator('[data-testid="sidebar"]')).toBeVisible();
    });
  });
  ```

### 4. 접근성 테스트
- [ ] **키보드 네비게이션 테스트**
  ```typescript
  // tests/accessibility.spec.ts
  import { test, expect } from '@playwright/test';

  test.describe('접근성', () => {
    test('키보드로 모든 기능에 접근할 수 있는지 확인', async ({ page }) => {
      await page.goto('/');
      
      // Tab 키로 포커스 이동
      await page.keyboard.press('Tab');
      
      // 재생 버튼에 포커스가 있는지 확인
      await expect(page.locator('[data-testid="play-button"]'))
        .toBeFocused();
      
      // Enter 키로 재생
      await page.keyboard.press('Enter');
      
      // 재생 상태 확인
      await expect(page.locator('[data-testid="play-button"]'))
        .toHaveAttribute('aria-pressed', 'true');
    });

    test('스크린 리더가 올바른 정보를 읽는지 확인', async ({ page }) => {
      await page.goto('/');
      
      // aria-label 확인
      await expect(page.locator('[data-testid="play-button"]'))
        .toHaveAttribute('aria-label');
      
      // aria-pressed 상태 확인
      await expect(page.locator('[data-testid="play-button"]'))
        .toHaveAttribute('aria-pressed', 'false');
    });

    test('색상 대비가 충분한지 확인', async ({ page }) => {
      await page.goto('/');
      
      // 텍스트 색상과 배경색 대비 확인
      const textElement = page.locator('[data-testid="track-title"]');
      const color = await textElement.evaluate(el => 
        window.getComputedStyle(el).color
      );
      const backgroundColor = await textElement.evaluate(el => 
        window.getComputedStyle(el).backgroundColor
      );
      
      // 대비 비율 계산 (실제 구현에서는 더 정확한 계산 필요)
      expect(color).not.toBe(backgroundColor);
    });
  });
  ```

## 📊 테스트 커버리지

### 1. 커버리지 설정
- [ ] **Jest 커버리지 설정**
  ```javascript
  // jest.config.js
  module.exports = {
    // ... 기존 설정
    collectCoverageFrom: [
      'src/**/*.{js,jsx,ts,tsx}',
      '!src/**/*.d.ts',
      '!src/main.tsx',
      '!src/vite-env.d.ts',
      '!src/mocks/**',
      '!src/**/*.stories.{js,jsx,ts,tsx}',
    ],
    coverageThreshold: {
      global: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
      './src/components/': {
        branches: 85,
        functions: 85,
        lines: 85,
        statements: 85,
      },
      './src/hooks/': {
        branches: 90,
        functions: 90,
        lines: 90,
        statements: 90,
      },
    },
  }
  ```

### 2. 커버리지 리포트
- [ ] **HTML 커버리지 리포트**
  ```json
  // package.json
  {
    "scripts": {
      "test:coverage": "jest --coverage --coverageReporters=html",
      "test:coverage:watch": "jest --coverage --watch"
    }
  }
  ```

## 🔄 CI/CD 통합

### 1. GitHub Actions 설정
- [ ] **테스트 워크플로우**
  ```yaml
  # .github/workflows/test.yml
  name: Test

  on:
    push:
      branches: [ main, develop ]
    pull_request:
      branches: [ main ]

  jobs:
    test:
      runs-on: ubuntu-latest

      steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm run test:coverage
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
          flags: unittests
          name: codecov-umbrella
          fail_ci_if_error: true
  ```

### 2. 테스트 자동화
- [ ] **프리커밋 훅**
  ```json
  // package.json
  {
    "husky": {
      "hooks": {
        "pre-commit": "lint-staged",
        "pre-push": "npm run test:coverage"
      }
    },
    "lint-staged": {
      "*.{js,jsx,ts,tsx}": [
        "eslint --fix",
        "prettier --write",
        "jest --bail --findRelatedTests"
      ]
    }
  }
  ```

---

*이 체크리스트는 Jest와 Playwright를 활용하여 안정적이고 신뢰할 수 있는 오디오 플레이어 애플리케이션을 테스트하기 위한 가이드입니다.* 