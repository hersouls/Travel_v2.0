# Moonwave 여행 관리

> "여행의 모든 순간을 담다" - 계획부터 추억까지, 여행의 전 과정을 관리하는 스마트한 여행 도우미

## 🚀 프로젝트 개요

Moonwave Travel은 여행의 모든 순간을 담는 스마트한 여행 관리 서비스입니다. 여행 계획부터 추억까지, 여행의 전 과정을 관리할 수 있는 PWA(Progressive Web App)로, Firebase를 기반으로 한 실시간 동기화와 지도 기반 위치 표시 기능을 제공합니다.

## 🌟 주요 기능

### 📅 여행 일정 관리
- **여행 생성 및 관리**: 대표 이미지, 제목, 국가, 기간 설정
- **일정 편집**: Day별 계획 관리 (시간, 장소, 메모, 사진)
- **실시간 동기화**: Firebase 실시간 데이터베이스로 즉시 반영
- **진행률 추적**: 여행 일정 완료도 시각적 표시

### 🗺️ 지도 기반 기능
- **전체 일정 지도 보기**: Leaflet + OpenStreetMap 기반
- **위치 정보 관리**: 위도/경도 좌표 입력 및 표시
- **Day별 필터링**: 특정 날짜의 일정만 지도에 표시
- **좌표 입력 가이드**: Google Maps/네이버 지도 연동

### 🔍 개인 장소 라이브러리
- **장소 검색 및 관리**: 개인만의 장소 라이브러리 구축
- **즐겨찾기 기능**: 자주 사용하는 장소 즐겨찾기
- **사용 횟수 추적**: 장소별 사용 빈도 통계
- **새 장소 등록**: 여행 중 발견한 장소 즉시 등록

### 📤 공유 및 내보내기
- **일정 공유**: 여행 일정을 다른 사용자와 공유
- **PDF 내보내기**: 여행 일정을 PDF 형태로 다운로드
- **PWA 설치**: 홈 화면에 앱으로 설치 가능

### 🔒 보안 및 인증
- **Firebase 익명 로그인**: 개인정보 없이 안전한 사용
- **데이터 보호**: 사용자별 데이터 격리
- **오프라인 지원**: 인터넷 없이도 기본 기능 사용

## 🛠️ 기술 스택

### Frontend
- **React 19**: 최신 React 기능 활용
- **TypeScript**: 타입 안전성과 개발 생산성 향상
- **Tailwind CSS**: 커스텀 테마와 반응형 디자인
- **Radix UI**: 접근성과 사용성을 고려한 UI 컴포넌트

### Backend & Database
- **Firebase Firestore**: 실시간 NoSQL 데이터베이스
- **Firebase Storage**: 이미지 및 파일 저장
- **Firebase Authentication**: 익명 로그인

### Maps & Location
- **Leaflet**: 오픈소스 지도 라이브러리
- **OpenStreetMap**: 무료 지도 타일 서비스
- **좌표 시스템**: 위도/경도 기반 위치 관리

### Build & Development
- **Vite**: 빠른 개발 서버와 최적화된 빌드
- **ESLint**: 코드 품질 관리
- **Prettier**: 코드 포맷팅

### Testing
- **Jest**: 단위 테스트
- **Playwright**: E2E 테스트
- **React Testing Library**: 컴포넌트 테스트

### Deployment
- **Vercel**: 정적 사이트 호스팅
- **GitHub Actions**: CI/CD 파이프라인
- **PWA**: Progressive Web App 지원

## 📦 프로젝트 구조

