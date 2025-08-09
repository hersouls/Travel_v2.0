import { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { WaveButton } from './WaveButton';
import { GlassCard } from './GlassCard';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts';

interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  audioUrl: string;
  coverUrl?: string;
}

interface MusicPlayerProps {
  className?: string;
}

// 뮤직플레이어 메인 컴포넌트
export function MusicPlayer({ className }: MusicPlayerProps) {
  const { user } = useAuth();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // 상태 관리
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasAutoPlayed, setHasAutoPlayed] = useState(false);
  const [shouldAutoPlayNext, setShouldAutoPlayNext] = useState(false);

  // 트랙 목록
  const tracks: MusicTrack[] = [
    {
      id: '1',
      title: 'Glass Vault',
      artist: 'Moonwave',
      duration: 240,
      audioUrl: '/Music/10. Glass Vault.mp3'
    },
    {
      id: '2',
      title: 'Null Error Grace Part1',
      artist: 'Moonwave',
      duration: 216,
      audioUrl: '/Music/11. Null Error Grace Part1.mp3'
    },
    {
      id: '3',
      title: 'Null Error Grace Part2',
      artist: 'Moonwave',
      duration: 174,
      audioUrl: '/Music/12. Null Error Grace Part2.mp3'
    },
    {
      id: '4',
      title: 'Shine Bright',
      artist: 'Moonwave',
      duration: 198,
      audioUrl: '/Music/13. Shine Bright.mp3'
    },
    {
      id: '5',
      title: "It's my Moonwave life",
      artist: 'Moonwave',
      duration: 228,
      audioUrl: "/Music/14. It's my Moonwave life.mp3"
    },
    {
      id: '6',
      title: 'Ride My Wave',
      artist: 'Moonwave',
      duration: 294,
      audioUrl: '/Music/15. Ride My Wave.mp3'
    },
    {
      id: '7',
      title: 'Glow Not Noise',
      artist: 'Moonwave',
      duration: 258,
      audioUrl: '/Music/16. Glow Not Noise.mp3'
    },
    {
      id: '8',
      title: 'Moonwave',
      artist: 'Moonwave',
      duration: 300,
      audioUrl: '/Music/17. Moonwave.mp3'
    },
    {
      id: '9',
      title: 'Under the Moonlight',
      artist: 'Moonwave',
      duration: 204,
      audioUrl: '/Music/18. Under the Moonlight.mp3'
    },
    {
      id: '10',
      title: 'Decode me slow',
      artist: 'Moonwave',
      duration: 252,
      audioUrl: '/Music/19. Decode me slow.mp3'
    },
    {
      id: '11',
      title: 'Daily Jump',
      artist: 'Moonwave',
      duration: 180,
      audioUrl: '/Music/6. 매일의 점프.mp3'
    },
    {
      id: '12',
      title: 'Bloom Syntax',
      artist: 'Moonwave',
      duration: 210,
      audioUrl: '/Music/7. Bloom Syntax.mp3'
    }
  ];

  const currentTrack = tracks[currentTrackIndex];

  // 랜덤 트랙 선택 (현재 트랙과 다른 트랙)
  const playRandomTrack = () => {
    if (tracks.length <= 1) {
      // 트랙이 1개 이하면 그대로 유지
      return;
    }
    
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * tracks.length);
    } while (randomIndex === currentTrackIndex); // 현재 트랙과 다를 때까지 반복
    
    console.log(`🔀 랜덤 재생: ${tracks[randomIndex].title}`);
    setCurrentTrackIndex(randomIndex);
  };

  // 오디오 초기화 및 이벤트 설정
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;
    }

    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      // 다음 트랙 자동재생 플래그 설정
      setShouldAutoPlayNext(true);
      // 현재 트랙과 다른 랜덤 트랙 선택
      playRandomTrack();
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleCanPlay = () => {
      console.log('오디오 로드 완료');
    };

    const handleError = (e: Event) => {
      console.error('오디오 에러:', e);
      setIsPlaying(false);
    };

    // 이벤트 리스너 등록
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);

    // 첫 번째 트랙 로드
    if (currentTrack) {
      audio.src = currentTrack.audioUrl;
      audio.load();
    }

    // 정리 함수
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
    };
  }, [currentTrackIndex]);

  // 로그인 시 자동재생
  useEffect(() => {
    if (user && !hasAutoPlayed && audioRef.current && currentTrack) {
      // 랜덤 트랙 선택
      const randomIndex = Math.floor(Math.random() * tracks.length);
      setCurrentTrackIndex(randomIndex);
      setHasAutoPlayed(true);

      // 자동재생 시도 (브라우저 정책에 따라 실패할 수 있음)
      setTimeout(async () => {
        try {
          await audioRef.current?.play();
          console.log('자동재생 성공');
        } catch (error) {
          console.log('자동재생 실패 (브라우저 정책)');
        }
      }, 1000);
    }
  }, [user, hasAutoPlayed, tracks.length, currentTrack]);

  // 로그아웃 시 리셋
  useEffect(() => {
    if (!user) {
      setHasAutoPlayed(false);
    }
  }, [user]);

  // 트랙 변경 시 오디오 로드 및 자동재생
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      const wasPlaying = isPlaying;
      audioRef.current.src = currentTrack.audioUrl;
      audioRef.current.load();
      
      // 기존에 재생 중이었거나 자동재생 플래그가 설정되어 있으면 재생
      if (wasPlaying || shouldAutoPlayNext) {
        audioRef.current.play().catch(console.error);
        setShouldAutoPlayNext(false); // 플래그 리셋
      }
    }
  }, [currentTrackIndex, shouldAutoPlayNext]);

  // 시간 포맷팅
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // 재생/일시정지
  const togglePlay = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        await audioRef.current.play();
      }
    } catch (error) {
      console.error('재생 토글 실패:', error);
    }
  };

  // 이전 트랙
  const previousTrack = () => {
    const newIndex = currentTrackIndex > 0 
      ? currentTrackIndex - 1 
      : tracks.length - 1;
    setCurrentTrackIndex(newIndex);
  };

  // 다음 트랙
  const nextTrack = () => {
    const newIndex = currentTrackIndex < tracks.length - 1 
      ? currentTrackIndex + 1 
      : 0;
    setCurrentTrackIndex(newIndex);
  };


  // 음소거 토글
  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    if (audioRef.current) {
      audioRef.current.volume = newMuted ? 0 : volume;
    }
  };

  if (!currentTrack) {
    return null;
  }

  return (
    <div className={cn("w-full max-w-7xl mx-auto mt-6 mb-6", className)}>
      <GlassCard 
        variant="travel" 
        withWaveEffect={isPlaying}
        hoverable={false}
        className="px-4 sm:px-6 py-4 sm:py-5"
      >
        {/* Player Interface */}
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          {/* Track Info */}
          <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-white truncate">
                {currentTrack.title}
              </p>
              <p className="text-xs text-white/60 truncate hidden sm:block">
                {currentTrack.artist}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-1 sm:space-x-3 flex-shrink-0">
            {/* Previous Button */}
            <WaveButton
              variant="ghost"
              size="sm"
              onClick={previousTrack}
              ariaLabel="이전 트랙"
              className="p-1.5 sm:p-2 rounded-full transition-all duration-300 hidden sm:flex"
            >
              <SkipBack size={14} className="sm:w-4 sm:h-4" />
            </WaveButton>

            {/* Play/Pause Button */}
            <WaveButton
              variant="primary"
              size="sm"
              onClick={togglePlay}
              ariaLabel={isPlaying ? "일시정지" : "재생"}
              className={cn(
                "p-2.5 sm:p-4 rounded-full transition-all duration-300",
                "bg-gradient-to-r from-travel-blue to-travel-purple hover:from-travel-blue/80 hover:to-travel-purple/80",
                "shadow-lg hover:shadow-xl"
              )}
            >
              {isPlaying ? 
                <Pause size={18} className="sm:w-6 sm:h-6" /> : 
                <Play size={18} className="sm:w-6 sm:h-6 ml-0.5" />
              }
            </WaveButton>

            {/* Next Button */}
            <WaveButton
              variant="ghost"
              size="sm"
              onClick={nextTrack}
              ariaLabel="다음 트랙"
              className="p-1.5 sm:p-2 rounded-full transition-all duration-300 hidden sm:flex"
            >
              <SkipForward size={14} className="sm:w-4 sm:h-4" />
            </WaveButton>

            {/* Volume Control */}
            <div className="relative volume-control">
              <WaveButton
                variant="ghost"
                size="sm"
                onClick={toggleMute}
                ariaLabel={isMuted ? "음소거 해제" : "볼륨 조절"}
                className="p-1.5 sm:p-2 rounded-full transition-all duration-300"
              >
                {isMuted ? 
                  <VolumeX size={14} className="sm:w-4 sm:h-4" /> : 
                  <Volume2 size={14} className="sm:w-4 sm:h-4" />
                }
              </WaveButton>
            </div>
          </div>
        </div>

        {/* Progress Bar (모바일에서 숨김) */}
        <div className="mt-4 hidden sm:block">
          <div className="flex items-center justify-between text-xs text-white/60 mb-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-1">
            <div 
              className="bg-travel-blue h-1 rounded-full transition-all duration-300"
              style={{ 
                width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` 
              }}
            />
          </div>
        </div>
      </GlassCard>
    </div>
  );
}