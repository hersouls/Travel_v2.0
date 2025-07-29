import React, { useEffect, useState } from 'react';
import { TrackCard } from '@/components/player/TrackCard';
import { Track } from '@/types';

export const TracksPage: React.FC = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTracks = async () => {
      try {
        const response = await fetch('/sample-tracks.json');
        const data = await response.json();
        setTracks(data.tracks);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load tracks:', error);
        setIsLoading(false);
      }
    };

    loadTracks();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-moonwave-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-300">트랙을 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 헤더 */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">오안나의 음악</h1>
        <p className="text-gray-300 text-lg">
          13곡의 특별한 음악 여정을 경험해보세요
        </p>
      </div>

      {/* 트랙 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {tracks.map((track) => (
          <TrackCard
            key={track.id}
            track={track}
          />
        ))}
      </div>
    </div>
  );
};