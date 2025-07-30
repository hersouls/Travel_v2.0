import React, { useState } from 'react';
import { Play, Pause } from 'lucide-react';
import { Track } from '../types';
import { GlassCard } from './GlassCard';
import { WaveButton } from './WaveButton';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { getPhaseColors, getPhaseGlassBackground } from '../utils/colors';
import { cn } from './ui/utils';

interface TrackCardProps {
  track: Track;
  isPlaying: boolean;
  isCurrent: boolean;
  onPlay: (track: Track) => void;
  onSelect: (track: Track) => void;
}

export const TrackCard: React.FC<TrackCardProps> = ({
  track,
  isPlaying,
  isCurrent,
  onPlay,
  onSelect,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Use the new color system
  const phaseColors = getPhaseColors(track.theme);

  // 재생 버튼 클릭 핸들러 - 하단 뮤직플레이어를 통해서만 재생
  const handlePlayClick = () => {
    onPlay(track);
  };

  // 카드 클릭 핸들러
  const handleCardClick = (e: React.MouseEvent) => {
    // 재생 버튼 클릭이 아닌 경우에만 카드 선택
    if (!(e.target as HTMLElement).closest('button')) {
      onSelect(track);
    }
  };

  return (
    <div 
      className={cn(
        'relative group cursor-pointer transition-all duration-300',
        isCurrent && `ring-2 ${phaseColors.border} shadow-2xl`
      )}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <GlassCard 
        variant="default"
        withWaveEffect={isCurrent}
        className={cn(
          'overflow-hidden p-0 hover:scale-105',
          getPhaseGlassBackground(track.theme)
        )}
      >
        {/* Cover Image */}
        <div className="aspect-square relative overflow-hidden">
          <ImageWithFallback
            src={track.coverUrl}
            alt={`${track.title} 커버`}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Gradient Overlay with phase color */}
          <div className={cn(
            'absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent',
            'group-hover:from-black/70'
          )} />
          
          {/* Play Button Overlay */}
          <div className={cn(
            'absolute inset-0 flex items-center justify-center',
            'transition-opacity duration-300',
            isHovered || isCurrent ? 'opacity-100' : 'opacity-0'
          )}>
            <WaveButton
              onClick={handlePlayClick}
              variant="primary"
              size="lg"
              ariaLabel={isPlaying && isCurrent ? '일시정지' : '재생'}
              className="w-16 h-16 rounded-full p-0 shadow-2xl"
            >
              {isPlaying && isCurrent ? (
                <Pause className="w-8 h-8" />
              ) : (
                <Play className="w-8 h-8 ml-1" />
              )}
            </WaveButton>
          </div>
          
          {/* Track Number Badge with phase color */}
          <div className="absolute top-3 left-3">
            <div 
              className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-full px-3 py-1 text-xs text-white font-semibold"
              style={{ backgroundColor: `${phaseColors.text}20` }}
            >
              {track.trackNumber}
            </div>
          </div>
          
          {/* Playing Indicator with phase color */}
          {isPlaying && isCurrent && (
            <div className="absolute top-3 right-3">
              <div 
                className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-full px-3 py-1 text-xs text-white font-semibold wave-pulse"
                style={{ backgroundColor: `${phaseColors.text}30` }}
              >
                재생 중
              </div>
            </div>
          )}
          
          {/* Current Track Indicator */}
          {isCurrent && !isPlaying && (
            <div className="absolute top-3 right-3">
              <div 
                className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-full px-3 py-1 text-xs text-white font-semibold"
                style={{ backgroundColor: `${phaseColors.text}20` }}
              >
                선택됨
              </div>
            </div>
          )}
        </div>

        {/* Track Info */}
        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-white/70">
            <span 
              className="capitalize font-medium px-2 py-1 rounded-md"
              style={{ 
                backgroundColor: `${phaseColors.text}20`,
                color: phaseColors.text
              }}
            >
              {track.theme} Phase
            </span>
            <span>{track.duration}</span>
          </div>
          
          <h3 className="font-semibold text-white text-lg line-clamp-1 break-keep-ko">
            {track.title}
          </h3>
          
          <p className="text-white/80 text-sm break-keep-ko">
            {track.artist}
          </p>
          
          {/* Theme Description */}
          <div className="pt-2">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-2">
              <p className="text-white/60 text-xs break-keep-ko line-clamp-2">
                {track.lyricsInterpretation?.slice(0, 150)}...
              </p>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};