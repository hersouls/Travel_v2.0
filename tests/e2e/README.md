# E2E 테스트 가이드

## 개요

Moonwave 오안나 음악 플레이어의 End-to-End 테스트는 Playwright를 사용하여 구현되었습니다. 이 테스트들은 실제 사용자 시나리오를 시뮬레이션하여 애플리케이션의 전체 기능이 올바르게 작동하는지 확인합니다.

## 테스트 구조

### 1. 음악 플레이어 테스트 (`music-player.spec.ts`)
- 기본 음악 재생/일시정지 기능
- 곡 네비게이션 (다음/이전)
- 볼륨 조절
- 진행률 바 업데이트
- 플레이리스트 네비게이션
- 상태 유지 (페이지 새로고침)

### 2. 가사 싱크 테스트 (`lyrics-sync.spec.ts`)
- 가사 컨테이너 표시
- 현재 가사 라인 하이라이트
- 자동 스크롤
- 오디오 시간과 가사 싱크
- 가사가 없는 곡 처리
- 일시정지/재생 시 가사 동기화

### 3. 반응형 디자인 테스트 (`responsive-design.spec.ts`)
- 데스크톱, 태블릿, 모바일 뷰포트
- 햄버거 메뉴 (모바일)
- 플레이리스트 토글 (모바일)
- 터치 인터랙션
- 방향 변경 (세로/가로)
- 폰트 스케일링
- 고해상도 디스플레이

### 4. 크로스 브라우저 테스트 (`cross-browser.spec.ts`)
- Chrome, Firefox, Safari 호환성
- 모바일 브라우저 (Chrome, Safari)
- 오디오 API 일관성
- CSS 애니메이션
- 폰트 렌더링
- 이미지 로딩
- 로컬 스토리지
- 에러 상태 처리
- 성능 측정

## 실행 방법

### 기본 실행
```bash
npm run test:e2e
```

### UI 모드로 실행 (디버깅용)
```bash
npm run test:e2e:ui
```

### 헤드 모드로 실행 (브라우저 표시)
```bash
npm run test:e2e:headed
```

### 디버그 모드로 실행
```bash
npm run test:e2e:debug
```

### 테스트 리포트 보기
```bash
npm run test:e2e:report
```

## 브라우저 지원

- **Desktop**: Chrome, Firefox, Safari
- **Mobile**: Chrome (Android), Safari (iOS)

## 테스트 데이터 속성

테스트에서 사용하는 `data-testid` 속성들:

### 음악 플레이어
- `music-player`: 메인 플레이어 컨테이너
- `play-button`: 재생 버튼
- `pause-button`: 일시정지 버튼
- `next-button`: 다음 곡 버튼
- `prev-button`: 이전 곡 버튼
- `volume-slider`: 볼륨 슬라이더
- `progress-bar`: 진행률 바
- `current-song-info`: 현재 곡 정보

### 가사 관련
- `lyrics-container`: 가사 컨테이너
- `lyrics-line`: 가사 라인
- `lyrics-button`: 가사 표시 버튼
- `no-lyrics-message`: 가사 없음 메시지

### 플레이리스트
- `playlist-container`: 플레이리스트 컨테이너
- `playlist-item`: 플레이리스트 아이템
- `playlist-button`: 플레이리스트 버튼
- `playlist-toggle`: 플레이리스트 토글 (모바일)

### 레이아웃
- `main-container`: 메인 컨테이너
- `sidebar`: 사이드바
- `hamburger-menu`: 햄버거 메뉴
- `mobile-menu`: 모바일 메뉴
- `close-menu`: 메뉴 닫기 버튼

### 기타
- `song-title`: 곡 제목
- `artist-name`: 아티스트 이름
- `cover-image`: 커버 이미지
- `error-message`: 에러 메시지
- `retry-button`: 재시도 버튼

## 테스트 환경 설정

### Playwright 설정 (`playwright.config.ts`)
- 테스트 디렉토리: `./tests/e2e`
- 기본 URL: `http://localhost:3000`
- 웹서버: `npm run dev`
- 브라우저: Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari
- 스크린샷: 실패 시에만
- 비디오: 실패 시에만
- 트레이스: 첫 번째 재시도 시에만

## CI/CD 통합

### GitHub Actions 예시
```yaml
- name: Run E2E Tests
  run: npm run test:e2e
  env:
    CI: true
```

### 병렬 실행
- 데스크톱 브라우저: 3개 병렬
- 모바일 브라우저: 2개 병렬
- 총 5개 브라우저에서 동시 실행

## 디버깅

### 실패한 테스트 디버깅
1. `npm run test:e2e:debug` 실행
2. 브라우저에서 단계별 실행
3. 스크린샷과 비디오 확인

### 로그 확인
```bash
npm run test:e2e -- --reporter=list
```

### 특정 테스트만 실행
```bash
npm run test:e2e -- --grep "should play music"
```

## 성능 최적화

### 테스트 실행 시간 단축
- 병렬 실행 활용
- 헤드리스 모드 사용
- 불필요한 대기 시간 최소화

### 리소스 사용량 최적화
- 브라우저 인스턴스 재사용
- 메모리 누수 방지
- 정리 작업 자동화

## 모니터링

### 테스트 결과 추적
- 성공률 모니터링
- 실행 시간 추적
- 실패 패턴 분석

### 알림 설정
- 테스트 실패 시 알림
- 성능 저하 감지
- 브라우저 호환성 이슈 알림

## 유지보수

### 정기적인 업데이트
- Playwright 버전 업데이트
- 브라우저 버전 동기화
- 테스트 케이스 리뷰

### 테스트 데이터 관리
- 테스트용 음원 파일 관리
- 가사 데이터 업데이트
- 이미지 파일 최적화