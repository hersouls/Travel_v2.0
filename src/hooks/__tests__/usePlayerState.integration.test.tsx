import { renderHook, act } from '@testing-library/react';

import usePlayerState from '../usePlayerState';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

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

describe('usePlayerState Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
  });

  test('초기 상태가 올바르게 설정된다', () => {
    const { result } = renderHook(() => usePlayerState());

    expect(result.current.isPlaying).toBe(false);
    expect(result.current.currentTrack).toBeNull();
    expect(result.current.volume).toBe(1);
    expect(result.current.isMuted).toBe(false);
  });

  test('트랙을 재생하면 상태가 올바르게 변경된다', async () => {
    const { result } = renderHook(() => usePlayerState());

    act(() => {
      result.current.playTrack(mockTrack);
    });

    expect(result.current.isPlaying).toBe(true);
    expect(result.current.currentTrack).toEqual(mockTrack);
    expect(mockHowl.play).toHaveBeenCalled();
  });

  test('재생 중인 트랙을 일시정지하면 상태가 올바르게 변경된다', async () => {
    const { result } = renderHook(() => usePlayerState());

    // 먼저 트랙 재생
    act(() => {
      result.current.playTrack(mockTrack);
    });

    // 일시정지
    act(() => {
      result.current.pauseTrack();
    });

    expect(result.current.isPlaying).toBe(false);
    expect(mockHowl.pause).toHaveBeenCalled();
  });

  test('볼륨을 변경하면 상태가 올바르게 업데이트된다', () => {
    const { result } = renderHook(() => usePlayerState());

    act(() => {
      result.current.setVolume(0.5);
    });

    expect(result.current.volume).toBe(0.5);
    expect(mockHowl.volume).toHaveBeenCalledWith(0.5);
  });

  test('음소거 상태가 올바르게 토글된다', () => {
    const { result } = renderHook(() => usePlayerState());

    act(() => {
      result.current.toggleMute();
    });

    expect(result.current.isMuted).toBe(true);

    act(() => {
      result.current.toggleMute();
    });

    expect(result.current.isMuted).toBe(false);
  });

  test('다른 트랙을 재생하면 이전 트랙이 자동으로 정지된다', async () => {
    const { result } = renderHook(() => usePlayerState());

    const secondTrack = { ...mockTrack, id: 2, title: '테스트 트랙 2' };

    // 첫 번째 트랙 재생
    act(() => {
      result.current.playTrack(mockTrack);
    });

    // 두 번째 트랙 재생
    act(() => {
      result.current.playTrack(secondTrack);
    });

    expect(result.current.currentTrack).toEqual(secondTrack);
    expect(mockHowl.stop).toHaveBeenCalled();
  });

  test('진행률이 올바르게 업데이트된다', () => {
    const { result } = renderHook(() => usePlayerState());

    act(() => {
      result.current.updateProgress(30);
    });

    expect(result.current.progress).toBe(30);
  });

  test('재생 시간이 올바르게 업데이트된다', () => {
    const { result } = renderHook(() => usePlayerState());

    act(() => {
      result.current.updateCurrentTime(60);
    });

    expect(result.current.currentTime).toBe(60);
  });

  test('트랙이 끝나면 자동으로 다음 트랙으로 넘어간다', async () => {
    const { result } = renderHook(() => usePlayerState());

    // 트랙 재생
    act(() => {
      result.current.playTrack(mockTrack);
    });

    // 트랙 종료 이벤트 시뮬레이션
    act(() => {
      result.current.handleTrackEnd();
    });

    expect(result.current.isPlaying).toBe(false);
  });

  test('로컬 스토리지에 설정이 저장된다', () => {
    const { result } = renderHook(() => usePlayerState());

    act(() => {
      result.current.setVolume(0.7);
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'player-volume',
      '0.7'
    );
  });

  test('로컬 스토리지에서 설정을 불러온다', () => {
    localStorageMock.getItem.mockReturnValue('0.8');

    const { result } = renderHook(() => usePlayerState());

    expect(result.current.volume).toBe(0.8);
    expect(localStorageMock.getItem).toHaveBeenCalledWith('player-volume');
  });

  test('재생 목록이 올바르게 관리된다', () => {
    const { result } = renderHook(() => usePlayerState());

    const tracks = [mockTrack, { ...mockTrack, id: 2 }];

    act(() => {
      result.current.setPlaylist(tracks);
    });

    expect(result.current.playlist).toEqual(tracks);
  });

  test('재생 모드가 올바르게 변경된다', () => {
    const { result } = renderHook(() => usePlayerState());

    act(() => {
      result.current.setPlayMode('repeat');
    });

    expect(result.current.playMode).toBe('repeat');
  });

  test('에러 상태가 올바르게 처리된다', () => {
    const { result } = renderHook(() => usePlayerState());

    act(() => {
      result.current.setError('오디오 로딩 실패');
    });

    expect(result.current.error).toBe('오디오 로딩 실패');
  });

  test('로딩 상태가 올바르게 관리된다', () => {
    const { result } = renderHook(() => usePlayerState());

    act(() => {
      result.current.setLoading(true);
    });

    expect(result.current.isLoading).toBe(true);

    act(() => {
      result.current.setLoading(false);
    });

    expect(result.current.isLoading).toBe(false);
  });
});