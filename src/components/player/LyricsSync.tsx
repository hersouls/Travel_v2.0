import React, { useState } from 'react';
import { Track } from '@/types';
import { useLyricsSync } from '@/hooks/useLyricsSync';
import { 
  ChevronUpIcon, 
  ChevronDownIcon, 
  AdjustmentsHorizontalIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';

interface LyricsSyncProps {
  track: Track;
  currentTime: number;
  className?: string;
}

export const LyricsSync: React.FC<LyricsSyncProps> = ({
  track,
  currentTime,
  className = '',
}) => {
  const [showSettings, setShowSettings] = useState(false);
  
  const {
    state,
    currentLine,
    nextLine,
    containerRef,
    activeLineRef,
    adjustSyncOffset,
    updateSettings,
    toggleVisibility,
    getProgressInCurrentLine,
  } = useLyricsSync({
    syncLines: track.lyrics || [],
    currentTime,
    settings: {
      autoScroll: true,
      highlightCurrent: true,
      showTranslation: false,
      syncOffset: 0,
      fontSize: 'medium',
      theme: 'auto',
    },
  });

  if (!track.lyrics || track.lyrics.length === 0) {
    return (
      <div className={`text-center text-gray-400 py-8 ${className}`}>
        <p>가사 정보가 없습니다.</p>
      </div>
    );
  }

  const fontSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  };

  return (
    <div className={`relative ${className}`}>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4 p-2 bg-white/10 backdrop-blur-sm rounded-lg">
        <h3 className="text-lg font-medium text-white">가사</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleVisibility}
            className="p-1 rounded-md hover:bg-white/10 transition-colors"
            title={state.isVisible ? '가사 숨기기' : '가사 보이기'}
          >
            {state.isVisible ? (
              <EyeSlashIcon className="w-5 h-5 text-white" />
            ) : (
              <EyeIcon className="w-5 h-5 text-white" />
            )}
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-1 rounded-md hover:bg-white/10 transition-colors"
            title="가사 설정"
          >
            <AdjustmentsHorizontalIcon className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* 설정 패널 */}
      {showSettings && (
        <div className="mb-4 p-4 bg-white/10 backdrop-blur-sm rounded-lg">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white">자동 스크롤</span>
              <input
                type="checkbox"
                checked={state.settings.autoScroll}
                onChange={(e) => updateSettings({ autoScroll: e.target.checked })}
                className="w-4 h-4 text-moonwave-400 bg-gray-700 border-gray-600 rounded focus:ring-moonwave-400"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white">번역 표시</span>
              <input
                type="checkbox"
                checked={state.settings.showTranslation}
                onChange={(e) => updateSettings({ showTranslation: e.target.checked })}
                className="w-4 h-4 text-moonwave-400 bg-gray-700 border-gray-600 rounded focus:ring-moonwave-400"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white">폰트 크기</span>
              <select
                value={state.settings.fontSize}
                onChange={(e) => updateSettings({ fontSize: e.target.value as any })}
                className="px-2 py-1 text-sm bg-gray-700 border border-gray-600 rounded text-white"
              >
                <option value="small">작게</option>
                <option value="medium">보통</option>
                <option value="large">크게</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white">싱크 조정</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => adjustSyncOffset(-0.5)}
                  className="p-1 rounded-md hover:bg-white/10 transition-colors"
                  title="0.5초 앞으로"
                >
                  <ChevronUpIcon className="w-4 h-4 text-white" />
                </button>
                <span className="text-sm text-white min-w-[3rem] text-center">
                  {state.settings.syncOffset.toFixed(1)}s
                </span>
                <button
                  onClick={() => adjustSyncOffset(0.5)}
                  className="p-1 rounded-md hover:bg-white/10 transition-colors"
                  title="0.5초 뒤로"
                >
                  <ChevronDownIcon className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 가사 컨테이너 */}
      {state.isVisible && (
        <div 
          ref={containerRef}
          className={`max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent ${fontSizeClasses[state.settings.fontSize]}`}
        >
          <div className="space-y-6 py-4">
            {track.lyrics.map((line, index) => {
              const isActive = index === state.currentLineIndex;
              const isNext = index === state.currentLineIndex + 1;
              const progress = isActive ? getProgressInCurrentLine() : 0;

              return (
                <div
                  key={line.id}
                  ref={isActive ? activeLineRef : null}
                  className={`transition-all duration-300 ${
                    isActive
                      ? 'text-moonwave-400 font-medium'
                      : isNext
                      ? 'text-gray-300'
                      : 'text-gray-400'
                  }`}
                >
                  <div className="text-center leading-relaxed">
                    <p className="mb-1">{line.text}</p>
                    {state.settings.showTranslation && line.translation && (
                      <p className="text-sm opacity-70">{line.translation}</p>
                    )}
                  </div>
                  
                  {/* 진행률 표시 (현재 라인에만) */}
                  {isActive && (
                    <div className="mt-2 w-full bg-gray-700 rounded-full h-1">
                      <div
                        className="bg-moonwave-400 h-1 rounded-full transition-all duration-100"
                        style={{ width: `${progress * 100}%` }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 현재 라인 정보 */}
      {currentLine && (
        <div className="mt-4 p-3 bg-white/5 backdrop-blur-sm rounded-lg">
          <div className="text-sm text-gray-300">
            <span>현재: {currentLine.text}</span>
            {nextLine && (
              <span className="ml-4 text-gray-400">
                다음: {nextLine.text}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};