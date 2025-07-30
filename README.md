# Moonwave - 음악 여정

React 19, TypeScript, Tailwind CSS, Howler.js를 활용한 현대적인 음악 플레이어 애플리케이션입니다.

## 🚀 기술 스택

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS
- **Audio**: Howler.js
- **Build**: Vite
- **Testing**: Jest, Playwright
- **Deployment**: Nginx, SSL

## 📦 설치 및 실행

### 의존성 설치
```bash
npm install
```

### 개발 서버 실행
```bash
npm run dev
```

### 빌드
```bash
npm run build
```

### 테스트 실행
```bash
# 단위 테스트
npm test

# E2E 테스트
npm run test:e2e

# 타입 체크
npm run type-check
```

## 🏗️ 프로젝트 구조

```
Moonwave/
├── src/                    # React 소스 코드
│   ├── App.tsx            # 메인 앱 컴포넌트
│   ├── main.tsx           # 진입점
│   └── index.css          # 글로벌 스타일
├── components/             # React 컴포넌트
│   ├── IntroPage.tsx      # 인트로 페이지
│   ├── MainPage.tsx       # 메인 페이지
│   ├── DetailPage.tsx     # 상세 페이지
│   ├── MusicPlayer.tsx    # 음악 플레이어
│   └── ui/                # UI 컴포넌트
├── hooks/                 # 커스텀 훅
│   └── useMusicPlayer.ts  # 음악 플레이어 훅
├── types/                 # TypeScript 타입 정의
├── data/                  # 데이터 파일
├── utils/                 # 유틸리티 함수
├── styles/                # 스타일 파일
└── docs/                  # 개발 문서
```

## 🎯 주요 기능

- **React 19 최신 기능 활용**
  - `startTransition`을 통한 성능 최적화
  - Suspense를 활용한 로딩 상태 관리
  - 새로운 훅들과 동시성 기능

- **TypeScript 타입 안전성**
  - 엄격한 타입 체크
  - 인터페이스 기반 컴포넌트 설계
  - 제네릭과 타입 가드 활용

- **Tailwind CSS 스타일링**
  - 커스텀 테마 (음악 플레이어 전용)
  - 반응형 디자인
  - 다크 모드 지원
  - 애니메이션 효과

- **Howler.js 오디오 기능**
  - 다중 포맷 오디오 지원
  - 플레이리스트 관리
  - 볼륨 및 재생 제어
  - 오디오 이펙트

## 🧪 테스트

### 단위 테스트 (Jest)
```bash
npm test
```

### E2E 테스트 (Playwright)
```bash
npm run test:e2e
```

## 📚 개발 가이드

자세한 개발 가이드는 `docs/` 폴더를 참조하세요:

- `docs/development-checklist.md` - 전체 개발 체크리스트
- `docs/react-checklist.md` - React 19 개발 가이드
- `docs/typescript-checklist.md` - TypeScript 가이드
- `docs/tailwind-checklist.md` - Tailwind CSS 가이드
- `docs/howler-checklist.md` - Howler.js 가이드
- `docs/vite-checklist.md` - Vite 설정 가이드
- `docs/testing-checklist.md` - 테스트 가이드
- `docs/deployment-checklist.md` - 배포 가이드

## 🚀 배포

### 개발 환경
```bash
npm run dev
```

### 프로덕션 빌드
```bash
npm run build
```

### 프리뷰
```bash
npm run preview
```

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 🤝 기여

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
