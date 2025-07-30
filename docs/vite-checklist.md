# Vite 개발 체크리스트

## 🚀 프로젝트 설정

### 1. 프로젝트 초기화
- [ ] **Vite 프로젝트 생성**
  ```bash
  npm create vite@latest oh-v1 -- --template react-ts
  cd oh-v1
  npm install
  ```

- [ ] **기본 설정 파일**
  ```typescript
  // vite.config.ts
  import { defineConfig } from 'vite'
  import react from '@vitejs/plugin-react'
  import path from 'path'

  export default defineConfig({
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@components': path.resolve(__dirname, './src/components'),
        '@hooks': path.resolve(__dirname, './src/hooks'),
        '@utils': path.resolve(__dirname, './src/utils'),
        '@types': path.resolve(__dirname, './src/types'),
      }
    },
    server: {
      port: 3000,
      open: true,
      host: true
    }
  })
  ```

### 2. 환경 설정
- [ ] **환경 변수 설정**
  ```bash
  # .env
  VITE_APP_TITLE=Oh Music Player
  VITE_API_URL=http://localhost:8000
  VITE_AUDIO_BASE_URL=/audio/
  ```

  ```bash
  # .env.development
  VITE_DEBUG=true
  VITE_LOG_LEVEL=debug
  ```

  ```bash
  # .env.production
  VITE_DEBUG=false
  VITE_LOG_LEVEL=error
  ```

## 📦 의존성 관리

### 1. 핵심 의존성
- [ ] **React 및 TypeScript**
  ```bash
  npm install react react-dom
  npm install --save-dev @types/react @types/react-dom
  ```

- [ ] **오디오 관련**
  ```bash
  npm install howler
  npm install --save-dev @types/howler
  ```

- [ ] **스타일링**
  ```bash
  npm install tailwindcss postcss autoprefixer
  npm install @headlessui/react @heroicons/react
  ```

### 2. 개발 도구
- [ ] **개발 서버 및 빌드**
  ```bash
  npm install --save-dev vite @vitejs/plugin-react
  npm install --save-dev typescript @types/node
  ```

- [ ] **코드 품질**
  ```bash
  npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
  npm install --save-dev prettier eslint-config-prettier eslint-plugin-prettier
  npm install --save-dev husky lint-staged
  ```

## ⚡ 개발 서버 최적화

### 1. HMR (Hot Module Replacement)
- [ ] **React Fast Refresh 설정**
  ```typescript
  // vite.config.ts
  export default defineConfig({
    plugins: [react()],
    server: {
      hmr: {
        overlay: true
      }
    }
  })
  ```

- [ ] **커스텀 HMR 처리**
  ```typescript
  // src/hmr.ts
  if (import.meta.hot) {
    import.meta.hot.accept((newModule) => {
      // 커스텀 HMR 로직
      console.log('모듈이 업데이트되었습니다');
    });
  }
  ```

### 2. 개발 서버 설정
- [ ] **프록시 설정**
  ```typescript
  // vite.config.ts
  export default defineConfig({
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:8000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        },
        '/audio': {
          target: 'http://localhost:8000',
          changeOrigin: true
        }
      }
    }
  })
  ```

## 🎵 오디오 파일 처리

### 1. 정적 파일 관리
- [ ] **오디오 파일 구조**
  ```
  public/
  ├── audio/
  │   ├── tracks/
  │   │   ├── track1.mp3
  │   │   ├── track2.mp3
  │   │   └── track3.mp3
  │   └── samples/
  │       ├── click.mp3
  │       └── notification.mp3
  └── images/
      ├── covers/
      └── icons/
  ```

