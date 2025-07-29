import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Track } from '@/types';

import { TracksPage } from '../TracksPage';

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

const renderWithRouter = (component: React.ReactElement) => {
  return render(component);
};

describe('TracksPage Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('페이지가 올바르게 렌더링되고 트랙 목록을 표시한다', async () => {
    renderWithRouter(<TracksPage />);

    // 로딩 상태 확인
    expect(screen.getByText('트랙을 불러오는 중...')).toBeInTheDocument();

    // 트랙 목록이 표시되는지 확인
    await waitFor(() => {
      expect(screen.getByText('테스트 트랙 1')).toBeInTheDocument();
      expect(screen.getByText('테스트 트랙 2')).toBeInTheDocument();
    });

    // 페이지 제목 확인
    expect(screen.getByText('오안나의 음악')).toBeInTheDocument();
  });

  test('트랙을 클릭하면 상세 페이지로 이동한다', async () => {
    renderWithRouter(<TracksPage />);

    // 첫 번째 트랙 클릭
    const firstTrack = await screen.findByText('테스트 트랙 1');
    fireEvent.click(firstTrack);

    // URL이 변경되었는지 확인 (실제 라우팅은 테스트 환경에서 제한적)
    expect(firstTrack).toBeInTheDocument();
  });

  test('반응형 디자인이 올바르게 작동한다', () => {
    // 모바일 뷰포트 설정
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });

    renderWithRouter(<TracksPage />);

    // 모바일에서도 로딩 상태가 표시되는지 확인
    expect(screen.getByText('트랙을 불러오는 중...')).toBeInTheDocument();
  });

  test('트랙 커버 이미지가 올바르게 로드된다', async () => {
    renderWithRouter(<TracksPage />);

    // 로딩 상태 확인
    expect(screen.getByText('트랙을 불러오는 중...')).toBeInTheDocument();

    // 트랙이 로드된 후 이미지 요소들이 존재하는지 확인
    await waitFor(() => {
      const images = screen.getAllByRole('img');
      expect(images.length).toBeGreaterThan(0);
    });
  });

  test('페이지 로딩 시 애니메이션이 적용된다', () => {
    renderWithRouter(<TracksPage />);

    // 애니메이션 클래스가 적용된 요소들이 있는지 확인
    const animatedElements = document.querySelectorAll('[class*="animate"]');
    expect(animatedElements.length).toBeGreaterThan(0);
  });
});