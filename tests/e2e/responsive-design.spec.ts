import { test, expect } from '@playwright/test';

test.describe('Responsive Design E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should display correctly on desktop (1920x1080)', async ({ page }) => {
    // 데스크톱 뷰포트 설정
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    // 메인 컨테이너가 표시되는지 확인
    await expect(page.locator('[data-testid="main-container"]')).toBeVisible();
    
    // 음악 플레이어가 표시되는지 확인
    await expect(page.locator('[data-testid="music-player"]')).toBeVisible();
    
    // 사이드바가 표시되는지 확인 (데스크톱에서는 표시되어야 함)
    const sidebar = page.locator('[data-testid="sidebar"]');
    await expect(sidebar).toBeVisible();
    
    // 플레이리스트가 표시되는지 확인
    await expect(page.locator('[data-testid="playlist-container"]')).toBeVisible();
  });

  test('should display correctly on tablet (768x1024)', async ({ page }) => {
    // 태블릿 뷰포트 설정
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // 메인 컨테이너가 표시되는지 확인
    await expect(page.locator('[data-testid="main-container"]')).toBeVisible();
    
    // 음악 플레이어가 표시되는지 확인
    await expect(page.locator('[data-testid="music-player"]')).toBeVisible();
    
    // 사이드바가 숨겨지거나 햄버거 메뉴로 변경되는지 확인
    const sidebar = page.locator('[data-testid="sidebar"]');
    const hamburgerMenu = page.locator('[data-testid="hamburger-menu"]');
    
    // 둘 중 하나는 표시되어야 함
    const hasSidebar = await sidebar.isVisible();
    const hasHamburgerMenu = await hamburgerMenu.isVisible();
    
    expect(hasSidebar || hasHamburgerMenu).toBeTruthy();
  });

  test('should display correctly on mobile (375x667)', async ({ page }) => {
    // 모바일 뷰포트 설정
    await page.setViewportSize({ width: 375, height: 667 });
    
    // 메인 컨테이너가 표시되는지 확인
    await expect(page.locator('[data-testid="main-container"]')).toBeVisible();
    
    // 음악 플레이어가 표시되는지 확인
    await expect(page.locator('[data-testid="music-player"]')).toBeVisible();
    
    // 햄버거 메뉴가 표시되는지 확인
    await expect(page.locator('[data-testid="hamburger-menu"]')).toBeVisible();
    
    // 플레이리스트가 숨겨지거나 접을 수 있는 형태로 변경되는지 확인
    const playlistContainer = page.locator('[data-testid="playlist-container"]');
    const playlistToggle = page.locator('[data-testid="playlist-toggle"]');
    
    // 둘 중 하나는 표시되어야 함
    const hasPlaylist = await playlistContainer.isVisible();
    const hasToggle = await playlistToggle.isVisible();
    
    expect(hasPlaylist || hasToggle).toBeTruthy();
  });

  test('should handle hamburger menu on mobile', async ({ page }) => {
    // 모바일 뷰포트 설정
    await page.setViewportSize({ width: 375, height: 667 });
    
    // 햄버거 메뉴 클릭
    await page.click('[data-testid="hamburger-menu"]');
    
    // 메뉴가 열리는지 확인
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
    
    // 메뉴 항목들이 표시되는지 확인
    await expect(page.locator('[data-testid="menu-item"]')).toBeVisible();
    
    // 메뉴 닫기 버튼 클릭
    await page.click('[data-testid="close-menu"]');
    
    // 메뉴가 닫히는지 확인
    await expect(page.locator('[data-testid="mobile-menu"]')).not.toBeVisible();
  });

  test('should handle playlist toggle on mobile', async ({ page }) => {
    // 모바일 뷰포트 설정
    await page.setViewportSize({ width: 375, height: 667 });
    
    // 플레이리스트 토글 버튼 클릭
    await page.click('[data-testid="playlist-toggle"]');
    
    // 플레이리스트가 표시되는지 확인
    await expect(page.locator('[data-testid="playlist-container"]')).toBeVisible();
    
    // 다시 토글 버튼 클릭
    await page.click('[data-testid="playlist-toggle"]');
    
    // 플레이리스트가 숨겨지는지 확인
    await expect(page.locator('[data-testid="playlist-container"]')).not.toBeVisible();
  });

  test('should maintain player controls visibility across screen sizes', async ({ page }) => {
    const viewports = [
      { width: 1920, height: 1080, name: 'desktop' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 375, height: 667, name: 'mobile' }
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      
      // 플레이어 컨트롤들이 표시되는지 확인
      await expect(page.locator('[data-testid="play-button"]')).toBeVisible();
      await expect(page.locator('[data-testid="prev-button"]')).toBeVisible();
      await expect(page.locator('[data-testid="next-button"]')).toBeVisible();
      
      // 볼륨 컨트롤이 표시되는지 확인 (모바일에서는 다를 수 있음)
      const volumeControl = page.locator('[data-testid="volume-control"]');
      if (viewport.name !== 'mobile') {
        await expect(volumeControl).toBeVisible();
      }
    }
  });

  test('should handle touch interactions on mobile', async ({ page }) => {
    // 모바일 뷰포트 설정
    await page.setViewportSize({ width: 375, height: 667 });
    
    // 터치 이벤트를 시뮬레이션하여 스와이프 테스트
    const playerContainer = page.locator('[data-testid="music-player"]');
    
    // 스와이프 제스처 시뮬레이션
    await playerContainer.hover();
    await page.mouse.down();
    await page.mouse.move(200, 300);
    await page.mouse.up();
    
    // 플레이어가 정상적으로 작동하는지 확인
    await expect(page.locator('[data-testid="play-button"]')).toBeVisible();
  });

  test('should handle orientation changes', async ({ page }) => {
    // 세로 모드로 시작
    await page.setViewportSize({ width: 375, height: 667 });
    
    // 기본 레이아웃 확인
    await expect(page.locator('[data-testid="main-container"]')).toBeVisible();
    
    // 가로 모드로 변경
    await page.setViewportSize({ width: 667, height: 375 });
    
    // 레이아웃이 적응하는지 확인
    await expect(page.locator('[data-testid="main-container"]')).toBeVisible();
    
    // 플레이어가 여전히 표시되는지 확인
    await expect(page.locator('[data-testid="music-player"]')).toBeVisible();
  });

  test('should handle font scaling', async ({ page }) => {
    // 데스크톱 뷰포트 설정
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    // 텍스트 요소들이 올바른 크기로 표시되는지 확인
    const songTitle = page.locator('[data-testid="song-title"]');
    const artistName = page.locator('[data-testid="artist-name"]');
    
    await expect(songTitle).toBeVisible();
    await expect(artistName).toBeVisible();
    
    // 폰트 크기 확인 (CSS 클래스나 스타일 속성으로)
    const titleFontSize = await songTitle.evaluate(el => 
      window.getComputedStyle(el).fontSize
    );
    const artistFontSize = await artistName.evaluate(el => 
      window.getComputedStyle(el).fontSize
    );
    
    // 폰트 크기가 적절한지 확인
    expect(parseFloat(titleFontSize)).toBeGreaterThan(12);
    expect(parseFloat(artistFontSize)).toBeGreaterThan(10);
  });

  test('should handle high DPI displays', async ({ page }) => {
    // 고해상도 디스플레이 시뮬레이션
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    // 이미지 요소들이 선명하게 표시되는지 확인
    const coverImage = page.locator('[data-testid="cover-image"]');
    await expect(coverImage).toBeVisible();
    
    // 이미지 품질 확인
    const imageSrc = await coverImage.getAttribute('src');
    expect(imageSrc).toContain('@2x') || expect(imageSrc).toContain('high-res');
  });

  test('should maintain accessibility across screen sizes', async ({ page }) => {
    const viewports = [
      { width: 1920, height: 1080 },
      { width: 768, height: 1024 },
      { width: 375, height: 667 }
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      
      // 키보드 접근성 확인
      await page.keyboard.press('Tab');
      
      // 포커스가 이동하는지 확인
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
      
      // Enter 키로 재생/일시정지
      await page.keyboard.press('Enter');
      
      // 플레이어 상태가 변경되는지 확인
      const playButton = page.locator('[data-testid="play-button"]');
      const pauseButton = page.locator('[data-testid="pause-button"]');
      
      const isPlaying = await pauseButton.isVisible();
      const isPaused = await playButton.isVisible();
      
      expect(isPlaying || isPaused).toBeTruthy();
    }
  });
});