- [ ] **오디오 파일 로딩**
  ```typescript
  // src/utils/audioLoader.ts
  export const loadAudioFile = (filename: string): string => {
    return new URL(`/audio/tracks/${filename}`, import.meta.url).href;
  };

  export const preloadAudio = (urls: string[]): Promise<void[]> => {
    return Promise.all(
      urls.map(url => {
        return new Promise<void>((resolve, reject) => {
          const audio = new Audio();
          audio.oncanplaythrough = () => resolve();
          audio.onerror = () => reject();
          audio.src = url;
        });
      })
    );
  };
  ```

### 2. 오디오 메타데이터 처리
- [ ] **메타데이터 로딩**
  ```typescript
  // src/utils/metadata.ts
  export interface AudioMetadata {
    title: string;
    artist: string;
    album?: string;
    duration: number;
    coverUrl?: string;
  }

  export const extractMetadata = async (file: File): Promise<AudioMetadata> => {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.onloadedmetadata = () => {
        resolve({
          title: file.name.replace(/\.[^/.]+$/, ''),
          artist: 'Unknown Artist',
          duration: audio.duration,
        });
      };
      audio.onerror = reject;
      audio.src = URL.createObjectURL(file);
    });
  };
  ```

## 📦 빌드 최적화

### 1. 번들 분석
- [ ] **번들 분석 도구**
  ```bash
  npm install --save-dev rollup-plugin-visualizer
  ```

  ```typescript
  // vite.config.ts
  import { visualizer } from 'rollup-plugin-visualizer';

  export default defineConfig({
    plugins: [
      react(),
      visualizer({
        filename: 'dist/stats.html',
        open: true,
        gzipSize: true,
        brotliSize: true,
      })
    ]
  })
  ```

### 2. 코드 스플리팅
- [ ] **라우트 기반 스플리팅**
  ```typescript
  // src/App.tsx
  import { lazy, Suspense } from 'react';

  const HomePage = lazy(() => import('./pages/HomePage'));
  const PlayerPage = lazy(() => import('./pages/PlayerPage'));
  const PlaylistPage = lazy(() => import('./pages/PlaylistPage'));

  function App() {
    return (
      <Suspense fallback={<div>로딩 중...</div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/player" element={<PlayerPage />} />
          <Route path="/playlist" element={<PlaylistPage />} />
        </Routes>
      </Suspense>
    );
  }
  ```

- [ ] **컴포넌트 지연 로딩**
  ```typescript
  // src/components/AudioVisualizer.tsx
  const AudioVisualizer = lazy(() => import('./AudioVisualizer'));

  // 조건부 로딩
  {showVisualizer && (
    <Suspense fallback={<div>시각화 로딩 중...</div>}>
      <AudioVisualizer />
    </Suspense>
  )}
  ```

## 🎨 CSS 및 스타일링

### 1. Tailwind CSS 설정
- [ ] **Tailwind 설정**
  ```javascript
  // tailwind.config.js
  /** @type {import('tailwindcss').Config} */
  module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          'music': {
            50: '#fef7ff',
            500: '#e85dff',
            600: '#d633ff',
          }
        },
        animation: {
          'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        }
      },
    },
    plugins: [],
  }
  ```

- [ ] **PostCSS 설정**
  ```javascript
  // postcss.config.js
  module.exports = {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  }
  ```

### 2. CSS 최적화
- [ ] **CSS 코드 스플리팅**
  ```typescript
  // vite.config.ts
  export default defineConfig({
    build: {
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            audio: ['howler'],
            ui: ['@headlessui/react', '@heroicons/react']
          }
        }
      }
    }
  })
  ```

## 🔧 개발 도구 통합

### 1. ESLint 설정
- [ ] **ESLint 설정**
  ```javascript
  // .eslintrc.js
  module.exports = {
    root: true,
    env: { browser: true, es2020: true },
    extends: [
      'eslint:recommended',
      '@typescript-eslint/recommended',
      'plugin:react-hooks/recommended',
      'plugin:prettier/recommended'
    ],
    ignorePatterns: ['dist', '.eslintrc.js'],
    parser: '@typescript-eslint/parser',
    plugins: ['react-refresh'],
    rules: {
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  }
  ```

