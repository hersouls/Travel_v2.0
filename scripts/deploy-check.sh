#!/bin/bash

# Moonwave 오안나 음악 플레이어 배포 확인 스크립트

echo "🚀 Moonwave 오안나 음악 플레이어 배포 확인 시작"
echo "================================================"

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 함수: 성공 메시지
success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# 함수: 경고 메시지
warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# 함수: 오류 메시지
error() {
    echo -e "${RED}❌ $1${NC}"
}

# 함수: 정보 메시지
info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# 1. 빌드 확인
echo ""
info "1. 프로젝트 빌드 확인 중..."
if npm run build; then
    success "빌드 성공"
else
    error "빌드 실패"
    exit 1
fi

# 2. 도메인 연결 확인
echo ""
info "2. 도메인 연결 확인 중..."
if curl -s -o /dev/null -w "%{http_code}" https://oh.moonwave.kr | grep -q "200"; then
    success "도메인 연결 성공"
else
    warning "도메인 연결 실패 또는 아직 배포되지 않음"
fi

# 3. SSL 인증서 확인
echo ""
info "3. SSL 인증서 확인 중..."
if openssl s_client -connect oh.moonwave.kr:443 -servername oh.moonwave.kr < /dev/null 2>/dev/null | grep -q "subject="; then
    success "SSL 인증서 정상"
else
    warning "SSL 인증서 확인 실패"
fi

# 4. GitHub Actions 상태 확인
echo ""
info "4. GitHub Actions 상태 확인 중..."
# GitHub API를 사용하여 최근 워크플로우 상태 확인
# (GitHub 토큰이 필요할 수 있음)

# 5. PWA 파일 확인
echo ""
info "5. PWA 파일 확인 중..."
if [ -f "dist/manifest.json" ]; then
    success "manifest.json 파일 존재"
else
    error "manifest.json 파일 없음"
fi

if [ -f "dist/sw.js" ]; then
    success "Service Worker 파일 존재"
else
    error "Service Worker 파일 없음"
fi

# 6. 성능 테스트 (Lighthouse CLI가 설치된 경우)
echo ""
info "6. 성능 테스트 준비 중..."
if command -v lighthouse &> /dev/null; then
    info "Lighthouse CLI 발견 - 성능 테스트 실행 중..."
    lighthouse https://oh.moonwave.kr --output=json --output-path=./lighthouse-report.json --chrome-flags="--headless"
    success "성능 테스트 완료"
else
    warning "Lighthouse CLI가 설치되지 않음. 수동으로 테스트하세요."
fi

# 7. 최종 상태 요약
echo ""
echo "================================================"
info "배포 확인 완료"
echo ""
echo "📋 다음 단계:"
echo "1. https://oh.moonwave.kr 접속 테스트"
echo "2. 모바일에서 PWA 설치 테스트"
echo "3. 음악 재생 기능 테스트"
echo "4. 모든 페이지 로딩 확인"
echo ""
echo "🔧 문제가 있다면:"
echo "- GitHub Actions 로그 확인"
echo "- DNS 설정 재확인"
echo "- 브라우저 캐시 삭제"
echo "================================================"