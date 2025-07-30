# Tailwind CSS 개발 체크리스트

## 🎨 디자인 시스템 구축

### 1. 기본 설정
- [ ] **tailwind.config.js 설정**
  - [ ] 커스텀 색상 팔레트 정의
  - [ ] 폰트 패밀리 설정
  - [ ] 스페이싱 스케일 정의
  - [ ] 브레이크포인트 설정
  - [ ] 애니메이션 커스텀

- [ ] **CSS 변수 활용**
  ```css
  :root {
    --primary-color: #3b82f6;
    --secondary-color: #8b5cf6;
    --accent-color: #f59e0b;
    --background-color: #ffffff;
    --text-color: #1f2937;
  }
  ```

### 2. 오디오 플레이어 특화 색상
- [ ] **음악 테마 색상**
  ```javascript
  // tailwind.config.js
  module.exports = {
    theme: {
      extend: {
        colors: {
          'music': {
            50: '#fef7ff',
            100: '#fdeeff',
            200: '#fbdfff',
            300: '#f8bfff',
            400: '#f293ff',
            500: '#e85dff',
            600: '#d633ff',
            700: '#b91cff',
            800: '#9b1cff',
            900: '#7c1cff',
          },
          'wave': {
            primary: '#3b82f6',
            secondary: '#8b5cf6',
            accent: '#f59e0b',
            dark: '#1e293b',
            light: '#f8fafc',
          }
        }
      }
    }
  }
  ```

## 🎵 오디오 플레이어 컴포넌트

### 1. 플레이어 컨트롤
- [ ] **재생 버튼**
  ```jsx
  <button className="
    w-12 h-12 
    bg-music-600 hover:bg-music-700 
    text-white 
    rounded-full 
    flex items-center justify-center
    transition-all duration-200 
    transform hover:scale-105
    focus:outline-none focus:ring-2 focus:ring-music-500 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  ">
    <PlayIcon className="w-6 h-6" />
  </button>
  ```

- [ ] **프로그레스 바**
  ```jsx
  <div className="relative w-full h-2 bg-gray-200 rounded-full">
    <div 
      className="absolute h-full bg-gradient-to-r from-music-500 to-music-600 rounded-full transition-all duration-100"
      style={{ width: `${progress}%` }}
    />
    <div className="absolute inset-0 rounded-full cursor-pointer" />
  </div>
  ```

### 2. 트랙 카드
- [ ] **트랙 아이템**
  ```jsx
  <div className="
    flex items-center space-x-4 
    p-4 
    bg-white dark:bg-gray-800 
    rounded-lg 
    shadow-sm hover:shadow-md 
    transition-all duration-200 
    cursor-pointer
    border border-gray-100 dark:border-gray-700
    hover:border-music-200 dark:hover:border-music-700
  ">
    <img 
      src={track.coverImage} 
      alt={track.title}
      className="w-12 h-12 rounded-md object-cover"
    />
    <div className="flex-1 min-w-0">
      <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
        {track.title}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
        {track.artist}
      </p>
    </div>
    <div className="text-xs text-gray-400 dark:text-gray-500">
      {formatDuration(track.duration)}
    </div>
  </div>
  ```

## 📱 반응형 디자인

### 1. 브레이크포인트 전략
- [ ] **모바일 우선 접근법**
  ```jsx
  <div className="
    grid 
    grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
    gap-4 sm:gap-6 lg:gap-8
    p-4 sm:p-6 lg:p-8
  ">
    {/* 트랙 카드들 */}
  </div>
  ```

- [ ] **플레이어 레이아웃**
  ```jsx
  <div className="
    fixed bottom-0 left-0 right-0
    bg-white dark:bg-gray-900
    border-t border-gray-200 dark:border-gray-700
    p-4
    z-50
  ">
    <div className="
      max-w-7xl mx-auto
      flex flex-col sm:flex-row 
      items-center 
      space-y-4 sm:space-y-0 sm:space-x-6
    ">
      {/* 플레이어 컨트롤 */}
    </div>
  </div>
  ```