### 2. Prettier 설정
- [ ] **Prettier 설정**
  ```json
  // .prettierrc
  {
    "semi": true,
    "trailingComma": "es5",
    "singleQuote": true,
    "printWidth": 80,
    "tabWidth": 2,
    "useTabs": false
  }
  ```

## 🧪 테스트 설정

### 1. Jest 설정
- [ ] **Jest 설정**
  ```javascript
  // jest.config.js
  module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
    moduleNameMapping: {
      '^@/(.*)$': '<rootDir>/src/$1',
    },
    collectCoverageFrom: [
      'src/**/*.{js,jsx,ts,tsx}',
      '!src/**/*.d.ts',
    ],
  }
  ```

### 2. Playwright 설정
- [ ] **Playwright 설정**
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
    ],
    webServer: {
      command: 'npm run dev',
      url: 'http://localhost:3000',
      reuseExistingServer: !process.env.CI,
    },
  });
  ```

## 🚀 배포 최적화

### 1. 프로덕션 빌드
- [ ] **빌드 최적화**
  ```typescript
  // vite.config.ts
  export default defineConfig({
    build: {
      target: 'es2015',
      minify: 'terser',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            audio: ['howler'],
          }
        }
      }
    }
  })
  ```

### 2. 환경별 설정
- [ ] **환경별 빌드**
  ```json
  // package.json
  {
    "scripts": {
      "build": "vite build",
      "build:staging": "vite build --mode staging",
      "build:production": "vite build --mode production",
      "preview": "vite preview"
    }
  }
  ```

## 📊 성능 모니터링

### 1. 번들 분석
- [ ] **번들 크기 모니터링**
  ```typescript
  // vite.config.ts
  import { visualizer } from 'rollup-plugin-visualizer';

  export default defineConfig({
    plugins: [
      react(),
      visualizer({
        filename: 'dist/stats.html',
        open: true,
        gzipSize: true,
        brotliSize: true,
      })
    ]
  })
  ```

### 2. 성능 메트릭
- [ ] **Core Web Vitals 모니터링**
  ```typescript
  // src/utils/performance.ts
  export const measurePerformance = () => {
    if ('performance' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.log(`${entry.name}: ${entry.startTime}ms`);
        }
      });
      
      observer.observe({ entryTypes: ['measure'] });
    }
  };
  ```

## 🔒 보안 설정

### 1. CSP (Content Security Policy)
- [ ] **CSP 헤더 설정**
  ```typescript
  // vite.config.ts
  export default defineConfig({
    server: {
      headers: {
        'Content-Security-Policy': `
          default-src 'self';
          script-src 'self' 'unsafe-inline' 'unsafe-eval';
          style-src 'self' 'unsafe-inline';
          img-src 'self' data: https:;
          media-src 'self' blob:;
          connect-src 'self' ws: wss:;
        `.replace(/\s+/g, ' ').trim()
      }
    }
  })
  ```

### 2. 환경 변수 보안
- [ ] **환경 변수 검증**
  ```typescript
  // src/config/env.ts
  const requiredEnvVars = [
    'VITE_APP_TITLE',
    'VITE_API_URL'
  ] as const;

  export const validateEnv = () => {
    for (const envVar of requiredEnvVars) {
      if (!import.meta.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
      }
    }
  };
  ```

## 📱 PWA 설정

### 1. PWA 플러그인
- [ ] **PWA 설정**
  ```bash
  npm install vite-plugin-pwa
  ```

  ```typescript
  // vite.config.ts
  import { VitePWA } from 'vite-plugin-pwa';

  export default defineConfig({
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,mp3}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/api\./,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'api-cache',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 // 24시간
                }
              }
            }
          ]
        }
      })
    ]
  })
  ```

---

*이 체크리스트는 Vite를 활용하여 빠르고 최적화된 오디오 플레이어 애플리케이션을 개발하기 위한 가이드입니다.* 