```
Travel_v2.0/
├── src/                          # 소스 코드
│   ├── components/               # React 컴포넌트
│   │   ├── ui/                  # Radix UI 기반 컴포넌트
│   │   ├── GlassCard.tsx        # 글래스 카드 컴포넌트
│   │   ├── TripCard.tsx         # 여행 카드 컴포넌트
│   │   ├── PlanCard.tsx         # 일정 카드 컴포넌트
│   │   ├── WaveButton.tsx       # 웨이브 버튼 컴포넌트
│   │   └── TravelMap.tsx        # 지도 컴포넌트
│   ├── pages/                   # 페이지 컴포넌트
│   │   ├── Home.tsx            # 메인 화면
│   │   ├── TripCreate.tsx      # 여행 생성
│   │   ├── TripDetail.tsx      # 여행 상세
│   │   ├── PlanDetail.tsx      # 일정 편집
│   │   ├── PlaceSearch.tsx     # 장소 검색
│   │   └── TripMap.tsx         # 지도 보기
│   ├── contexts/                # React Context
│   │   └── AuthContext.tsx     # 인증 컨텍스트
│   ├── lib/                     # 라이브러리 설정
│   │   └── firebase.ts         # Firebase 설정
│   ├── types/                   # TypeScript 타입
│   │   ├── trip.ts             # 여행 타입
│   │   ├── plan.ts             # 일정 타입
│   │   └── place.ts            # 장소 타입
│   ├── utils/                   # 유틸리티 함수
│   ├── styles/                  # 스타일 파일
│   ├── assets/                  # 정적 자산
│   ├── App.tsx                  # 메인 앱 컴포넌트
│   └── main.tsx                 # 진입점
├── public/                      # 정적 파일
│   ├── manifest.json           # PWA 매니페스트
│   └── sw.js                   # Service Worker
├── docs/                        # 문서
│   ├── 화면정의서              # UI/UX 정의서
│   ├── 개발체크리스트          # 개발 가이드
│   └── 디자인가이드            # 디자인 시스템
├── scripts/                     # 스크립트
│   ├── seedData.js             # 샘플 데이터 생성
│   └── updatePlans.js          # 일정 업데이트
└── firebase.json               # Firebase 설정
```

## 🎯 화면 구성

### 1. 메인 화면 (Home)
- **목적**: 여행 일정 목록 조회 및 신규 여행 생성
- **주요 기능**: 
  - 여행 카드 그리드 표시
  - 검색 및 필터링
  - 진행률 시각화
  - 신규 여행 생성 버튼

### 2. 여행 생성 화면 (TripCreate)
- **목적**: 새 여행 일정 생성
- **주요 기능**:
  - 대표 이미지 업로드
  - 여행 제목, 국가, 기간 설정
  - 실시간 유효성 검증

### 3. 여행 상세 화면 (TripDetail)
- **목적**: 특정 여행의 Day별 일정 관리
- **주요 기능**:
  - Day 탭으로 일정 구분
  - 일정 카드 목록 표시
  - 실시간 Firebase 연동
  - 지도 보기 연동

### 4. 일정 편집 화면 (PlanDetail)
- **목적**: 개별 일정 생성/수정/삭제
- **주요 기능**:
  - 시간, 장소, 메모 입력
  - 사진 업로드 (최대 5장)
  - 평점 및 링크 관리
  - 좌표 정보 입력

### 5. 장소 검색 화면 (PlaceSearch)
- **목적**: 개인 장소 라이브러리 검색 및 선택
- **주요 기능**:
  - 장소명/주소 검색
  - 유형별 필터링
  - 즐겨찾기 관리
  - 새 장소 등록

### 6. 지도 보기 화면 (TripMap)
- **목적**: 전체 일정을 지도 상에 표시
- **주요 기능**:
  - Leaflet + OpenStreetMap
  - Day별 필터링
  - 마커 클릭으로 일정 편집
  - 좌표 입력 가이드

## 🚀 설치 및 실행

### 필수 요구사항
- Node.js >= 18.0.0
- npm >= 8.0.0
- Firebase 프로젝트 설정

### 설치
```bash
# 저장소 클론
git clone https://github.com/your-username/Travel_v2.0.git
cd Travel_v2.0

# 의존성 설치
npm install
```

### 환경 설정
```bash
# Firebase 설정 파일 생성
cp .env.example .env.local

# Firebase 프로젝트 정보 입력
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 개발 서버 실행
```bash
# 개발 서버 시작
npm run dev

# 브라우저에서 http://localhost:5173 접속
```

### 빌드 및 배포
```bash
# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview

# Vercel 배포
npm run deploy
```

## 🧪 테스트

### 단위 테스트
```bash
# Jest를 사용한 단위 테스트
npm test

