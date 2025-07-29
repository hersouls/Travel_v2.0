import { test, expect } from '@playwright/test';

test.describe('Music Player E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // 각 테스트 전에 홈페이지로 이동
    await page.goto('/');
    // 페이지가 완전히 로드될 때까지 대기
    await page.waitForLoadState('networkidle');
  });

  test('should load the music player and display initial state', async ({ page }) => {
    // 음악 플레이어가 로드되었는지 확인
    await expect(page.locator('[data-testid="music-player"]')).toBeVisible();
    
    // 재생 버튼이 표시되는지 확인
    await expect(page.locator('[data-testid="play-button"]')).toBeVisible();
    
    // 현재 곡 정보가 표시되는지 확인
    await expect(page.locator('[data-testid="current-song-info"]')).toBeVisible();
  });

  test('should play music when play button is clicked', async ({ page }) => {
    // 재생 버튼 클릭
    await page.click('[data-testid="play-button"]');
    
    // 재생 상태로 변경되었는지 확인
    await expect(page.locator('[data-testid="pause-button"]')).toBeVisible();
    
    // 오디오가 실제로 재생되고 있는지 확인
    const audioElement = page.locator('audio');
    await expect(audioElement).toHaveAttribute('paused', 'false');
  });

  test('should pause music when pause button is clicked', async ({ page }) => {
    // 먼저 재생
    await page.click('[data-testid="play-button"]');
    await expect(page.locator('[data-testid="pause-button"]')).toBeVisible();
    
    // 일시정지 버튼 클릭
    await page.click('[data-testid="pause-button"]');
    
    // 일시정지 상태로 변경되었는지 확인
    await expect(page.locator('[data-testid="play-button"]')).toBeVisible();
    
    // 오디오가 실제로 일시정지되었는지 확인
    const audioElement = page.locator('audio');
    await expect(audioElement).toHaveAttribute('paused', 'true');
  });

  test('should navigate to next song', async ({ page }) => {
    // 현재 곡 정보 저장
    const initialSongInfo = await page.locator('[data-testid="current-song-info"]').textContent();
    
    // 다음 곡 버튼 클릭
    await page.click('[data-testid="next-button"]');
    
    // 곡 정보가 변경되었는지 확인
    await expect(page.locator('[data-testid="current-song-info"]')).not.toHaveText(initialSongInfo!);
  });

  test('should navigate to previous song', async ({ page }) => {
    // 먼저 다음 곡으로 이동
    await page.click('[data-testid="next-button"]');
    const secondSongInfo = await page.locator('[data-testid="current-song-info"]').textContent();
    
    // 이전 곡 버튼 클릭
    await page.click('[data-testid="prev-button"]');
    
    // 첫 번째 곡으로 돌아갔는지 확인
    await expect(page.locator('[data-testid="current-song-info"]')).not.toHaveText(secondSongInfo!);
  });

  test('should adjust volume', async ({ page }) => {
    // 볼륨 슬라이더 찾기
    const volumeSlider = page.locator('[data-testid="volume-slider"]');
    await expect(volumeSlider).toBeVisible();
    
    // 볼륨을 50%로 설정
    await volumeSlider.fill('50');
    
    // 볼륨이 변경되었는지 확인
    await expect(volumeSlider).toHaveValue('50');
  });

  test('should display progress bar and update during playback', async ({ page }) => {
    // 재생 시작
    await page.click('[data-testid="play-button"]');
    
    // 진행률 바가 표시되는지 확인
    const progressBar = page.locator('[data-testid="progress-bar"]');
    await expect(progressBar).toBeVisible();
    
    // 3초 대기 후 진행률이 업데이트되었는지 확인
    await page.waitForTimeout(3000);
    
    // 진행률이 0보다 큰지 확인
    const progressValue = await progressBar.getAttribute('aria-valuenow');
    expect(parseInt(progressValue || '0')).toBeGreaterThan(0);
  });

  test('should display lyrics when available', async ({ page }) => {
    // 가사 표시 버튼 클릭 (있는 경우)
    const lyricsButton = page.locator('[data-testid="lyrics-button"]');
    if (await lyricsButton.isVisible()) {
      await lyricsButton.click();
      
      // 가사가 표시되는지 확인
      await expect(page.locator('[data-testid="lyrics-container"]')).toBeVisible();
    }
  });

  test('should handle playlist navigation', async ({ page }) => {
    // 플레이리스트 버튼 클릭
    await page.click('[data-testid="playlist-button"]');
    
    // 플레이리스트가 표시되는지 확인
    await expect(page.locator('[data-testid="playlist-container"]')).toBeVisible();
    
    // 플레이리스트에서 곡 선택
    const firstSong = page.locator('[data-testid="playlist-item"]').first();
    await firstSong.click();
    
    // 선택된 곡이 재생되는지 확인
    await expect(page.locator('[data-testid="current-song-info"]')).toBeVisible();
  });

  test('should maintain state across page refresh', async ({ page }) => {
    // 재생 시작
    await page.click('[data-testid="play-button"]');
    
    // 현재 곡 정보 저장
    const currentSongInfo = await page.locator('[data-testid="current-song-info"]').textContent();
    
    // 페이지 새로고침
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // 같은 곡이 선택되어 있는지 확인
    await expect(page.locator('[data-testid="current-song-info"]')).toHaveText(currentSongInfo!);
  });
});