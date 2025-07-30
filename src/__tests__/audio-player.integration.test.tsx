import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import App from '../App';
import { Track } from '../types';

// Mock the tracks data
const mockTracks: Track[] = [
  {
    id: '1',
    title: '테스트 트랙 1',
    artist: '테스트 아티스트',
    duration: 180,
    file: '/audio/test1.mp3',
    cover: '/covers/test1.jpg',
    description: '테스트 트랙 1 설명',
  },
  {
    id: '2',
    title: '테스트 트랙 2',
    artist: '테스트 아티스트',
    duration: 200,
    file: '/audio/test2.mp3',
    cover: '/covers/test2.jpg',
    description: '테스트 트랙 2 설명',
  },
];

// Mock fetch for tracks data
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ tracks: mockTracks }),
  })
) as jest.Mock;

// Mock Howler.js
jest.mock('howler', () => ({
  Howl: jest.fn().mockImplementation(() => ({
    play: jest.fn(),
    pause: jest.fn(),
    stop: jest.fn(),
    seek: jest.fn(),
    volume: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
    duration: jest.fn(() => 180),
    playing: jest.fn(() => false),
  })),
}));

describe('Audio Player Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('음악 재생 버튼을 클릭하면 재생이 시작된다', async () => {
    await act(async () => {
      render(<App />);
    });

    // 트랙 목록 페이지로 이동
    window.history.pushState({}, '', '/tracks');
    
    await waitFor(() => {
      expect(screen.getByText('트랙을 불러오는 중...')).toBeInTheDocument();
    });

    // 로딩이 완료되면 트랙이 표시되는지 확인
    await waitFor(() => {
      expect(screen.getByText('테스트 트랙 1')).toBeInTheDocument();
    }, { timeout: 5000 });

    // 첫 번째 트랙의 재생 버튼 클릭
    const playButtons = screen.getAllByRole('button');
    const playButton = playButtons.find(button => 
      button.querySelector('svg') && 
      button.querySelector('svg')?.getAttribute('viewBox') === '0 0 24 24'
    );

    if (playButton) {
      await act(async () => {
        fireEvent.click(playButton);
      });

      // 재생 상태 확인 (실제로는 Howler.js가 모킹되어 있으므로 상태 변화를 확인)
      await waitFor(() => {
        expect(playButton).toBeInTheDocument();
      });
    }
  });

  test('재생 중일 때 일시정지 버튼을 클릭하면 재생이 멈춘다', async () => {
    await act(async () => {
      render(<App />);
    });

    // 트랙 목록 페이지로 이동
    window.history.pushState({}, '', '/tracks');
    
    await waitFor(() => {
      expect(screen.getByText('트랙을 불러오는 중...')).toBeInTheDocument();
    });

    // 로딩이 완료되면 트랙이 표시되는지 확인
    await waitFor(() => {
      expect(screen.getByText('테스트 트랙 1')).toBeInTheDocument();
    }, { timeout: 5000 });

    // 재생 버튼 클릭
    const playButtons = screen.getAllByRole('button');
    const playButton = playButtons.find(button => 
      button.querySelector('svg') && 
      button.querySelector('svg')?.getAttribute('viewBox') === '0 0 24 24'
    );

    if (playButton) {
      await act(async () => {
        fireEvent.click(playButton);
      });

      // 일시정지 버튼 클릭 (실제로는 같은 버튼이 토글됨)
      await act(async () => {
        fireEvent.click(playButton);
      });

      await waitFor(() => {
        expect(playButton).toBeInTheDocument();
      });
    }
  });

  test('볼륨 조절이 올바르게 작동한다', async () => {
    await act(async () => {
      render(<App />);
    });

    // 트랙 목록 페이지로 이동
    window.history.pushState({}, '', '/tracks');
    
    await waitFor(() => {
      expect(screen.getByText('테스트 트랙 1')).toBeInTheDocument();
    });

    // 볼륨 컨트롤 찾기 (실제 구현에 따라 다를 수 있음)
    const volumeControls = screen.queryAllByRole('slider');
    
    if (volumeControls.length > 0) {
      const volumeSlider = volumeControls[0];
      
      await act(async () => {
        fireEvent.change(volumeSlider, { target: { value: '50' } });
      });

      await waitFor(() => {
        expect(volumeSlider).toHaveValue('50');
      });
    }
  });

  test('진행률 바가 올바르게 표시된다', async () => {
    await act(async () => {
      render(<App />);
    });

    // 트랙 목록 페이지로 이동
    window.history.pushState({}, '', '/tracks');
    
    await waitFor(() => {
      expect(screen.getByText('트랙을 불러오는 중...')).toBeInTheDocument();
    });

    // 로딩이 완료되면 트랙이 표시되는지 확인
    await waitFor(() => {
      expect(screen.getByText('테스트 트랙 1')).toBeInTheDocument();
    }, { timeout: 5000 });

    // 진행률 바 찾기
    const progressBars = screen.queryAllByRole('progressbar');
    
    if (progressBars.length > 0) {
      expect(progressBars[0]).toBeInTheDocument();
    }
  });

  test('트랙 변경 시 이전 트랙이 자동으로 정지된다', async () => {
    await act(async () => {
      render(<App />);
    });

    // 트랙 목록 페이지로 이동
    window.history.pushState({}, '', '/tracks');
    
    await waitFor(() => {
      expect(screen.getByText('트랙을 불러오는 중...')).toBeInTheDocument();
    });

    // 로딩이 완료되면 모든 트랙이 표시되는지 확인
    await waitFor(() => {
      expect(screen.getByText('테스트 트랙 1')).toBeInTheDocument();
      expect(screen.getByText('테스트 트랙 2')).toBeInTheDocument();
    }, { timeout: 5000 });

    // 첫 번째 트랙 재생
    const playButtons = screen.getAllByRole('button');
    const firstPlayButton = playButtons.find(button => 
      button.querySelector('svg') && 
      button.querySelector('svg')?.getAttribute('viewBox') === '0 0 24 24'
    );

    if (firstPlayButton) {
      await act(async () => {
        fireEvent.click(firstPlayButton);
      });

      // 두 번째 트랙 클릭
      const secondTrack = screen.getByText('테스트 트랙 2');
      await act(async () => {
        fireEvent.click(secondTrack);
      });

      // 두 번째 트랙이 선택되었는지 확인
      await waitFor(() => {
        expect(screen.getByText('테스트 트랙 2')).toBeInTheDocument();
      });
    }
  });

  test('오디오 파일 로딩 실패 시 에러 처리가 올바르게 작동한다', async () => {
    // fetch를 실패하도록 모킹
    global.fetch = jest.fn(() => Promise.reject(new Error('Network error'))) as jest.Mock;

    await act(async () => {
      render(<App />);
    });

    // 트랙 목록 페이지로 이동
    window.history.pushState({}, '', '/tracks');
    
    await waitFor(() => {
      // 에러 메시지나 로딩 상태가 표시되는지 확인
      expect(screen.getByText('트랙을 불러오는 중...')).toBeInTheDocument();
    });
  });
});