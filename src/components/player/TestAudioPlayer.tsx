import React from 'react';
import { useIntegratedPlayer } from '@/hooks/useIntegratedPlayer';
import { useTrackData } from '@/hooks/useTrackData';
import { formatTime } from '@/utils/audioUtils';

export const TestAudioPlayer: React.FC = () => {
  const player = useIntegratedPlayer();
  const trackData = useTrackData();

  const handlePlayTrack = (trackId: string) => {
    const track = trackData.getTrackById(trackId);
    if (track) {
      player.playTrack(track);
    }
  };

  const handleSetPlaylist = () => {
    if (trackData.tracks.length > 0) {
      player.setPlaylist(trackData.tracks);
    }
  };

  if (trackData.isLoading) {
    return (
      <div className="p-4 bg-gray-800 rounded-lg">
        <div className="text-white">트랙 데이터 로딩 중...</div>
      </div>
    );
  }

  if (trackData.error) {
    return (
      <div className="p-4 bg-red-900 rounded-lg">
        <div className="text-white">오류: {trackData.error}</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-800 rounded-lg space-y-4">
      <h2 className="text-xl font-bold text-white mb-4">오디오 플레이어 테스트</h2>
      
      {/* 현재 재생 상태 */}
      <div className="bg-gray-700 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-2">현재 상태</h3>
        <div className="text-gray-300 space-y-1">
          <div>재생 중: {player.isPlaying ? '예' : '아니오'}</div>
          <div>현재 트랙: {player.currentTrack?.title || '없음'}</div>
          <div>현재 시간: {formatTime(player.currentTime)}</div>
          <div>총 시간: {formatTime(player.duration)}</div>
          <div>볼륨: {Math.round(player.volume * 100)}%</div>
          <div>음소거: {'아니오'}</div>
          <div>반복 모드: {player.repeatMode}</div>
          <div>셔플: {player.isShuffled ? '켜짐' : '꺼짐'}</div>
        </div>
      </div>

      {/* 오디오 엘리먼트 */}
      <audio ref={player.audioRef} />

      {/* 컨트롤 버튼들 */}
      <div className="bg-gray-700 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-2">컨트롤</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={player.togglePlay}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {player.isPlaying ? '정지' : '재생'}
          </button>
          <button
            onClick={player.playNext}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            다음
          </button>
          <button
            onClick={player.playPrevious}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            이전
          </button>
          <button
            onClick={() => {}}
            className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
          >
            음소거 (비활성화)
          </button>
          <button
            onClick={player.cycleRepeatMode}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            반복: {player.repeatMode}
          </button>
          <button
            onClick={player.toggleShuffle}
            className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
          >
            셔플: {player.isShuffled ? '켜짐' : '꺼짐'}
          </button>
        </div>
      </div>

      {/* 볼륨 조절 */}
      <div className="bg-gray-700 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-2">볼륨</h3>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={player.volume}
          onChange={(e) => player.setVolume(parseFloat(e.target.value))}
          className="w-full"
        />
        <div className="text-gray-300 mt-1">{Math.round(player.volume * 100)}%</div>
      </div>

      {/* 진행바 */}
      <div className="bg-gray-700 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-2">진행</h3>
        <input
          type="range"
          min="0"
          max={player.duration || 0}
          step="1"
          value={player.currentTime}
          onChange={(e) => player.seekTo(parseFloat(e.target.value))}
          className="w-full"
        />
        <div className="text-gray-300 mt-1">
          {formatTime(player.currentTime)} / {formatTime(player.duration)}
        </div>
      </div>

      {/* 플레이리스트 설정 */}
      <div className="bg-gray-700 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-2">플레이리스트</h3>
        <button
          onClick={handleSetPlaylist}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          전체 플레이리스트 설정
        </button>
      </div>

      {/* 트랙 목록 */}
      <div className="bg-gray-700 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-2">트랙 목록</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {trackData.tracks.map((track) => (
            <div
              key={track.id}
              className={`p-2 rounded cursor-pointer transition-colors ${
                player.currentTrack?.id === track.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
              }`}
              onClick={() => handlePlayTrack(track.id)}
            >
              <div className="font-medium">{track.title}</div>
              <div className="text-sm opacity-75">{track.artist}</div>
              {track.duration && (
                <div className="text-xs opacity-50">{formatTime(track.duration)}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 오류 표시 */}
      {player.error && (
        <div className="bg-red-900 p-4 rounded-lg">
          <div className="text-white">오류: {player.error}</div>
        </div>
      )}
    </div>
  );
};