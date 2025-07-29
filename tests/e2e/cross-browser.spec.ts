import { test, expect } from '@playwright/test';

test.describe('Cross Browser E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should load the application in all browsers', async ({ page }) => {
    // 기본 페이지 로드 확인
    await expect(page.locator('[data-testid="main-container"]')).toBeVisible();
    
    // 음악 플레이어가 로드되는지 확인
    await expect(page.locator('[data-testid="music-player"]')).toBeVisible();
    
    // 페이지 제목 확인
    await expect(page).toHaveTitle(/Moonwave|오안나/);
  });

  test('should handle audio playback in all browsers', async ({ page }) => {
    // 재생 버튼 클릭
    await page.click('[data-testid="play-button"]');
    
    // 재생 상태 확인
    await expect(page.locator('[data-testid="pause-button"]')).toBeVisible();
    
    // 오디오 요소가 존재하는지 확인
    const audioElement = page.locator('audio');
    await expect(audioElement).toBeVisible();
    
    // 오디오가 로드되었는지 확인
    await expect(audioElement).toHaveAttribute('src');
  });

  test('should handle audio controls consistently across browsers', async ({ page }) => {
    // 재생/일시정지 토글
    await page.click('[data-testid="play-button"]');
    await expect(page.locator('[data-testid="pause-button"]')).toBeVisible();
    
    await page.click('[data-testid="pause-button"]');
    await expect(page.locator('[data-testid="play-button"]')).toBeVisible();
    
    // 다음/이전 곡 네비게이션
    const initialSongInfo = await page.locator('[data-testid="current-song-info"]').textContent();
    
    await page.click('[data-testid="next-button"]');
    await expect(page.locator('[data-testid="current-song-info"]')).not.toHaveText(initialSongInfo!);
    
    await page.click('[data-testid="prev-button"]');
    await expect(page.locator('[data-testid="current-song-info"]')).toHaveText(initialSongInfo!);
  });

  test('should handle volume control in all browsers', async ({ page }) => {
    // 볼륨 슬라이더 찾기
    const volumeSlider = page.locator('[data-testid="volume-slider"]');
    await expect(volumeSlider).toBeVisible();
    
    // 볼륨 조절 테스트
    await volumeSlider.fill('50');
    await expect(volumeSlider).toHaveValue('50');
    
    await volumeSlider.fill('100');
    await expect(volumeSlider).toHaveValue('100');
    
    await volumeSlider.fill('0');
    await expect(volumeSlider).toHaveValue('0');
  });

  test('should handle progress bar in all browsers', async ({ page }) => {
    // 재생 시작
    await page.click('[data-testid="play-button"]');
    
    // 진행률 바 확인
    const progressBar = page.locator('[data-testid="progress-bar"]');
    await expect(progressBar).toBeVisible();
    
    // 진행률 바 클릭 테스트
    const progressBarBox = await progressBar.boundingBox();
    if (progressBarBox) {
      await page.mouse.click(
        progressBarBox.x + progressBarBox.width * 0.5,
        progressBarBox.y + progressBarBox.height * 0.5
      );
    }
    
    // 진행률이 업데이트되는지 확인
    await page.waitForTimeout(1000);
    const progressValue = await progressBar.getAttribute('aria-valuenow');
    expect(parseInt(progressValue || '0')).toBeGreaterThan(0);
  });

  test('should handle keyboard navigation in all browsers', async ({ page }) => {
    // Tab 키로 포커스 이동
    await page.keyboard.press('Tab');
    
    // 포커스된 요소 확인
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Enter 키로 재생/일시정지
    await page.keyboard.press('Enter');
    
    // 플레이어 상태 변경 확인
    const playButton = page.locator('[data-testid="play-button"]');
    const pauseButton = page.locator('[data-testid="pause-button"]');
    
    const isPlaying = await pauseButton.isVisible();
    const isPaused = await playButton.isVisible();
    
    expect(isPlaying || isPaused).toBeTruthy();
  });

  test('should handle touch events on mobile browsers', async ({ page }) => {
    // 모바일 뷰포트 설정
    await page.setViewportSize({ width: 375, height: 667 });
    
    // 터치 이벤트 시뮬레이션
    const playButton = page.locator('[data-testid="play-button"]');
    await playButton.tap();
    
    // 재생 상태 확인
    await expect(page.locator('[data-testid="pause-button"]')).toBeVisible();
    
    // 스와이프 제스처 테스트
    const playerContainer = page.locator('[data-testid="music-player"]');
    await playerContainer.hover();
    await page.mouse.down();
    await page.mouse.move(200, 300);
    await page.mouse.up();
  });

  test('should handle CSS animations consistently', async ({ page }) => {
    // 애니메이션이 있는 요소들 확인
    const animatedElements = page.locator('[data-testid*="animated"]');
    
    // 애니메이션 클래스가 적용되는지 확인
    const hasAnimationClass = await animatedElements.evaluate(elements => {
      return Array.from(elements).some(el => 
        el.classList.contains('animate') || 
        el.style.animation || 
        el.style.transition
      );
    });
    
    expect(hasAnimationClass).toBeTruthy();
  });

  test('should handle font rendering consistently', async ({ page }) => {
    // 텍스트 요소들 확인
    const textElements = page.locator('[data-testid="song-title"], [data-testid="artist-name"]');
    
    // 폰트 패밀리가 올바르게 적용되는지 확인
    for (let i = 0; i < await textElements.count(); i++) {
      const element = textElements.nth(i);
      const fontFamily = await element.evaluate(el => 
        window.getComputedStyle(el).fontFamily
      );
      
      // Pretendard 폰트가 적용되는지 확인
      expect(fontFamily.toLowerCase()).toContain('pretendard');
    }
  });

  test('should handle image loading consistently', async ({ page }) => {
    // 이미지 요소들 확인
    const images = page.locator('img[data-testid="cover-image"]');
    
    // 이미지가 로드되는지 확인
    for (let i = 0; i < await images.count(); i++) {
      const image = images.nth(i);
      await expect(image).toBeVisible();
      
      // 이미지 로드 완료 확인
      await expect(image).toHaveAttribute('src');
      
      // 이미지 로드 에러가 없는지 확인
      const hasError = await image.evaluate(el => {
        return el.naturalWidth === 0 || el.naturalHeight === 0;
      });
      
      expect(hasError).toBeFalsy();
    }
  });

  test('should handle localStorage consistently', async ({ page }) => {
    // 로컬 스토리지 테스트
    await page.evaluate(() => {
      localStorage.setItem('test-key', 'test-value');
    });
    
    // 값이 저장되었는지 확인
    const storedValue = await page.evaluate(() => {
      return localStorage.getItem('test-key');
    });
    
    expect(storedValue).toBe('test-value');
    
    // 테스트 데이터 정리
    await page.evaluate(() => {
      localStorage.removeItem('test-key');
    });
  });

  test('should handle audio API consistently', async ({ page }) => {
    // 재생 시작
    await page.click('[data-testid="play-button"]');
    
    // 오디오 API 상태 확인
    const audioState = await page.evaluate(() => {
      const audio = document.querySelector('audio');
      if (!audio) return null;
      
      return {
        paused: audio.paused,
        currentTime: audio.currentTime,
        duration: audio.duration,
        volume: audio.volume,
        readyState: audio.readyState
      };
    });
    
    expect(audioState).toBeTruthy();
    expect(audioState!.paused).toBeFalsy();
    expect(audioState!.readyState).toBeGreaterThan(0);
  });

  test('should handle error states consistently', async ({ page }) => {
    // 네트워크 오프라인 시뮬레이션
    await page.route('**/*', route => route.abort());
    
    // 페이지 새로고침
    await page.reload();
    
    // 에러 상태 처리 확인
    const errorMessage = page.locator('[data-testid="error-message"]');
    const retryButton = page.locator('[data-testid="retry-button"]');
    
    // 에러 메시지나 재시도 버튼이 표시되는지 확인
    const hasError = await errorMessage.isVisible();
    const hasRetry = await retryButton.isVisible();
    
    expect(hasError || hasRetry).toBeTruthy();
  });

  test('should handle performance consistently', async ({ page }) => {
    // 페이지 로드 성능 측정
    const loadTime = await page.evaluate(() => {
      return performance.timing.loadEventEnd - performance.timing.navigationStart;
    });
    
    // 로드 시간이 합리적인 범위 내에 있는지 확인
    expect(loadTime).toBeLessThan(5000); // 5초 이내
    
    // 메모리 사용량 확인
    const memoryInfo = await page.evaluate(() => {
      if ('memory' in performance) {
        return (performance as any).memory;
      }
      return null;
    });
    
    if (memoryInfo) {
      expect(memoryInfo.usedJSHeapSize).toBeLessThan(50 * 1024 * 1024); // 50MB 이내
    }
  });
});