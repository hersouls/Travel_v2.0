import React, { useState, useCallback } from 'react';
import { SyncLine } from '@/types';
import { 
  PlayIcon, 
  PauseIcon, 
  ForwardIcon, 
  BackwardIcon,
  ClockIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface LyricsTimingAdjusterProps {
  syncLines: SyncLine[];
  currentTime: number;
  onTimeChange: (time: number) => void;
  onSyncLinesUpdate: (updatedLines: SyncLine[]) => void;
  className?: string;
}

export const LyricsTimingAdjuster: React.FC<LyricsTimingAdjusterProps> = ({
  syncLines,
  currentTime,
  onTimeChange,
  onSyncLinesUpdate,
  className = '',
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedLineIndex, setSelectedLineIndex] = useState(-1);
  const [editTime, setEditTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // 현재 라인 찾기
  const findCurrentLineIndex = useCallback((time: number): number => {
    for (let i = 0; i < syncLines.length; i++) {
      const line = syncLines[i];
      const nextLine = syncLines[i + 1];
      
      if (!line) continue;
      const lineStartTime = line.startTime || line.time;
      const lineEndTime = line.endTime || (nextLine ? (nextLine.startTime || nextLine.time) : Infinity);
      
      if (time >= lineStartTime && time < lineEndTime) {
        return i;
      }
    }
    return -1;
  }, [syncLines]);

  const currentLineIndex = findCurrentLineIndex(currentTime);

  // 재생/정지 토글
  const togglePlayback = useCallback(() => {
    setIsPlaying(!isPlaying);
    // 실제 오디오 재생/정지는 부모 컴포넌트에서 처리
  }, [isPlaying]);

  // 시간 이동
  const seekToTime = useCallback((time: number) => {
    onTimeChange(time);
  }, [onTimeChange]);

  // 이전/다음 라인으로 이동
  const navigateToLine = useCallback((direction: 'prev' | 'next') => {
    if (currentLineIndex === -1) return;
    
    const targetIndex = direction === 'prev' 
      ? Math.max(0, currentLineIndex - 1)
      : Math.min(syncLines.length - 1, currentLineIndex + 1);
    
    const targetLine = syncLines[targetIndex];
    if (targetLine) {
      seekToTime(targetLine.startTime || targetLine.time);
    }
  }, [currentLineIndex, syncLines, seekToTime]);

  // 라인 편집 시작
  const startEditing = useCallback((lineIndex: number) => {
    setSelectedLineIndex(lineIndex);
    setEditTime(syncLines[lineIndex]?.startTime || syncLines[lineIndex]?.time || 0);
    setIsEditing(true);
  }, [syncLines]);

  // 라인 편집 완료
  const finishEditing = useCallback(() => {
    if (selectedLineIndex >= 0 && selectedLineIndex < syncLines.length) {
      const updatedLines = [...syncLines];
              const existingLine = updatedLines[selectedLineIndex];
        if (existingLine) {
          updatedLines[selectedLineIndex] = {
            ...existingLine,
            time: editTime,
            startTime: editTime,
            endTime: selectedLineIndex < syncLines.length - 1 
              ? (syncLines[selectedLineIndex + 1]?.startTime || syncLines[selectedLineIndex + 1]?.time || 0)
              : editTime + 5, // 기본 5초
          };
        }
      
      onSyncLinesUpdate(updatedLines);
    }
    
    setIsEditing(false);
    setSelectedLineIndex(-1);
  }, [selectedLineIndex, syncLines, editTime, onSyncLinesUpdate]);

  // 편집 취소
  const cancelEditing = useCallback(() => {
    setIsEditing(false);
    setSelectedLineIndex(-1);
  }, []);

  // 전체 타이밍 조정 (모든 라인을 일정 시간만큼 이동)
  const adjustAllTimings = useCallback((offset: number) => {
    const updatedLines = syncLines.map(line => ({
      ...line,
      time: Math.max(0, ((line?.time || line?.startTime) || 0) + offset),
      startTime: Math.max(0, (line.startTime || line.time) + offset),
      endTime: Math.max(0, (line.endTime || 0) + offset),
    }));
    
    onSyncLinesUpdate(updatedLines);
  }, [syncLines, onSyncLinesUpdate]);

  return (
    <div className={`bg-white/10 backdrop-blur-sm rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-white">가사 타이밍 조정</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={togglePlayback}
            className="p-2 rounded-md hover:bg-white/10 transition-colors"
            title={isPlaying ? '정지' : '재생'}
          >
            {isPlaying ? (
              <PauseIcon className="w-5 h-5 text-white" />
            ) : (
              <PlayIcon className="w-5 h-5 text-white" />
            )}
          </button>
          <button
            onClick={() => navigateToLine('prev')}
            className="p-2 rounded-md hover:bg-white/10 transition-colors"
            title="이전 라인"
          >
            <BackwardIcon className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={() => navigateToLine('next')}
            className="p-2 rounded-md hover:bg-white/10 transition-colors"
            title="다음 라인"
          >
            <ForwardIcon className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* 전체 타이밍 조정 */}
      <div className="mb-4 p-3 bg-white/5 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-white">전체 타이밍 조정</span>
          <ClockIcon className="w-4 h-4 text-gray-400" />
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => adjustAllTimings(-1)}
            className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded transition-colors"
          >
            -1초
          </button>
          <button
            onClick={() => adjustAllTimings(-0.5)}
            className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded transition-colors"
          >
            -0.5초
          </button>
          <button
            onClick={() => adjustAllTimings(0.5)}
            className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded transition-colors"
          >
            +0.5초
          </button>
          <button
            onClick={() => adjustAllTimings(1)}
            className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded transition-colors"
          >
            +1초
          </button>
        </div>
      </div>

      {/* 라인별 타이밍 조정 */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {syncLines.map((line, index) => {
          const isCurrent = index === currentLineIndex;
          const isSelected = index === selectedLineIndex;
          
          return (
            <div
              key={line.id}
              className={`p-3 rounded-lg transition-all ${
                isCurrent
                  ? 'bg-moonwave-400/20 border border-moonwave-400'
                  : isSelected
                  ? 'bg-white/20 border border-white'
                  : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className={`text-sm ${isCurrent ? 'text-moonwave-400 font-medium' : 'text-white'}`}>
                    {line.text}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {(line.startTime || line.time || 0).toFixed(2)}s - {(line.endTime || 0).toFixed(2)}s
                  </p>
                </div>
                
                {isEditing && isSelected ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={editTime}
                      onChange={(e) => setEditTime(parseFloat(e.target.value) || 0)}
                      step="0.1"
                      className="w-20 px-2 py-1 text-sm bg-gray-700 border border-gray-600 rounded text-white"
                    />
                    <button
                      onClick={finishEditing}
                      className="p-1 text-green-400 hover:text-green-300"
                      title="확인"
                    >
                      <CheckIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="p-1 text-red-400 hover:text-red-300"
                      title="취소"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => startEditing(index)}
                    className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                  >
                    편집
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 현재 시간 표시 */}
      <div className="mt-4 p-2 bg-white/5 rounded-lg">
        <div className="text-center">
          <p className="text-sm text-gray-400">현재 시간</p>
          <p className="text-lg font-mono text-white">
            {currentTime.toFixed(2)}s
          </p>
        </div>
      </div>
    </div>
  );
};