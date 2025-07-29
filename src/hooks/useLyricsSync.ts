import { useState, useEffect, useCallback, useRef } from 'react';
import { SyncLine, LyricsSyncSettings, LyricsSyncState } from '@/types';

interface UseLyricsSyncProps {
  syncLines: SyncLine[];
  currentTime: number;
  settings?: Partial<LyricsSyncSettings>;
}

const defaultSettings: LyricsSyncSettings = {
  autoScroll: true,
  highlightCurrent: true,
  showTranslation: false,
  syncOffset: 0,
  fontSize: 'medium',
  theme: 'auto',
};

export const useLyricsSync = ({
  syncLines,
  currentTime,
  settings = {},
}: UseLyricsSyncProps) => {
  const [state, setState] = useState<LyricsSyncState>({
    currentLineIndex: -1,
    isVisible: false,
    settings: { ...defaultSettings, ...settings },
    error: null,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const activeLineRef = useRef<HTMLDivElement>(null);

  // 현재 시간에 해당하는 가사 라인 찾기
  const findCurrentLine = useCallback((time: number): number => {
    if (!syncLines || syncLines.length === 0) return -1;

    const adjustedTime = time + state.settings.syncOffset;

    for (let i = 0; i < syncLines.length; i++) {
      const line = syncLines[i];
      const nextLine = syncLines[i + 1];

      if (adjustedTime >= line.startTime && 
          (!nextLine || adjustedTime < nextLine.endTime)) {
        return i;
      }
    }

    return -1;
  }, [syncLines, state.settings.syncOffset]);

  // 현재 라인 업데이트
  useEffect(() => {
    const newCurrentLineIndex = findCurrentLine(currentTime);
    
    if (newCurrentLineIndex !== state.currentLineIndex) {
      setState(prev => ({
        ...prev,
        currentLineIndex: newCurrentLineIndex,
      }));
    }
  }, [currentTime, findCurrentLine, state.currentLineIndex]);

  // 자동 스크롤 기능
  const scrollToActiveLine = useCallback(() => {
    if (!state.settings.autoScroll || !activeLineRef.current) return;

    activeLineRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest',
    });
  }, [state.settings.autoScroll]);

  useEffect(() => {
    if (state.currentLineIndex >= 0) {
      scrollToActiveLine();
    }
  }, [state.currentLineIndex, scrollToActiveLine]);

  // 가사 타이밍 조정 기능
  const adjustSyncOffset = useCallback((offset: number) => {
    setState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        syncOffset: prev.settings.syncOffset + offset,
      },
    }));
  }, []);

  // 설정 업데이트
  const updateSettings = useCallback((newSettings: Partial<LyricsSyncSettings>) => {
    setState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...newSettings,
      },
    }));
  }, []);

  // 가사 표시/숨김 토글
  const toggleVisibility = useCallback(() => {
    setState(prev => ({
      ...prev,
      isVisible: !prev.isVisible,
    }));
  }, []);

  // 현재 라인 정보
  const currentLine = state.currentLineIndex >= 0 
    ? syncLines[state.currentLineIndex] 
    : null;

  // 다음 라인 정보
  const nextLine = state.currentLineIndex >= 0 && state.currentLineIndex < syncLines.length - 1
    ? syncLines[state.currentLineIndex + 1]
    : null;

  // 진행률 계산 (현재 라인 내에서의 진행률)
  const getProgressInCurrentLine = useCallback(() => {
    if (!currentLine || !nextLine) return 0;

    const lineDuration = nextLine.startTime - currentLine.startTime;
    const elapsedInLine = currentTime - currentLine.startTime;
    
    return Math.max(0, Math.min(1, elapsedInLine / lineDuration));
  }, [currentLine, nextLine, currentTime]);

  return {
    state,
    currentLine,
    nextLine,
    containerRef,
    activeLineRef,
    adjustSyncOffset,
    updateSettings,
    toggleVisibility,
    getProgressInCurrentLine,
    findCurrentLine,
  };
};