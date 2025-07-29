import React from 'react';
import { PlayIcon, PauseIcon } from '@heroicons/react/24/solid';
import { Card } from '@/components/ui/Card';
import { Typography } from '@/components/ui/Typography';
import { Track } from '@/types';

interface TrackCardProps {
  track: Track;
  isPlaying?: boolean;
  isCurrentTrack?: boolean;
  onPlay?: (track: Track) => void;
  onPause?: () => void;
  className?: string;
}

export const TrackCard: React.FC<TrackCardProps> = ({
  track,
  isPlaying = false,
  isCurrentTrack = false,
  onPlay,
  onPause,
  className
}) => {
  const handlePlayPause = () => {
    if (isPlaying) {
      onPause?.();
    } else {
      onPlay?.(track);
    }
  };

  return (
    <Card
      className={`relative overflow-hidden group ${className} ${
        isCurrentTrack ? 'ring-2 ring-moonwave-500' : ''
      }`}
    >
      <div className="relative aspect-square">
        <img
          src={track.coverUrl}
          alt={track.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* 오버레이 */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300" />
        
        {/* 재생 버튼 */}
        <button
          onClick={handlePlayPause}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <div className="w-16 h-16 rounded-full bg-moonwave-500 hover:bg-moonwave-600 flex items-center justify-center transition-colors">
            {isPlaying ? (
              <PauseIcon className="w-8 h-8 text-white" />
            ) : (
              <PlayIcon className="w-8 h-8 text-white ml-1" />
            )}
          </div>
        </button>

        {/* 현재 재생 중 표시 */}
        {isCurrentTrack && (
          <div className="absolute top-2 right-2 w-3 h-3 bg-moonwave-500 rounded-full animate-pulse" />
        )}
      </div>

      <div className="p-4">
        <Typography variant="h6" className="text-white font-semibold mb-1 truncate">
          {track.title}
        </Typography>
        
        <Typography variant="caption" className="text-gray-300 mb-2">
          {track.artist}
        </Typography>

        {track.description && (
          <Typography variant="caption" className="text-gray-400 line-clamp-2">
            {track.description}
          </Typography>
        )}
      </div>
    </Card>
  );
};