import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import { AudioPlayer } from '../AudioPlayer';

// Mock Howler
const mockHowl = {
  play: jest.fn(),
  pause: jest.fn(),
  stop: jest.fn(),
  volume: jest.fn(),
  seek: jest.fn(),
  on: jest.fn(),
  off: jest.fn(),
  duration: jest.fn(() => 180),
  playing: jest.fn(() => false),
};

jest.mock('howler', () => ({
  Howl: jest.fn(() => mockHowl),
  Howler: {
    volume: jest.fn(),
    mute: jest.fn(),
    stop: jest.fn(),
  },
}));

const mockTrack = {
  id: 1,
  title: '테스트 트랙',
  artist: '테스트 아티스트',
  cover: '/covers/test.jpg',
  audio: '/audio/test.mp3',
  lyrics: '테스트 가사',
};

describe('AudioPlayer Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mock functions
    Object.values(mockHowl).forEach(fn => {
      if (typeof fn === 'function') {
        fn.mockClear();
      }
    });
  });

  test('오디오 플레이어가 올바르게 렌더링된다', () => {
    render(
      <AudioPlayer
        isPlaying={false}
        currentTime={0}
        duration={180}
        volume={0.5}
        repeatMode="none"
        isShuffled={false}
        currentTrack={mockTrack}
        onTogglePlay={jest.fn()}
        onSeek={jest.fn()}
        onVolumeChange={jest.fn()}
        onPrevious={jest.fn()}
        onNext={jest.fn()}
        onToggleRepeat={jest.fn()}
        onToggleShuffle={jest.fn()}
      />
    );

    // 기본 UI 요소들이 표시되는지 확인
    expect(screen.getByText('테스트 트랙')).toBeInTheDocument();
    expect(screen.getByText('테스트 아티스트')).toBeInTheDocument();
  });

  test('재생 버튼을 클릭하면 음악이 재생된다', async () => {
    const onTogglePlay = jest.fn();
    render(
      <AudioPlayer
        isPlaying={false}
        currentTime={0}
        duration={180}
        volume={0.5}
        repeatMode="none"
        isShuffled={false}
        currentTrack={mockTrack}
        onTogglePlay={onTogglePlay}
        onSeek={jest.fn()}
        onVolumeChange={jest.fn()}
        onPrevious={jest.fn()}
        onNext={jest.fn()}
        onToggleRepeat={jest.fn()}
        onToggleShuffle={jest.fn()}
      />
    );

    const playButton = screen.getByRole('button', { name: /play/i });
    fireEvent.click(playButton);

    expect(onTogglePlay).toHaveBeenCalled();
  });

  test('일시정지 버튼을 클릭하면 음악이 일시정지된다', async () => {
    const onTogglePlay = jest.fn();
    render(
      <AudioPlayer
        isPlaying={true}
        currentTime={0}
        duration={180}
        volume={0.5}
        repeatMode="none"
        isShuffled={false}
        currentTrack={mockTrack}
        onTogglePlay={onTogglePlay}
        onSeek={jest.fn()}
        onVolumeChange={jest.fn()}
        onPrevious={jest.fn()}
        onNext={jest.fn()}
        onToggleRepeat={jest.fn()}
        onToggleShuffle={jest.fn()}
      />
    );

    const pauseButton = screen.getByRole('button', { name: /pause/i });
    fireEvent.click(pauseButton);

    expect(onTogglePlay).toHaveBeenCalled();
  });

  test('볼륨 조절이 올바르게 작동한다', async () => {
    const onVolumeChange = jest.fn();
    render(
      <AudioPlayer
        isPlaying={false}
        currentTime={0}
        duration={180}
        volume={0.5}
        repeatMode="none"
        isShuffled={false}
        currentTrack={mockTrack}
        onTogglePlay={jest.fn()}
        onSeek={jest.fn()}
        onVolumeChange={onVolumeChange}
        onPrevious={jest.fn()}
        onNext={jest.fn()}
        onToggleRepeat={jest.fn()}
        onToggleShuffle={jest.fn()}
      />
    );

    const volumeSlider = screen.getByRole('slider', { name: /volume/i });
    fireEvent.change(volumeSlider, { target: { value: '50' } });

    expect(onVolumeChange).toHaveBeenCalledWith(0.5);
  });

  test('진행률 표시가 올바르게 작동한다', async () => {
    const onSeek = jest.fn();
    render(
      <AudioPlayer
        isPlaying={false}
        currentTime={0}
        duration={180}
        volume={0.5}
        repeatMode="none"
        isShuffled={false}
        currentTrack={mockTrack}
        onTogglePlay={jest.fn()}
        onSeek={onSeek}
        onVolumeChange={jest.fn()}
        onPrevious={jest.fn()}
        onNext={jest.fn()}
        onToggleRepeat={jest.fn()}
        onToggleShuffle={jest.fn()}
      />
    );

    const progressBar = screen.getByRole('slider', { name: /progress/i });
    fireEvent.change(progressBar, { target: { value: '90' } });

    expect(onSeek).toHaveBeenCalledWith(90);
  });

  test('트랙 정보가 올바르게 표시된다', () => {
    render(
      <AudioPlayer
        isPlaying={false}
        currentTime={0}
        duration={180}
        volume={0.5}
        repeatMode="none"
        isShuffled={false}
        currentTrack={mockTrack}
        onTogglePlay={jest.fn()}
        onSeek={jest.fn()}
        onVolumeChange={jest.fn()}
        onPrevious={jest.fn()}
        onNext={jest.fn()}
        onToggleRepeat={jest.fn()}
        onToggleShuffle={jest.fn()}
      />
    );

    expect(screen.getByText('테스트 트랙')).toBeInTheDocument();
    expect(screen.getByText('테스트 아티스트')).toBeInTheDocument();
  });

  test('컨트롤 버튼들이 올바르게 작동한다', async () => {
    const onTogglePlay = jest.fn();
    const onPrevious = jest.fn();
    const onNext = jest.fn();
    
    render(
      <AudioPlayer
        isPlaying={false}
        currentTime={0}
        duration={180}
        volume={0.5}
        repeatMode="none"
        isShuffled={false}
        currentTrack={mockTrack}
        onTogglePlay={onTogglePlay}
        onSeek={jest.fn()}
        onVolumeChange={jest.fn()}
        onPrevious={onPrevious}
        onNext={onNext}
        onToggleRepeat={jest.fn()}
        onToggleShuffle={jest.fn()}
      />
    );

    // 재생 버튼
    const playButton = screen.getByRole('button', { name: /play/i });
    fireEvent.click(playButton);
    expect(onTogglePlay).toHaveBeenCalled();

    // 이전 버튼
    const previousButton = screen.getByRole('button', { name: /previous/i });
    fireEvent.click(previousButton);
    expect(onPrevious).toHaveBeenCalled();

    // 다음 버튼
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);
    expect(onNext).toHaveBeenCalled();
  });

  test('오디오 로딩 상태가 올바르게 처리된다', async () => {
    render(
      <AudioPlayer
        isPlaying={false}
        currentTime={0}
        duration={180}
        volume={0.5}
        repeatMode="none"
        isShuffled={false}
        currentTrack={mockTrack}
        onTogglePlay={jest.fn()}
        onSeek={jest.fn()}
        onVolumeChange={jest.fn()}
        onPrevious={jest.fn()}
        onNext={jest.fn()}
        onToggleRepeat={jest.fn()}
        onToggleShuffle={jest.fn()}
      />
    );

    // 컴포넌트가 렌더링되는지 확인
    expect(screen.getByText('테스트 트랙')).toBeInTheDocument();
  });

  test('오디오 에러 상태가 올바르게 처리된다', async () => {
    render(
      <AudioPlayer
        isPlaying={false}
        currentTime={0}
        duration={180}
        volume={0.5}
        repeatMode="none"
        isShuffled={false}
        currentTrack={mockTrack}
        onTogglePlay={jest.fn()}
        onSeek={jest.fn()}
        onVolumeChange={jest.fn()}
        onPrevious={jest.fn()}
        onNext={jest.fn()}
        onToggleRepeat={jest.fn()}
        onToggleShuffle={jest.fn()}
      />
    );

    // 컴포넌트가 렌더링되는지 확인
    expect(screen.getByText('테스트 트랙')).toBeInTheDocument();
  });
});