import React, { useState, useCallback } from 'react';
import { LyricsSync, LyricsManager } from '@/components/player';
import { sampleTrack, sampleLyrics } from '@/data/sampleLyrics';
import { SyncLine } from '@/types';

export const LyricsTestPage: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [syncLines, setSyncLines] = useState<SyncLine[]>(sampleLyrics);

  // 시간 업데이트 시뮬레이션
  const handleTimeUpdate = useCallback(() => {
    if (isPlaying) {
      setCurrentTime(prev => {
        const newTime = prev + 0.1;
        return newTime > sampleTrack.duration ? 0 : newTime;
      });
    }
  }, [isPlaying]);

  // 재생/정지 토글
  const togglePlayback = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  // 시간 이동
  const seekToTime = useCallback((time: number) => {
    setCurrentTime(Math.max(0, Math.min(time, sampleTrack.duration)));
  }, []);

  // 가사 업데이트
  const handleSyncLinesUpdate = useCallback((updatedLines: SyncLine[]) => {
    setSyncLines(updatedLines);
  }, []);

  // 시간 업데이트 타이머
  React.useEffect(() => {
    const interval = setInterval(handleTimeUpdate, 100);
    return () => clearInterval(interval);
  }, [handleTimeUpdate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">가사 싱크 기능 테스트</h1>
          <p className="text-gray-300">5.4 Step by Step 개발 완료 - 가사 싱크 기능</p>
        </div>

        {/* 컨트롤 패널 */}
        <div className="mb-8 p-6 bg-white/10 backdrop-blur-sm rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-white">재생 컨트롤</h2>
            <div className="flex items-center space-x-4">
              <button
                onClick={togglePlayback}
                className="px-6 py-2 bg-moonwave-400 hover:bg-moonwave-500 rounded-lg transition-colors"
              >
                {isPlaying ? '정지' : '재생'}
              </button>
              <span className="text-white font-mono">
                {currentTime.toFixed(1)}s / {sampleTrack.duration.toFixed(1)}s
              </span>
            </div>
          </div>
          
          {/* 진행바 */}
          <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
            <div
              className="bg-moonwave-400 h-2 rounded-full transition-all duration-100"
              style={{ width: `${(currentTime / sampleTrack.duration) * 100}%` }}
            />
          </div>
          
          {/* 시간 이동 버튼 */}
          <div className="flex space-x-2">
            <button
              onClick={() => seekToTime(currentTime - 5)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
            >
              -5초
            </button>
            <button
              onClick={() => seekToTime(currentTime + 5)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
            >
              +5초
            </button>
            <button
              onClick={() => seekToTime(0)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
            >
              처음으로
            </button>
          </div>
        </div>

        {/* 트랙 정보 */}
        <div className="mb-8 p-6 bg-white/10 backdrop-blur-sm rounded-lg">
          <div className="flex items-center space-x-4">
            <img
              src={sampleTrack.coverUrl}
              alt={sampleTrack.title}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div>
              <h3 className="text-xl font-semibold text-white">{sampleTrack.title}</h3>
              <p className="text-gray-300">{sampleTrack.artist}</p>
              <p className="text-sm text-gray-400">{sampleTrack.description}</p>
            </div>
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 가사 싱크 컴포넌트 */}
          <div>
            <h2 className="text-2xl font-semibold text-white mb-4">실시간 가사 싱크</h2>
            <LyricsSync
              lyrics={syncLines}
              currentTime={currentTime}
              className="h-96"
            />
          </div>

          {/* 가사 관리 컴포넌트 */}
          <div>
            <h2 className="text-2xl font-semibold text-white mb-4">가사 관리 도구</h2>
            <LyricsManager
              syncLines={syncLines}
              currentTime={currentTime}
              onTimeChange={seekToTime}
              onSyncLinesUpdate={handleSyncLinesUpdate}
              trackInfo={{ title: sampleTrack.title, artist: sampleTrack.artist }}
              className="h-96"
            />
          </div>
        </div>

        {/* 기능 설명 */}
        <div className="mt-8 p-6 bg-white/10 backdrop-blur-sm rounded-lg">
          <h2 className="text-2xl font-semibold text-white mb-4">개발된 기능들</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-moonwave-400 mb-2">✅ 완료된 기능</h3>
              <ul className="space-y-1 text-gray-300">
                <li>• 가사 데이터 구조 설계</li>
                <li>• 실시간 가사 하이라이트 구현</li>
                <li>• 오디오 시간과 가사 매칭 알고리즘</li>
                <li>• 가사 스크롤 자동화</li>
                <li>• 가사 타이밍 조정 기능</li>
                <li>• LRC 형식 지원</li>
                <li>• JSON 가져오기/내보내기</li>
                <li>• 가사 검색 및 검증</li>
                <li>• 통계 정보 제공</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-moonwave-400 mb-2">🎯 주요 특징</h3>
              <ul className="space-y-1 text-gray-300">
                <li>• 정확한 타이밍 동기화</li>
                <li>• 실시간 진행률 표시</li>
                <li>• 번역 지원</li>
                <li>• 폰트 크기 조정</li>
                <li>• 자동 스크롤 설정</li>
                <li>• 전체/개별 타이밍 조정</li>
                <li>• 가사 텍스트 정규화</li>
                <li>• 오류 검증 시스템</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};