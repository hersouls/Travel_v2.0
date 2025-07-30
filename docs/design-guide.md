# 🎨 Moonwave 디자인 가이드

## 목차
1. [개요](#개요)
2. [디자인 철학](#디자인-철학)
3. [색상 시스템](#색상-시스템)
4. [타이포그래피](#타이포그래피)
5. [컴포넌트 시스템](#컴포넌트-시스템)
6. [레이아웃 & 스페이싱](#레이아웃--스페이싱)
7. [애니메이션 & 인터랙션](#애니메이션--인터랙션)
8. [접근성](#접근성)
9. [반응형 디자인](#반응형-디자인)
10. [성능 최적화](#성능-최적화)

---

## 개요

Moonwave는 **글래스모피즘(Glassmorphism)**과 **웨이브 애니메이션**을 기반으로 한 현대적인 디자인 시스템입니다. 오안나의 음악과 스토리를 담는 플랫폼으로, 우아하고 몽환적인 사용자 경험을 제공합니다.

### 핵심 특징
- 🌊 **웨이브 애니메이션**: 유동적이고 생동감 있는 인터랙션
- 🪟 **글래스모피즘**: 투명도와 블러 효과를 활용한 현대적 UI
- 🎵 **음악 중심**: 오디오 플레이어에 최적화된 인터페이스
- 📱 **반응형**: 모든 디바이스에서 일관된 경험

---

## 디자인 철학

### 1. 유동성 (Fluidity)
- 웨이브 애니메이션으로 자연스러운 전환
- 부드러운 곡선과 유기적 형태
- 사용자 액션에 반응하는 인터랙티브 요소

### 2. 투명성 (Transparency)
- 글래스모피즘을 통한 깊이감 표현
- 레이어링을 통한 정보 계층화
- 배경과의 조화로운 통합

### 3. 음악성 (Musicality)
- 오디오 시각화 요소
- 리듬감 있는 애니메이션
- 음악과 동기화된 인터랙션

---

## 색상 시스템

### 기본 색상 팔레트

#### Primary Colors
```css
primary: {
  DEFAULT: '#3b82f6',    /* Blue */
  foreground: '#ffffff',
  hover: '#2563eb',
  active: '#1d4ed8',
  light: '#dbeafe',
}
```

#### Secondary Colors
```css
secondary: {
  DEFAULT: '#a855f7',    /* Purple */
  foreground: '#ffffff',
  hover: '#9333ea',
  active: '#7e22ce',
  light: '#e9d5ff',
}
```

#### Grayscale Colors
```css
grayscale: {
  background: '#0f0f23',     /* Dark Blue-Black */
  foreground: '#f8fafc',     /* Off-White */
  card: '#1a1a2e',           /* Card Background */
  muted: '#16213e',          /* Muted Background */
  'muted-foreground': '#8b8da6', /* Muted Text */
  border: 'rgba(255, 255, 255, 0.1)', /* Border */
}
```

### 상태 색상 (State Colors)
```css
success: '#10b981'    /* Green */
warning: '#f59e0b'    /* Orange */
error: '#ef4444'      /* Red */
info: '#3b82f6'       /* Blue */
```

### 페이즈별 색상 테마
```javascript
getPhaseColors(phase) {
  beginning: {
    gradient: 'from-blue-400/30 to-cyan-400/30',
    text: 'text-blue-400',
    bg: 'bg-blue-400/20',
    border: 'border-blue-400/30'
  },
  growth: {
    gradient: 'from-purple-400/30 to-violet-400/30',
    text: 'text-purple-400',
    bg: 'bg-purple-400/20',
    border: 'border-purple-400/30'
  },
  challenge: {
    gradient: 'from-orange-400/30 to-red-400/30',
    text: 'text-orange-400',
    bg: 'bg-orange-400/20',
    border: 'border-orange-400/30'
  },
  shine: {
    gradient: 'from-yellow-400/30 to-amber-400/30',
    text: 'text-yellow-400',
    bg: 'bg-yellow-400/20',
    border: 'border-yellow-400/30'
  }
}
```

### 색상 사용 가이드라인

#### 투명도 레벨
- `bg-white/5` - 매우 연한 배경
- `bg-white/10` - 연한 배경
- `bg-white/20` - 중간 배경
- `bg-white/30` - 진한 배경

#### 그라디언트 패턴
```css
/* 기본 그라디언트 */
bg-gradient-to-br from-color-400/30 to-color-600/30

/* 웨이브 그라디언트 */
from-color-400/30 via-color-500/20 to-color-600/30
```

---

## 타이포그래피

### 폰트 시스템

#### 기본 폰트
- **주 폰트**: Pretendard Variable
- **폴백**: Inter, system-ui, sans-serif
- **한글 최적화**: 자간 및 줄바꿈 최적화

#### 폰트 스케일
```css
/* 한글 최적화 폰트 크기 */
text-xs-ko: 0.75rem (12px)
text-sm-ko: 0.875rem (14px)
text-base-ko: 1rem (16px)
text-lg-ko: 1.125rem (18px)
text-xl-ko: 1.25rem (20px)
text-2xl-ko: 1.5rem (24px)
text-3xl-ko: 1.875rem (30px)
text-4xl-ko: 2.25rem (36px)
text-5xl-ko: 3rem (48px)
text-6xl-ko: 3.75rem (60px)
text-7xl-ko: 4.5rem (72px)
```

#### 자간 설정
```css
tracking-ko-tight: -0.02em
tracking-ko-normal: -0.01em
tracking-ko-wide: 0
```

### 타이포그래피 가이드라인

#### 제목 계층
- **H1**: `text-4xl-ko font-bold` - 메인 제목
- **H2**: `text-3xl-ko font-semibold` - 섹션 제목
- **H3**: `text-2xl-ko font-semibold` - 서브 섹션
- **H4**: `text-xl-ko font-medium` - 카드 제목

#### 본문 텍스트
- **기본**: `text-base-ko` - 일반 텍스트
- **작은 텍스트**: `text-sm-ko` - 부가 정보
- **큰 텍스트**: `text-lg-ko` - 강조 텍스트

#### 한글 최적화
```css
.break-keep-ko {
  word-break: keep-all;
  overflow-wrap: break-word;
}
```

---

## 컴포넌트 시스템

### 1. GlassCard

글래스모피즘 효과를 적용한 기본 카드 컴포넌트

#### Variants
```typescript
variant: 'default' | 'strong' | 'light'
```

#### Props
```typescript
interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'strong' | 'light';
  withWaveEffect?: boolean;
  hoverable?: boolean;
}
```

#### 사용 예시
```tsx
<GlassCard variant="strong" withWaveEffect={true}>
  <h2>제목</h2>
  <p>내용</p>
</GlassCard>
```

### 2. WaveButton

웨이브 애니메이션이 적용된 버튼 컴포넌트

#### Variants
```typescript
variant: 'primary' | 'secondary' | 'ghost'
size: 'sm' | 'md' | 'lg'
```

#### Props
```typescript
interface WaveButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  ariaLabel?: string;
  disabled?: boolean;
}
```

#### 사용 예시
```tsx
<WaveButton 
  variant="primary" 
  size="md" 
  onClick={handleClick}
  ariaLabel="재생 버튼"
>
  재생
</WaveButton>
```

### 3. MusicPlayer

음악 플레이어 전용 컴포넌트

#### 주요 기능
- 재생/일시정지 컨트롤
- 진행률 표시
- 볼륨 조절
- 트랙 정보 표시

### 4. TrackCard

음악 트랙 정보를 표시하는 카드

#### 특징
- 호버 효과
- 재생 상태 표시
- 트랙 정보 레이아웃

---

## 레이아웃 & 스페이싱

### 그리드 시스템

#### 기본 그리드
```css
/* 1열 (모바일) */
grid-cols-1

/* 2열 (태블릿) */
md:grid-cols-2

/* 3열 (데스크톱) */
lg:grid-cols-3
```

#### 반응형 브레이크포인트
- **모바일**: < 768px
- **태블릿**: 768px - 1024px
- **데스크톱**: > 1024px

### 스페이싱

#### 기본 스페이싱
```css
space-y-4: 1rem (16px)
space-y-6: 1.5rem (24px)
space-y-8: 2rem (32px)
space-y-12: 3rem (48px)
```

#### 패딩
```css
p-4: 1rem (16px)
p-6: 1.5rem (24px)
p-8: 2rem (32px)
```

#### 마진
```css
mb-4: 1rem (16px)
mb-6: 1.5rem (24px)
mb-8: 2rem (32px)
```

### 레이아웃 패턴

#### 헤더 레이아웃
```tsx
<header className="fixed top-0 left-0 right-0 z-40 p-4">
  <div className="max-w-4xl mx-auto">
    <GlassCard variant="strong" className="p-4">
      {/* 헤더 내용 */}
    </GlassCard>
  </div>
</header>
```

#### 메인 콘텐츠
```tsx
<main className="relative z-10 pt-32 pb-32 px-4">
  <div className="max-w-4xl mx-auto space-y-8">
    {/* 콘텐츠 */}
  </div>
</main>
```

---

## 애니메이션 & 인터랙션

### 웨이브 애니메이션

#### 기본 웨이브
```css
@keyframes wave {
  0%, 100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
}
```

#### 웨이브 펄스
```css
@keyframes wave-pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.7;
  }
}
```

### 호버 효과

#### 카드 호버
```css
hover:bg-white/15 
hover:border-white/40 
hover:translate-y-[-2px] 
hover:shadow-xl
```

#### 버튼 호버
```css
hover:bg-white/30
active:scale-95
```

### 전환 효과

#### 기본 전환
```css
transition-all duration-300
```

#### 성능 최적화
```css
transform-gpu will-change-transform
```

### 애니메이션 클래스

#### 사용 가능한 애니메이션
- `wave-pulse`: 2초 무한 반복
- `float`: 6초 부드러운 상하 움직임
- `glow`: 2초 글로우 효과
- `slide-up`: 0.5초 위로 슬라이드
- `slide-down`: 0.5초 아래로 슬라이드
- `fade-in`: 0.5초 페이드 인
- `fade-out`: 0.5초 페이드 아웃

---

## 접근성

### 키보드 네비게이션
- 모든 인터랙티브 요소는 키보드로 접근 가능
- 포커스 표시기 명확히 제공
- Tab 순서 논리적으로 구성

### 스크린 리더 지원
- 적절한 `aria-label` 제공
- 의미있는 HTML 구조
- 상태 정보 명확히 전달

### 색상 대비
- WCAG AA 기준 준수
- 텍스트와 배경 간 충분한 대비
- 색상만으로 정보 전달하지 않음

### 모션 감소
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 반응형 디자인

### 모바일 우선 접근법

#### 기본 스타일 (모바일)
```css
/* 기본 스타일은 모바일용 */
.container {
  padding: 1rem;
  font-size: 1rem;
}
```

#### 태블릿 (768px+)
```css
@media (min-width: 768px) {
  .container {
    padding: 1.5rem;
    font-size: 1.125rem;
  }
}
```

#### 데스크톱 (1024px+)
```css
@media (min-width: 1024px) {
  .container {
    padding: 2rem;
    font-size: 1.25rem;
  }
}
```

### 반응형 패턴

#### 그리드 레이아웃
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* 카드들 */}
</div>
```

#### 텍스트 크기
```tsx
<h1 className="text-2xl sm:text-3xl lg:text-4xl">
  제목
</h1>
```

#### 패딩 조정
```tsx
<div className="p-4 sm:p-6 lg:p-8">
  {/* 콘텐츠 */}
</div>
```

---

## 성능 최적화

### 애니메이션 최적화

#### GPU 가속 활용
```css
transform-gpu will-change-transform
```

#### 애니메이션 성능 최적화
```css
/* 불필요한 리페인트 방지 */
backface-visibility: hidden;
transform: translateZ(0);
```

### 이미지 최적화

#### 지연 로딩
```tsx
<ImageWithFallback
  src={imageUrl}
  alt={altText}
  loading="lazy"
/>
```

#### 적응형 이미지
```tsx
<img 
  srcSet={`${imageUrl} 300w, ${imageUrl}@2x 600w`}
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

### 코드 스플리팅

#### 컴포넌트 지연 로딩
```tsx
const LazyComponent = React.lazy(() => import('./Component'));
```

#### 라우트 기반 스플리팅
```tsx
const AboutPage = React.lazy(() => import('./components/AboutPage'));
```

---

## 디자인 토큰

### 색상 토큰
```css
:root {
  --color-primary: #3b82f6;
  --color-secondary: #a855f7;
  --color-background: #0f0f23;
  --color-foreground: #f8fafc;
  --color-border: rgba(255, 255, 255, 0.1);
}
```

### 간격 토큰
```css
:root {
  --spacing-xs: 0.25rem;   /* 4px */
  --spacing-sm: 0.5rem;    /* 8px */
  --spacing-md: 1rem;      /* 16px */
  --spacing-lg: 1.5rem;    /* 24px */
  --spacing-xl: 2rem;      /* 32px */
  --spacing-2xl: 3rem;     /* 48px */
}
```

### 타이포그래피 토큰
```css
:root {
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;
}
```

---

## 사용 가이드라인

### 1. 일관성 유지
- 동일한 기능은 동일한 스타일 적용
- 색상과 간격의 일관된 사용
- 컴포넌트 재사용 최대화

### 2. 성능 고려
- 애니메이션은 GPU 가속 활용
- 불필요한 리렌더링 방지
- 이미지 최적화 적용

### 3. 접근성 우선
- 키보드 네비게이션 지원
- 스크린 리더 호환성
- 색상 대비 준수

### 4. 반응형 디자인
- 모바일 우선 접근법
- 터치 인터페이스 최적화
- 다양한 화면 크기 대응

---

## 체크리스트

### 개발 전
- [ ] 디자인 시스템 이해
- [ ] 컴포넌트 재사용 가능성 검토
- [ ] 접근성 요구사항 확인
- [ ] 성능 최적화 방안 검토

### 개발 중
- [ ] 일관된 스타일 적용
- [ ] 반응형 디자인 구현
- [ ] 애니메이션 성능 최적화
- [ ] 접근성 테스트

### 개발 후
- [ ] 크로스 브라우저 테스트
- [ ] 성능 측정
- [ ] 접근성 검증
- [ ] 사용자 피드백 수집

---

## 참고 자료

- [Tailwind CSS 공식 문서](https://tailwindcss.com/docs)
- [Pretendard 폰트](https://github.com/orioncactus/pretendard)
- [WCAG 접근성 가이드라인](https://www.w3.org/WAI/WCAG21/quickref/)
- [CSS 애니메이션 성능 최적화](https://web.dev/animations/)

---

*이 디자인 가이드는 Moonwave 프로젝트의 일관된 사용자 경험을 위해 지속적으로 업데이트됩니다.* 