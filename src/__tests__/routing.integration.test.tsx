import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

import App from '../App';

// Mock the tracks data
const mockTracks = [
  {
    id: 1,
    title: '테스트 트랙 1',
    artist: '테스트 아티스트',
    cover: '/covers/test1.jpg',
    audio: '/audio/test1.mp3',
    lyrics: '테스트 가사 1',
  },
  {
    id: 2,
    title: '테스트 트랙 2',
    artist: '테스트 아티스트',
    cover: '/covers/test2.jpg',
    audio: '/audio/test2.mp3',
    lyrics: '테스트 가사 2',
  },
];

jest.mock('./data/tracks', () => ({
  tracks: mockTracks,
}));

describe('Routing Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('기본 경로(/)에서 메인 페이지가 렌더링된다', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    // 메인 페이지 요소들이 표시되는지 확인
    expect(screen.getByText(/Moonwave/i)).toBeInTheDocument();
  });

  test('/tracks 경로에서 트랙 목록 페이지가 렌더링된다', async () => {
    render(
      <MemoryRouter initialEntries={['/tracks']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('테스트 트랙 1')).toBeInTheDocument();
      expect(screen.getByText('테스트 트랙 2')).toBeInTheDocument();
    });
  });

  test('/track/:id 경로에서 트랙 상세 페이지가 렌더링된다', async () => {
    render(
      <MemoryRouter initialEntries={['/track/1']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('테스트 트랙 1')).toBeInTheDocument();
    });
  });

  test('존재하지 않는 경로에서 404 페이지가 렌더링된다', () => {
    render(
      <MemoryRouter initialEntries={['/not-found']}>
        <App />
      </MemoryRouter>
    );

    // 404 페이지 또는 에러 메시지가 표시되는지 확인
    expect(screen.getByText(/404|not found|error/i)).toBeInTheDocument();
  });

  test('트랙 카드를 클릭하면 해당 트랙의 상세 페이지로 이동한다', async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // 트랙 목록 페이지로 이동
    const tracksLink = screen.getByText(/tracks/i);
    fireEvent.click(tracksLink);

    await waitFor(() => {
      expect(screen.getByText('테스트 트랙 1')).toBeInTheDocument();
    });

    // 첫 번째 트랙 클릭
    const firstTrack = screen.getByText('테스트 트랙 1');
    fireEvent.click(firstTrack);

    // 상세 페이지로 이동했는지 확인
    await waitFor(() => {
      expect(screen.getByText('테스트 트랙 1')).toBeInTheDocument();
    });
  });

  test('브라우저 뒤로가기 버튼이 올바르게 작동한다', async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // 트랙 목록 페이지로 이동
    const tracksLink = screen.getByText(/tracks/i);
    fireEvent.click(tracksLink);

    await waitFor(() => {
      expect(screen.getByText('테스트 트랙 1')).toBeInTheDocument();
    });

    // 브라우저 뒤로가기 시뮬레이션
    window.history.back();

    // 메인 페이지로 돌아갔는지 확인
    await waitFor(() => {
      expect(screen.getByText(/Moonwave/i)).toBeInTheDocument();
    });
  });

  test('URL이 직접 입력되어도 올바른 페이지가 렌더링된다', async () => {
    render(
      <MemoryRouter initialEntries={['/track/2']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('테스트 트랙 2')).toBeInTheDocument();
    });
  });

  test('라우팅 시 페이지 제목이 올바르게 변경된다', async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // 초기 페이지 제목 확인
    expect(document.title).toContain('Moonwave');

    // 트랙 목록 페이지로 이동
    const tracksLink = screen.getByText(/tracks/i);
    fireEvent.click(tracksLink);

    await waitFor(() => {
      expect(document.title).toContain('Tracks');
    });
  });

  test('라우팅 시 스크롤이 페이지 상단으로 이동한다', async () => {
    // 스크롤 위치 모킹
    Object.defineProperty(window, 'scrollTo', {
      writable: true,
      value: jest.fn(),
    });

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // 트랙 목록 페이지로 이동
    const tracksLink = screen.getByText(/tracks/i);
    fireEvent.click(tracksLink);

    await waitFor(() => {
      expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    });
  });
});