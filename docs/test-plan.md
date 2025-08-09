# Moonwave Travel 단위테스트 계획서

## 📋 테스트 개요

### 목표
- 코드 품질 향상 및 버그 사전 방지
- 리팩토링 안전성 확보
- CI/CD 파이프라인 안정성 보장
- 90% 이상 테스트 커버리지 달성

### 테스트 도구 스택
- **Jest**: JavaScript 테스트 프레임워크
- **React Testing Library**: React 컴포넌트 테스트
- **jsdom**: DOM 환경 시뮬레이션
- **MSW (Mock Service Worker)**: API 모킹
- **Firebase Test SDK**: Firebase 연동 테스트

---

## 🧩 컴포넌트 테스트 계획

### 우선순위 1: 핵심 UI 컴포넌트

#### GlassCard 컴포넌트
- **파일**: `src/components/GlassCard.tsx`
- **테스트 범위**:
  - ✅ 다양한 variant 렌더링 (travel, light, dark)
  - ✅ hoverable 속성 동작
  - ✅ withWaveEffect 애니메이션
  - ✅ onClick 이벤트 처리
  - ✅ className 병합 확인

#### WaveButton 컴포넌트
- **파일**: `src/components/WaveButton.tsx`
- **테스트 범위**:
  - ✅ 다양한 variant 스타일링 (travel, ghost)
  - ✅ size별 렌더링 (sm, lg)
  - ✅ disabled 상태 처리
  - ✅ 클릭 이벤트 및 리플 효과
  - ✅ loading 상태 표시

#### TripCard 컴포넌트
- **파일**: `src/components/TripCard.tsx`
- **테스트 범위**:
  - ✅ 여행 정보 표시 (제목, 국가, 날짜)
  - ✅ 커버 이미지 렌더링/플레이스홀더
  - ✅ 여행 기간 계산 정확성
  - ✅ plans_count 표시
  - ✅ onClick 이벤트 전달

#### PlanCard 컴포넌트
- **파일**: `src/components/PlanCard.tsx`
- **테스트 범위**:
  - ✅ 계획 정보 표시 (장소명, 시간, 타입)
  - ✅ 타입별 아이콘 표시
  - ✅ 사진/위치 정보 표시
  - ✅ 시간 포맷팅 (HH:MM)
  - ✅ 클릭 이벤트 처리

### 우선순위 2: 지도 및 특수 컴포넌트

#### TravelMap 컴포넌트
- **파일**: `src/components/TravelMap.tsx`
- **테스트 범위**:
  - ✅ Leaflet 맵 초기화
  - ✅ 마커 표시 및 클러스터링
  - ✅ 팝업 정보 표시
  - ✅ 지도 이벤트 처리
  - ✅ Props 변경 시 업데이트

---

## 📱 페이지 테스트 계획

### 우선순위 1: 핵심 페이지

#### Home 페이지
- **파일**: `src/pages/Home.tsx`
- **테스트 범위**:
  - ✅ 인증 상태별 화면 렌더링
  - ✅ 여행 목록 표시
  - ✅ 통계 정보 계산 (여행 수, 일정 수)
  - ✅ 새 여행 만들기 버튼
  - ✅ 샘플 데이터 복사 로직
  - ✅ 로딩/에러 상태 처리

#### TripDetail 페이지
- **파일**: `src/pages/TripDetail.tsx`
- **테스트 범위**:
  - ✅ 여행 정보 로드 및 표시
  - ✅ 일별 계획 필터링
  - ✅ 선택된 날짜 변경
  - ✅ 계획 추가/편집 네비게이션
  - ✅ 지도 보기 버튼
  - ✅ 권한 검증 (user_id 체크)

#### TripCreate 페이지
- **파일**: `src/pages/TripCreate.tsx`
- **테스트 범위**:
  - ✅ 폼 입력 유효성 검증
  - ✅ 이미지 업로드 처리
  - ✅ Firebase 저장 로직
  - ✅ 성공 시 리다이렉트
  - ✅ 에러 상태 처리

#### PlanDetail 페이지
- **파일**: `src/pages/PlanDetail.tsx`
- **테스트 범위**:
  - ✅ 새 계획/기존 계획 모드
  - ✅ 폼 데이터 로드 및 저장
  - ✅ 이미지 업로드 다중 처리
  - ✅ 계획 삭제 확인
  - ✅ 좌표 입력 처리

### 우선순위 2: 보조 페이지

#### TripMap 페이지
- **파일**: `src/pages/TripMap.tsx`
- **테스트 범위**:
  - ✅ 지도 렌더링 및 마커 표시
  - ✅ 사이드바 토글 기능
  - ✅ 좌표 입력 모달
  - ✅ 계획 편집 네비게이션

#### PlaceSearch 페이지
- **파일**: `src/pages/PlaceSearch.tsx`
- **테스트 범위**:
  - ✅ 개인 장소 라이브러리 표시
  - ✅ 검색 및 필터링
  - ✅ 즐겨찾기 토글
  - ✅ 장소 선택 및 데이터 전달

---

## 🛠️ 유틸리티 함수 테스트 계획

### 분석/성능 유틸리티

