import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import AudioPlayer from '../AudioPlayer';

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
    render(<AudioPlayer track={mockTrack} />);

    // 기본 UI 요소들이 표시되는지 확인
    expect(screen.getByText('테스트 트랙')).toBeInTheDocument();
    expect(screen.getByText('테스트 아티스트')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument();
  });

  test('재생 버튼을 클릭하면 음악이 재생된다', async () => {
    render(<AudioPlayer track={mockTrack} />);

    const playButton = screen.getByRole('button', { name: /play/i });
    fireEvent.click(playButton);

    await waitFor(() => {
      expect(mockHowl.play).toHaveBeenCalled();
    });
  });

  test('일시정지 버튼을 클릭하면 음악이 일시정지된다', async () => {
    // 재생 중 상태로 설정
    mockHowl.playing.mockReturnValue(true);

    render(<AudioPlayer track={mockTrack} />);

    const pauseButton = screen.getByRole('button', { name: /pause/i });
    fireEvent.click(pauseButton);

    await waitFor(() => {
      expect(mockHowl.pause).toHaveBeenCalled();
    });
  });

  test('볼륨 조절이 올바르게 작동한다', async () => {
    render(<AudioPlayer track={mockTrack} />);

    const volumeSlider = screen.getByRole('slider', { name: /volume/i });
    fireEvent.change(volumeSlider, { target: { value: '50' } });

    await waitFor(() => {
      expect(mockHowl.volume).toHaveBeenCalledWith(0.5);
    });
  });

  test('진행률 표시가 올바르게 작동한다', async () => {
    // 진행률 이벤트 시뮬레이션
    mockHowl.on.mockImplementation((event, callback) => {
      if (event === 'play') {
        callback();
      }
    });

    render(<AudioPlayer track={mockTrack} />);

    const playButton = screen.getByRole('button', { name: /play/i });
    fireEvent.click(playButton);

    await waitFor(() => {
      expect(mockHowl.on).toHaveBeenCalledWith('play', expect.any(Function));
    });
  });

  test('트랙 정보가 올바르게 표시된다', () => {
    render(<AudioPlayer track={mockTrack} />);

    expect(screen.getByText('테스트 트랙')).toBeInTheDocument();
    expect(screen.getByText('테스트 아티스트')).toBeInTheDocument();
    expect(screen.getByAltText('테스트 트랙 커버')).toBeInTheDocument();
  });

  test('컨트롤 버튼들이 올바르게 작동한다', async () => {
    render(<AudioPlayer track={mockTrack} />);

    // 재생 버튼
    const playButton = screen.getByRole('button', { name: /play/i });
    fireEvent.click(playButton);

    await waitFor(() => {
      expect(mockHowl.play).toHaveBeenCalled();
    });

    // 정지 버튼 (있는 경우)
    const stopButton = screen.queryByRole('button', { name: /stop/i });
    if (stopButton) {
      fireEvent.click(stopButton);
      await waitFor(() => {
        expect(mockHowl.stop).toHaveBeenCalled();
      });
    }
  });

  test('오디오 로딩 상태가 올바르게 처리된다', async () => {
    // 로딩 상태 시뮬레이션
    mockHowl.on.mockImplementation((event, callback) => {
      if (event === 'load') {
        callback();
      }
    });

    render(<AudioPlayer track={mockTrack} />);

    await waitFor(() => {
      expect(mockHowl.on).toHaveBeenCalledWith('load', expect.any(Function));
    });
  });

  test('오디오 에러 상태가 올바르게 처리된다', async () => {
    // 에러 상태 시뮬레이션
    mockHowl.on.mockImplementation((event, callback) => {
      if (event === 'loaderror') {
        callback();
      }
    });

    render(<AudioPlayer track={mockTrack} />);

    await waitFor(() => {
      expect(mockHowl.on).toHaveBeenCalledWith('loaderror', expect.any(Function));
    });
  });
});