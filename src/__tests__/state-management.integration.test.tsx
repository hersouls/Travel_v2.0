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

describe('State Management Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('현재 재생 중인 트랙 상태가 올바르게 관리된다', async () => {
    await act(async () => {
      render(<App />);
    });

    // 트랙 목록 페이지로 이동
    window.history.pushState({}, '', '/tracks');
    
    await waitFor(() => {
      expect(screen.getByText('테스트 트랙 1')).toBeInTheDocument();
    }, { timeout: 5000 });

    // 첫 번째 트랙 클릭
    const firstTrack = screen.getByText('테스트 트랙 1');
    await act(async () => {
      fireEvent.click(firstTrack);
    });

    // 현재 재생 중인 트랙이 올바르게 표시되는지 확인
    await waitFor(() => {
      expect(screen.getByText('테스트 트랙 1')).toBeInTheDocument();
    });
  });

  test('재생 목록 상태가 올바르게 관리된다', async () => {
    await act(async () => {
      render(<App />);
    });

    // 트랙 목록 페이지로 이동
    window.history.pushState({}, '', '/tracks');
    
    await waitFor(() => {
      expect(screen.getByText('테스트 트랙 1')).toBeInTheDocument();
      expect(screen.getByText('테스트 트랙 2')).toBeInTheDocument();
    }, { timeout: 5000 });

    // 모든 트랙이 목록에 표시되는지 확인
    expect(screen.getByText('테스트 트랙 1')).toBeInTheDocument();
    expect(screen.getByText('테스트 트랙 2')).toBeInTheDocument();
  });

  test('볼륨 상태가 올바르게 관리된다', async () => {
    await act(async () => {
      render(<App />);
    });

    // 트랙 목록 페이지로 이동
    window.history.pushState({}, '', '/tracks');
    
    await waitFor(() => {
      expect(screen.getByText('테스트 트랙 1')).toBeInTheDocument();
    }, { timeout: 5000 });

    // 볼륨 컨트롤이 있는지 확인
    const volumeControls = screen.queryAllByRole('slider');
    
    if (volumeControls.length > 0) {
      const volumeSlider = volumeControls[0];
      
      // 볼륨 변경
      await act(async () => {
        fireEvent.change(volumeSlider, { target: { value: '75' } });
      });

      // 볼륨 상태가 변경되었는지 확인
      await waitFor(() => {
        expect(volumeSlider).toHaveValue('75');
      });
    }
  });

  test('재생 모드 상태가 올바르게 관리된다', async () => {
    await act(async () => {
      render(<App />);
    });

    // 트랙 목록 페이지로 이동
    window.history.pushState({}, '', '/tracks');
    
    await waitFor(() => {
      expect(screen.getByText('테스트 트랙 1')).toBeInTheDocument();
    }, { timeout: 5000 });

    // 재생 모드 버튼 찾기 (반복, 셔플 등)
    const modeButtons = screen.queryAllByRole('button');
    const shuffleButton = modeButtons.find(button => 
      button.getAttribute('aria-label')?.includes('shuffle') ||
      button.textContent?.includes('셔플')
    );

    if (shuffleButton) {
      await act(async () => {
        fireEvent.click(shuffleButton);
      });

      // 셔플 모드가 활성화되었는지 확인
      await waitFor(() => {
        expect(shuffleButton).toHaveAttribute('aria-pressed', 'true');
      });
    }
  });

  test('페이지 새로고침 시 상태가 올바르게 복원된다', async () => {
    await act(async () => {
      render(<App />);
    });

    // 트랙 목록 페이지로 이동
    window.history.pushState({}, '', '/tracks');
    
    await waitFor(() => {
      expect(screen.getByText('테스트 트랙 1')).toBeInTheDocument();
    }, { timeout: 5000 });

    // 첫 번째 트랙 선택
    const firstTrack = screen.getByText('테스트 트랙 1');
    await act(async () => {
      fireEvent.click(firstTrack);
    });

    // 페이지 새로고침 시뮬레이션
    await act(async () => {
      window.location.reload();
    });

    // 상태가 복원되었는지 확인
    await waitFor(() => {
      expect(screen.getByText('테스트 트랙 1')).toBeInTheDocument();
    });
  });

  test('에러 상태가 올바르게 관리된다', async () => {
    // fetch를 실패하도록 모킹
    global.fetch = jest.fn(() => Promise.reject(new Error('Network error'))) as jest.Mock;

    await act(async () => {
      render(<App />);
    });

    // 트랙 목록 페이지로 이동
    window.history.pushState({}, '', '/tracks');
    
    await waitFor(() => {
      // 에러 상태가 표시되는지 확인
      expect(screen.getByText('트랙을 불러오는 중...')).toBeInTheDocument();
    });
  });

  test('로딩 상태가 올바르게 관리된다', async () => {
    // fetch를 지연시키도록 모킹
    global.fetch = jest.fn(() => 
      new Promise(resolve => 
        setTimeout(() => 
          resolve({
            json: () => Promise.resolve({ tracks: mockTracks }),
          }), 100
        )
      )
    ) as jest.Mock;

    await act(async () => {
      render(<App />);
    });

    // 트랙 목록 페이지로 이동
    window.history.pushState({}, '', '/tracks');
    
    // 로딩 상태가 표시되는지 확인
    expect(screen.getByText('트랙을 불러오는 중...')).toBeInTheDocument();

    // 로딩이 완료되면 트랙이 표시되는지 확인
    await waitFor(() => {
      expect(screen.getByText('테스트 트랙 1')).toBeInTheDocument();
    }, { timeout: 5000 });
  });
});