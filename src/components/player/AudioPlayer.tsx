import React from 'react';
import { PlayerControls } from './PlayerControls';
import { ProgressBar } from './ProgressBar';
import { VolumeControl } from './VolumeControl';
import { TrackInfo } from './TrackInfo';
import { Track } from '@/types';

interface AudioPlayerProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  repeatMode: 'none' | 'one' | 'all';
  isShuffled: boolean;
  currentTrack?: Track;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  onToggleRepeat: () => void;
  onToggleShuffle: () => void;
  onDownload?: (track: { title: string; artist: string }) => void;
  className?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  isPlaying,
  currentTime,
  duration,
  volume,
  repeatMode,
  isShuffled,
  currentTrack,
  onTogglePlay,
  onSeek,
  onVolumeChange,
  onPrevious,
  onNext,
  onToggleRepeat,
  onToggleShuffle,
  onDownload,
  className,
}) => {

  if (!currentTrack) {
    return null;
  }

  return (
    <div className={`bg-black/20 backdrop-blur-md border border-white/10 rounded-lg p-4 ${className}`}>
      {/* 트랙 정보 */}
      <TrackInfo track={currentTrack} />

      {/* 진행바 */}
      <ProgressBar
        currentTime={currentTime}
        duration={duration}
        onSeek={onSeek}
        className="my-4"
      />

      {/* 컨트롤 */}
      <div className="flex items-center justify-between">
        {/* 볼륨 컨트롤 */}
        <VolumeControl
          volume={volume}
          onVolumeChange={onVolumeChange}
        />

        {/* 플레이어 컨트롤 */}
        <PlayerControls
          isPlaying={isPlaying}
          onTogglePlay={onTogglePlay}
          onPrevious={onPrevious}
          onNext={onNext}
          onToggleShuffle={onToggleShuffle}
          onCycleRepeat={onToggleRepeat}
                      onDownload={onDownload || undefined}
          isShuffled={isShuffled}
          repeatMode={repeatMode}
          isLoading={false}
          currentTrack={currentTrack}
        />
      </div>
    </div>
  );
};