# 테스트 감시 모드
npm run test:watch
```

### E2E 테스트
```bash
# Playwright를 사용한 E2E 테스트
npm run test:e2e
```

### 타입 체크
```bash
# TypeScript 타입 체크
npm run type-check
```

## 🎨 디자인 시스템

### Moonwave Style v3.2
- **글래스모피즘**: 현대적인 글래스 효과
- **웨이브 애니메이션**: 동적 웨이브 효과
- **반응형 디자인**: 모든 디바이스 최적화
- **다크 모드 지원**: 눈에 편안한 테마

### 주요 컴포넌트
- **GlassCard**: 글래스 효과 카드 컴포넌트
- **WaveButton**: 웨이브 애니메이션 버튼
- **TripCard**: 여행 정보 카드
- **PlanCard**: 일정 정보 카드

## 📊 데이터 모델

### Firestore 구조
```
trips/
  └── {tripId}/
      ├── info (기본 정보)
      └── plans/ (일정 서브컬렉션)
          └── {planId}

users/
  └── {userId}/
      ├── profile
      └── places/ (개인 장소 라이브러리)
          └── {placeId}
```

### 핵심 타입 정의
```typescript
interface Trip {
  id: string;
  user_id: string;
  title: string;
  country: string;
  start_date: string;
  end_date: string;
  cover_image?: string;
  plans_count?: number;
  created_at: Timestamp;
  updated_at: Timestamp;
}

interface Plan {
  day: number;
  place_name: string;
  start_time: string;
  end_time?: string;
  type: 'attraction' | 'restaurant' | 'hotel' | 'transport' | 'other';
  address?: string;
  rating?: number;
  memo?: string;
  photos?: string[];
  youtube_link?: string;
  map_url?: string;
  latitude?: number;
  longitude?: number;
  trip_id: string;
  created_at: Timestamp;
  updated_at: Timestamp;
}
```

## 🔧 스크립트

```bash
# 개발
npm run dev              # 개발 서버 실행
npm run build            # 프로덕션 빌드
npm run preview          # 빌드 결과 미리보기

# 테스트
npm test                 # 단위 테스트
npm run test:watch       # 테스트 감시 모드
npm run test:e2e         # E2E 테스트

# 코드 품질
npm run lint             # ESLint 검사
npm run type-check       # TypeScript 타입 체크

# 데이터 관리
npm run seed-data        # 샘플 데이터 생성
npm run update-plans     # 일정 데이터 업데이트

# 배포
npm run deploy           # Vercel 배포
```

## 🚀 배포 가이드

### Vercel 배포
```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel --prod
```

### 수동 배포
1. 프로덕션 빌드: `npm run build`
2. `dist/` 폴더를 웹 서버에 업로드
3. Firebase 설정 적용
4. 도메인 DNS 설정

### 배포 전 체크리스트
- [ ] 모든 테스트 통과
- [ ] 린팅 검사 통과
- [ ] TypeScript 타입 체크 통과
- [ ] 프로덕션 빌드 성공
- [ ] Firebase 설정 확인
- [ ] PWA 매니페스트 설정
- [ ] SSL 인증서 설정

## 🔒 보안 및 성능

### 보안 설정
- Firebase 보안 규칙 설정
- HTTPS 강제 리다이렉트
- 보안 헤더 설정
- CSP (Content Security Policy)

### 성능 최적화
- Firebase 실시간 리스너 최적화
- 이미지 lazy loading
- 코드 스플리팅
- 번들 크기 최적화
- 오프라인 캐싱

## 📊 모니터링

- Firebase Analytics 설정
- 에러 로깅
- 성능 모니터링
- 사용자 행동 분석

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

MIT License - 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 📞 지원

- 이슈 리포트: [GitHub Issues](https://github.com/your-username/Travel_v2.0/issues)
- 이메일: support@moonwave.kr
- 웹사이트: https://travel.moonwave.kr

---

**Moonwave Team** - 여행의 모든 순간을 담다 ✈️🌙

## 배포 (GitHub Pages)

이 프로젝트는 GitHub Pages로 배포됩니다.

- 브랜치: `main`
- 경로(base): `/Travel_v2.0/`
- 워크플로: `.github/workflows/deploy.yml`

로컬에서 Pages 빌드 확인:

```bash
GITHUB_PAGES=true npm run build
npx serve dist
```

깊은 링크를 위해 `dist/404.html`이 `index.html`의 복사본으로 업로드됩니다.
