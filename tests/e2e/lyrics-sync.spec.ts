import { test, expect } from '@playwright/test';

test.describe('Lyrics Sync E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should display lyrics container when lyrics are available', async ({ page }) => {
    // 가사가 있는 곡으로 이동 (첫 번째 곡이 가사가 있다고 가정)
    await page.click('[data-testid="play-button"]');
    
    // 가사 컨테이너가 표시되는지 확인
    const lyricsContainer = page.locator('[data-testid="lyrics-container"]');
    await expect(lyricsContainer).toBeVisible();
  });

  test('should highlight current lyrics line during playback', async ({ page }) => {
    // 재생 시작
    await page.click('[data-testid="play-button"]');
    
    // 가사 라인들이 표시되는지 확인
    const lyricsLines = page.locator('[data-testid="lyrics-line"]');
    await expect(lyricsLines.first()).toBeVisible();
    
    // 3초 대기 후 현재 라인이 하이라이트되었는지 확인
    await page.waitForTimeout(3000);
    
    // 현재 활성화된 가사 라인이 있는지 확인
    const activeLyricsLine = page.locator('[data-testid="lyrics-line"].active');
    await expect(activeLyricsLine).toBeVisible();
  });

  test('should scroll lyrics automatically during playback', async ({ page }) => {
    // 재생 시작
    await page.click('[data-testid="play-button"]');
    
    // 가사 컨테이너의 초기 스크롤 위치 저장
    const lyricsContainer = page.locator('[data-testid="lyrics-container"]');
    const initialScrollTop = await lyricsContainer.evaluate(el => el.scrollTop);
    
    // 5초 대기
    await page.waitForTimeout(5000);
    
    // 스크롤 위치가 변경되었는지 확인
    const currentScrollTop = await lyricsContainer.evaluate(el => el.scrollTop);
    expect(currentScrollTop).toBeGreaterThan(initialScrollTop);
  });

  test('should sync lyrics with audio time', async ({ page }) => {
    // 재생 시작
    await page.click('[data-testid="play-button"]');
    
    // 오디오 요소 가져오기
    const audioElement = page.locator('audio');
    
    // 2초 대기
    await page.waitForTimeout(2000);
    
    // 현재 오디오 시간 확인
    const currentTime = await audioElement.evaluate(el => el.currentTime);
    
    // 해당 시간에 맞는 가사 라인이 활성화되었는지 확인
    const activeLyricsLine = page.locator('[data-testid="lyrics-line"].active');
    await expect(activeLyricsLine).toBeVisible();
    
    // 가사 라인의 시간 속성 확인
    const lineTime = await activeLyricsLine.getAttribute('data-time');
    if (lineTime) {
      const timeValue = parseFloat(lineTime);
      expect(timeValue).toBeLessThanOrEqual(currentTime + 1); // 1초 오차 허용
    }
  });

  test('should handle lyrics for songs without lyrics', async ({ page }) => {
    // 가사가 없는 곡으로 이동 (예: 마지막 곡)
    for (let i = 0; i < 12; i++) {
      await page.click('[data-testid="next-button"]');
      await page.waitForTimeout(500);
    }
    
    // 가사 컨테이너가 표시되지 않거나 "가사 없음" 메시지가 표시되는지 확인
    const lyricsContainer = page.locator('[data-testid="lyrics-container"]');
    const noLyricsMessage = page.locator('[data-testid="no-lyrics-message"]');
    
    // 둘 중 하나는 표시되어야 함
    const hasLyrics = await lyricsContainer.isVisible();
    const hasNoLyricsMessage = await noLyricsMessage.isVisible();
    
    expect(hasLyrics || hasNoLyricsMessage).toBeTruthy();
  });

  test('should pause lyrics sync when audio is paused', async ({ page }) => {
    // 재생 시작
    await page.click('[data-testid="play-button"]');
    
    // 2초 대기 후 일시정지
    await page.waitForTimeout(2000);
    await page.click('[data-testid="pause-button"]');
    
    // 현재 활성화된 가사 라인 저장
    const activeLineBeforePause = await page.locator('[data-testid="lyrics-line"].active').textContent();
    
    // 3초 더 대기
    await page.waitForTimeout(3000);
    
    // 가사 라인이 변경되지 않았는지 확인 (일시정지 상태이므로)
    const activeLineAfterPause = await page.locator('[data-testid="lyrics-line"].active').textContent();
    expect(activeLineAfterPause).toBe(activeLineBeforePause);
  });

  test('should resume lyrics sync when audio is resumed', async ({ page }) => {
    // 재생 시작
    await page.click('[data-testid="play-button"]');
    
    // 2초 대기 후 일시정지
    await page.waitForTimeout(2000);
    await page.click('[data-testid="pause-button"]');
    
    // 현재 활성화된 가사 라인 저장
    const activeLineBeforePause = await page.locator('[data-testid="lyrics-line"].active').textContent();
    
    // 다시 재생
    await page.click('[data-testid="play-button"]');
    
    // 3초 대기
    await page.waitForTimeout(3000);
    
    // 가사 라인이 변경되었는지 확인 (재생 상태이므로)
    const activeLineAfterResume = await page.locator('[data-testid="lyrics-line"].active').textContent();
    expect(activeLineAfterResume).not.toBe(activeLineBeforePause);
  });

  test('should handle lyrics timing precision', async ({ page }) => {
    // 재생 시작
    await page.click('[data-testid="play-button"]');
    
    // 가사 라인들의 시간 정보 확인
    const lyricsLines = page.locator('[data-testid="lyrics-line"]');
    const count = await lyricsLines.count();
    
    // 모든 가사 라인이 시간 정보를 가지고 있는지 확인
    for (let i = 0; i < Math.min(count, 5); i++) { // 처음 5개만 확인
      const line = lyricsLines.nth(i);
      const timeAttr = await line.getAttribute('data-time');
      expect(timeAttr).toBeTruthy();
      expect(parseFloat(timeAttr!)).toBeGreaterThanOrEqual(0);
    }
  });

  test('should handle rapid song changes', async ({ page }) => {
    // 빠르게 곡 변경
    for (let i = 0; i < 3; i++) {
      await page.click('[data-testid="next-button"]');
      await page.waitForTimeout(100);
    }
    
    // 가사 컨테이너가 정상적으로 표시되는지 확인
    const lyricsContainer = page.locator('[data-testid="lyrics-container"]');
    await expect(lyricsContainer).toBeVisible();
    
    // 재생 시작
    await page.click('[data-testid="play-button"]');
    
    // 가사 싱크가 정상적으로 작동하는지 확인
    await page.waitForTimeout(2000);
    const activeLyricsLine = page.locator('[data-testid="lyrics-line"].active');
    await expect(activeLyricsLine).toBeVisible();
  });
});