### 2. 터치 인터랙션
- [ ] **터치 친화적 버튼**
  ```jsx
  <button className="
    w-14 h-14 sm:w-12 sm:h-12
    bg-music-600 hover:bg-music-700 active:bg-music-800
    text-white 
    rounded-full 
    flex items-center justify-center
    transition-all duration-150
    transform active:scale-95
    touch-manipulation
    select-none
  ">
    <PlayIcon className="w-6 h-6 sm:w-5 sm:h-5" />
  </button>
  ```

## 🌙 다크모드 지원

### 1. 다크모드 설정
- [ ] **tailwind.config.js 다크모드**
  ```javascript
  module.exports = {
    darkMode: 'class', // 또는 'media'
    // ...
  }
  ```

- [ ] **다크모드 토글**
  ```jsx
  <button 
    onClick={toggleDarkMode}
    className="
      p-2 
      rounded-lg 
      bg-gray-100 dark:bg-gray-800 
      text-gray-600 dark:text-gray-300
      hover:bg-gray-200 dark:hover:bg-gray-700
      transition-colors duration-200
    "
  >
    <SunIcon className="w-5 h-5" />
  </button>
  ```

### 2. 다크모드 색상 팔레트
- [ ] **컴포넌트별 다크모드**
  ```jsx
  <div className="
    bg-white dark:bg-gray-900
    text-gray-900 dark:text-white
    border-gray-200 dark:border-gray-700
  ">
    <h1 className="
      text-2xl font-bold 
      text-gray-900 dark:text-white
    ">
      음악 플레이어
    </h1>
    <p className="
      text-gray-600 dark:text-gray-300
    ">
      당신의 음악을 즐겨보세요
    </p>
  </div>
  ```

## ✨ 애니메이션 효과

### 1. CSS 트랜지션
- [ ] **부드러운 상태 전환**
  ```jsx
  <div className="
    transform transition-all duration-300 ease-in-out
    hover:scale-105 hover:shadow-lg
    active:scale-95
  ">
    {/* 컴포넌트 내용 */}
  </div>
  ```

- [ ] **로딩 애니메이션**
  ```jsx
  <div className="
    animate-spin 
    w-6 h-6 
    border-2 border-gray-300 border-t-music-600 
    rounded-full
  " />
  ```

### 2. 커스텀 애니메이션
- [ ] **tailwind.config.js 애니메이션**
  ```javascript
  module.exports = {
    theme: {
      extend: {
        animation: {
          'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          'bounce-slow': 'bounce 2s infinite',
          'wave': 'wave 2s ease-in-out infinite',
        },
        keyframes: {
          wave: {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-10px)' },
          }
        }
      }
    }
  }
  ```

## 🎨 커스텀 컴포넌트

### 1. 재사용 가능한 컴포넌트
- [ ] **버튼 컴포넌트**
  ```jsx
  const Button = ({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    ...props 
  }) => {
    const baseClasses = "font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
    
    const variants = {
      primary: "bg-music-600 hover:bg-music-700 text-white focus:ring-music-500",
      secondary: "bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-500",
      outline: "border border-music-600 text-music-600 hover:bg-music-50 focus:ring-music-500",
    };
    
    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
    };
    
    return (
      <button 
        className={`${baseClasses} ${variants[variant]} ${sizes[size]}`}
        {...props}
      >
        {children}
      </button>
    );
  };
  ```

### 2. 카드 컴포넌트
- [ ] **유연한 카드 시스템**
  ```jsx
  const Card = ({ 
    children, 
    variant = 'default',
    hover = true,
    ...props 
  }) => {
    const baseClasses = "rounded-lg border transition-all duration-200";
    
    const variants = {
      default: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700",
      elevated: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm",
      outlined: "bg-transparent border-gray-300 dark:border-gray-600",
    };
    
    const hoverClasses = hover ? "hover:shadow-md hover:border-music-200 dark:hover:border-music-700" : "";
    
    return (
      <div 
        className={`${baseClasses} ${variants[variant]} ${hoverClasses}`}
        {...props}
      >
        {children}
      </div>
    );
  };
  ```

