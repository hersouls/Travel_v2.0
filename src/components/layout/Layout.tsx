import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { AudioPlayer } from '@/components/player/AudioPlayer';
import { Track } from '@/types';

interface LayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  showPlayer?: boolean;
  playerState?: {
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    volume: number;
    repeatMode: 'none' | 'one' | 'all';
    isShuffled: boolean;
    currentTrack?: Track;
  };
  playerHandlers?: {
    onTogglePlay: () => void;
    onSeek: (time: number) => void;
    onVolumeChange: (volume: number) => void;
    onPrevious: () => void;
    onNext: () => void;
    onToggleRepeat: () => void;
    onToggleShuffle: () => void;
    onDownload?: (track: { title: string; artist: string }) => void;
  };
  className?: string;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  showHeader = true,
  showFooter = true,
  showPlayer = false,
  playerState,
  playerHandlers,
  className
}) => {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-moonwave-900 via-moonwave-800 to-moonwave-900 ${className}`}>
      {showHeader && <Header />}
      
      <main className={`${showHeader ? 'pt-20' : ''} ${showPlayer ? 'pb-32' : ''} min-h-screen`}>
        {children}
      </main>

      {/* 고정 플레이어 */}
      {showPlayer && playerState && playerHandlers && playerState.currentTrack && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-black/20 backdrop-blur-md border-t border-white/10">
          <AudioPlayer
            isPlaying={playerState.isPlaying}
            currentTime={playerState.currentTime}
            duration={playerState.duration}
            volume={playerState.volume}
            repeatMode={playerState.repeatMode}
            isShuffled={playerState.isShuffled}
            currentTrack={playerState.currentTrack}
            onTogglePlay={playerHandlers.onTogglePlay}
            onSeek={playerHandlers.onSeek}
            onVolumeChange={playerHandlers.onVolumeChange}
            onPrevious={playerHandlers.onPrevious}
            onNext={playerHandlers.onNext}
            onToggleRepeat={playerHandlers.onToggleRepeat}
            onToggleShuffle={playerHandlers.onToggleShuffle}
            onDownload={playerHandlers.onDownload || undefined}
            className="p-4"
          />
        </div>
      )}

      {showFooter && <Footer />}
    </div>
  );
};