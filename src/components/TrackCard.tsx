import { FC } from 'react';
import { Play, Pause } from 'lucide-react';
import { cn } from './ui/utils';
import { WaveButton } from './WaveButton';
import { GlassCard } from './GlassCard';

interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  audioUrl: string;
  coverUrl?: string;
}

interface TrackCardProps {
  track: MusicTrack;
  isPlaying: boolean;
  isCurrentTrack: boolean;
  onPlay: (track: MusicTrack) => void;
  onPause: () => void;
}

export const TrackCard: FC<TrackCardProps> = ({ 
  track, 
  isPlaying, 
  isCurrentTrack, 
  onPlay, 
  onPause 
}) => {
  // 시간 포맷팅 함수
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (isCurrentTrack && isPlaying) {
      onPause();
    } else {
      onPlay(track);
    }
  };

  return (
    <GlassCard 
      variant="light" 
      className={cn(
        "p-4 transition-all duration-300 hover:bg-white/10",
        isCurrentTrack && "ring-2 ring-primary-400/50 bg-primary-500/10"
      )}
    >
      <div className="flex items-center justify-between">
        {/* Track Info */}
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          {/* Play/Pause Button */}
          <WaveButton
            variant="ghost"
            size="sm"
            onClick={handlePlayPause}
            className={cn(
              "wave-button-ghost-enhanced p-2 rounded-full",
              isCurrentTrack && isPlaying && "text-primary-400"
            )}
          >
            {isCurrentTrack && isPlaying ? (
              <Pause size={16} className="icon-enhanced" />
            ) : (
              <Play size={16} className="icon-enhanced" />
            )}
          </WaveButton>

          {/* Track Details */}
          <div className="min-w-0 flex-1">
            <h4 className={cn(
              "text-sm font-medium truncate break-keep-ko",
              isCurrentTrack ? "text-primary-300" : "text-white-force"
            )}>
              {track.title}
            </h4>
            <p className="text-xs text-white-force/60 truncate break-keep-ko">
              {track.artist}
            </p>
          </div>
        </div>

        {/* Duration */}
        <div className="text-xs text-white-force/60 ml-4">
          {formatTime(track.duration)}
        </div>
      </div>
    </GlassCard>
  );
};
