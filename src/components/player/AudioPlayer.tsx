import React, { useRef, useEffect, useState } from 'react';
import { PlayIcon, PauseIcon } from '@heroicons/react/24/solid';
import { formatTime } from '@/utils/audio';
import { Track } from '@/types';

interface AudioPlayerProps {
  track: Track;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onPlay: () => void;
  onPause: () => void;
  onTimeUpdate: (time: number) => void;
  onEnded: () => void;
  className?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  track,
  isPlaying,
  currentTime,
  duration,
  onPlay,
  onPause,
  onTimeUpdate,
  onEnded,
  className
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = track.audioUrl;
    }
  }, [track.audioUrl]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const handlePlayPause = () => {
    if (isPlaying) {
      onPause();
    } else {
      onPlay();
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      onTimeUpdate(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      onTimeUpdate(audioRef.current.currentTime);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      onTimeUpdate(newTime);
    }
  };

  const handleLoadStart = () => setIsLoading(true);
  const handleCanPlay = () => setIsLoading(false);
  const handleError = () => setIsLoading(false);

  return (
    <div className={`flex items-center space-x-4 p-4 bg-glass-primary rounded-xl backdrop-blur-sm ${className}`}>
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={onEnded}
        onLoadStart={handleLoadStart}
        onCanPlay={handleCanPlay}
        onError={handleError}
      />
      
      <button
        onClick={handlePlayPause}
        disabled={isLoading}
        className="flex items-center justify-center w-12 h-12 rounded-full bg-moonwave-500 hover:bg-moonwave-600 transition-colors disabled:opacity-50"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : isPlaying ? (
          <PauseIcon className="w-6 h-6 text-white" />
        ) : (
          <PlayIcon className="w-6 h-6 text-white ml-0.5" />
        )}
      </button>

      <div className="flex-1">
        <div className="flex items-center justify-between text-sm text-white mb-2">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1 bg-glass-border rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #0ea5e9 0%, #0ea5e9 ${(currentTime / duration) * 100}%, rgba(255, 255, 255, 0.2) ${(currentTime / duration) * 100}%, rgba(255, 255, 255, 0.2) 100%)`
          }}
        />
      </div>
    </div>
  );
};