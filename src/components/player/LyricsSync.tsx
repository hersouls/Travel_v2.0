import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/utils/cn';

interface SyncLine {
  time: number;
  text: string;
}

interface LyricsSyncProps {
  lyrics: SyncLine[];
  currentTime: number;
  className?: string;
}

export const LyricsSync: React.FC<LyricsSyncProps> = ({
  lyrics,
  currentTime,
  className
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 현재 시간에 맞는 가사 인덱스 찾기
    let newIndex = 0;
    for (let i = 0; i < lyrics.length; i++) {
      if (currentTime >= (lyrics[i]?.time || 0)) {
        newIndex = i;
      } else {
        break;
      }
    }

    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  }, [currentTime, lyrics, activeIndex]);

  useEffect(() => {
    // 활성 라인을 뷰포트 중앙으로 스크롤
    if (activeLineRef.current && containerRef.current) {
      const container = containerRef.current;
      const activeLine = activeLineRef.current;
      
      const containerHeight = container.clientHeight;
      const activeLineTop = activeLine.offsetTop;
      const activeLineHeight = activeLine.clientHeight;
      
      const scrollTop = activeLineTop - (containerHeight / 2) + (activeLineHeight / 2);
      
      container.scrollTo({
        top: scrollTop,
        behavior: 'smooth'
      });
    }
  }, [activeIndex]);

  if (!lyrics || lyrics.length === 0) {
    return (
      <div className={cn("text-center text-gray-400 py-8", className)}>
        가사가 없습니다.
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "h-64 overflow-y-auto scrollbar-hide",
        "flex flex-col gap-2 py-4",
        className
      )}
    >
      {lyrics.map((line, index) => (
        <div
          key={index}
          ref={index === activeIndex ? activeLineRef : null}
          className={cn(
            "px-4 py-2 rounded-lg transition-all duration-300",
            "text-center text-sm leading-relaxed",
            index === activeIndex
              ? "bg-white/20 text-white font-medium scale-105"
              : "text-gray-300 hover:text-white/80"
          )}
        >
          {line.text}
        </div>
      ))}
    </div>
  );
};