#### Analytics 유틸리티
- **파일**: `src/utils/analytics.ts`
- **테스트 범위**:
  - ✅ 이벤트 로깅 함수들
  - ✅ Firebase Analytics 초기화 체크
  - ✅ 에러 처리 (Analytics 비활성화 시)

#### Performance 유틸리티
- **파일**: `src/utils/performance.ts`
- **테스트 범위**:
  - ✅ 성능 측정 trace 생성
  - ✅ 다양한 측정 함수들
  - ✅ Firebase Performance 연동

### 데이터 처리 유틸리티

#### 샘플 데이터 생성
- **파일**: `src/utils/generateSampleData.ts`
- **테스트 범위**:
  - ✅ 사용자별 데이터 복사
  - ✅ 데이터 존재 확인 로직
  - ✅ Firebase 저장 로직
  - ✅ 에러 처리 및 롤백

#### Copy Data for User
- **파일**: `src/utils/copyDataForUser.ts`
- **테스트 범위**:
  - ✅ 기존 데이터 체크
  - ✅ trip_id 매핑 로직
  - ✅ 관계 데이터 연결 유지

---

## 🔥 Firebase 연동 테스트 계획

### Firebase 초기화 테스트
- **파일**: `src/lib/firebase.ts`
- **테스트 범위**:
  - ✅ Firebase 앱 초기화
  - ✅ 서비스 인스턴스 생성 (auth, db, storage)
  - ✅ Analytics/Performance 조건부 초기화
  - ✅ 환경 변수 누락 시 에러 처리

### Firebase 서비스별 테스트

#### Authentication 테스트
- ✅ 익명 로그인 성공/실패
- ✅ 로그아웃 처리
- ✅ 사용자 상태 변경 리스너

#### Firestore 테스트
- ✅ CRUD 작업 (Create, Read, Update, Delete)
- ✅ 실시간 구독 (onSnapshot)
- ✅ 쿼리 필터링 및 정렬
- ✅ 보안 규칙 준수

#### Storage 테스트
- ✅ 이미지 업로드/다운로드
- ✅ 파일 삭제
- ✅ 업로드 진행률 처리
- ✅ 용량 제한 확인

---

## 🎯 Context & Hook 테스트 계획

### AuthContext 테스트
- **파일**: `src/contexts/AuthContext.tsx`
- **테스트 범위**:
  - ✅ 초기 상태 (loading: true, user: null)
  - ✅ 익명 로그인 성공 시 상태 변경
  - ✅ 로그아웃 시 상태 초기화
  - ✅ 에러 상태 처리
  - ✅ AuthProvider 없이 useAuth 호출 시 에러

### Custom Hooks 테스트
- **파일**: `src/contexts/index.ts`
- **테스트 범위**:
  - ✅ useAuth 훅 반환값 검증
  - ✅ Context Provider 연동 확인

---

## 📊 테스트 커버리지 목표

### 커버리지 기준
- **전체 코드**: 90% 이상
- **컴포넌트**: 95% 이상  
- **유틸리티 함수**: 100%
- **페이지**: 85% 이상
- **Context/Hook**: 100%

### 테스트 실행 환경
```bash
# 단발성 테스트 실행
npm test

# Watch 모드 (개발 중)
npm run test:watch

# 커버리지 포함 테스트
npm test -- --coverage

# 특정 파일 테스트
npm test -- GlassCard.test.tsx
```

### CI/CD 통합
- **GitHub Actions**: PR 시 자동 테스트 실행
- **커버리지 보고서**: Codecov 연동
- **테스트 실패 시**: 빌드 차단
- **성능 벤치마크**: Lighthouse CI 연동

---

## 🚀 테스트 구현 단계

### Phase 1: 핵심 컴포넌트 (1주)
1. GlassCard, WaveButton 테스트 구현
2. TripCard, PlanCard 테스트 구현  
3. Firebase 모킹 설정

### Phase 2: 주요 페이지 (2주)
1. Home, TripDetail 페이지 테스트
2. TripCreate, PlanDetail 페이지 테스트
3. 네비게이션 테스트

### Phase 3: 통합 테스트 (1주)
1. Context 및 Hook 테스트
2. Firebase 연동 테스트
3. 유틸리티 함수 테스트

### Phase 4: 최적화 (3일)
1. 커버리지 목표 달성
2. 성능 테스트 추가
3. CI/CD 파이프라인 완성

---

## 📝 테스트 작성 가이드라인

### 명명 규칙
- 테스트 파일: `ComponentName.test.tsx`
- 테스트 폴더: `src/components/__tests__/`
- describe: 컴포넌트명 또는 기능명
- it/test: "should + 동작" 형태

### 모범 사례
- **AAA 패턴**: Arrange, Act, Assert
- **단일 책임**: 하나의 테스트는 하나의 기능만
- **독립성**: 테스트 간 의존성 없음
- **가독성**: 명확한 테스트 설명
- **모킹**: 외부 의존성 적극 활용

---

이 계획서는 Moonwave Travel 앱의 안정성과 품질을 보장하기 위한 포괄적인 테스트 전략을 제시합니다. 단계적 구현을 통해 높은 테스트 커버리지와 코드 품질을 달성할 수 있습니다.