## 📊 성능 최적화

### 1. PurgeCSS 설정
- [ ] **tailwind.config.js 최적화**
  ```javascript
  module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
      "./public/index.html"
    ],
    purge: {
      enabled: process.env.NODE_ENV === 'production',
      content: [
        './src/**/*.{js,jsx,ts,tsx}',
        './public/index.html'
      ],
      options: {
        safelist: [
          'animate-pulse',
          'animate-spin',
          'animate-bounce'
        ]
      }
    }
  }
  ```

### 2. JIT 모드 활용
- [ ] **Just-In-Time 컴파일**
  ```javascript
  module.exports = {
    mode: 'jit',
    // ...
  }
  ```

## 🎯 접근성 (A11y)

### 1. 포커스 관리
- [ ] **키보드 네비게이션**
  ```jsx
  <button className="
    focus:outline-none 
    focus:ring-2 
    focus:ring-music-500 
    focus:ring-offset-2 
    focus:ring-offset-white dark:focus:ring-offset-gray-900
  ">
    재생
  </button>
  ```

- [ ] **스크린 리더 지원**
  ```jsx
  <button 
    aria-label="재생 버튼"
    aria-pressed={isPlaying}
    className="..."
  >
    <PlayIcon className="w-6 h-6" />
  </button>
  ```

### 2. 색상 대비
- [ ] **WCAG 준수**
  ```jsx
  <div className="
    text-gray-900 dark:text-white
    bg-white dark:bg-gray-900
    border-gray-300 dark:border-gray-600
  ">
    {/* 충분한 대비를 가진 텍스트 */}
  </div>
  ```

## 🔧 개발 도구

### 1. Tailwind CSS IntelliSense
- [ ] **VS Code 확장 설정**
  - [ ] Tailwind CSS IntelliSense 설치
  - [ ] 자동완성 설정
  - [ ] 클래스 정렬 설정
  - [ ] 커스텀 클래스 추가

### 2. 디버깅 도구
- [ ] **브라우저 개발자 도구**
  - [ ] Tailwind CSS 클래스 확인
  - [ ] 반응형 디자인 테스트
  - [ ] 색상 팔레트 확인
  - [ ] 애니메이션 디버깅

## 📱 모바일 최적화

### 1. 터치 인터랙션
- [ ] **터치 타겟 크기**
  ```jsx
  <button className="
    min-w-[44px] min-h-[44px]  /* 최소 터치 타겟 */
    p-3
    rounded-lg
    touch-manipulation  /* 터치 최적화 */
  ">
    <Icon className="w-6 h-6" />
  </button>
  ```

### 2. 모바일 레이아웃
- [ ] **세로 레이아웃 최적화**
  ```jsx
  <div className="
    flex flex-col sm:flex-row
    space-y-4 sm:space-y-0 sm:space-x-4
    p-4 sm:p-6
  ">
    {/* 모바일에서는 세로, 데스크톱에서는 가로 */}
  </div>
  ```

## 🎨 테마 시스템

### 1. 동적 테마
- [ ] **CSS 변수 활용**
  ```css
  :root {
    --primary-color: 59 130 246;  /* rgb values */
    --secondary-color: 139 92 246;
  }
  
  .dark {
    --primary-color: 96 165 250;
    --secondary-color: 167 139 250;
  }
  ```

- [ ] **JavaScript로 테마 변경**
  ```jsx
  const setTheme = (theme) => {
    document.documentElement.style.setProperty(
      '--primary-color', 
      theme === 'dark' ? '96 165 250' : '59 130 246'
    );
  };
  ```

---

*이 체크리스트는 Tailwind CSS를 활용하여 현대적이고 접근성 높은 오디오 플레이어 UI를 구축하기 위한 가이드입니다.* 