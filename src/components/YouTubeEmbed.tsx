import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Play, Youtube, X } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { WaveButton } from './WaveButton';
import { getYouTubeEmbedUrl, getYouTubeThumbnail } from '../utils/youtube';

interface YouTubeEmbedProps {
  url: string;
  title?: string;
  className?: string;
}

export const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({
  url,
  title,
  className = ''
}) => {
  const [showModal, setShowModal] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  const embedUrl = getYouTubeEmbedUrl(url);
  const thumbnailUrl = getYouTubeThumbnail(url, 'maxres') || getYouTubeThumbnail(url, 'high');

  if (!embedUrl) {
    return (
      <div className={`text-red-400 text-sm ${className}`}>
        유효하지 않은 유튜브 URL입니다.
      </div>
    );
  }

  const handleThumbnailClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setShowModal(true);
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsVideoLoaded(true);
  };

  const handleModalClose = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setShowModal(false);
    setIsVideoLoaded(false); // 모달 닫을 때 비디오 리셋
  };

  return (
    <>
      {/* Thumbnail */}
      <div 
        className={`relative group cursor-pointer ${className}`}
        data-youtube-embed
      >
        {thumbnailUrl ? (
          <div className="relative youtube-thumbnail">
            <img
              src={thumbnailUrl}
              alt={title || '유튜브 비디오'}
              className="w-full aspect-video object-cover rounded-lg transition-transform group-hover:scale-105"
              onClick={handleThumbnailClick}
            />
            {/* Play button overlay */}
            <div 
              className="absolute inset-0 bg-black/30 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity youtube-play-button"
              onClick={handleThumbnailClick}
            >
              <div className="bg-red-600 rounded-full p-3">
                <Play className="w-6 h-6 text-white ml-1" />
              </div>
            </div>
            {/* YouTube icon */}
            <div className="absolute top-2 right-2 bg-red-600 rounded px-2 py-1">
              <Youtube className="w-4 h-4 text-white" />
            </div>
          </div>
        ) : (
          <div 
            className="w-full aspect-video bg-gradient-to-br from-red-600/20 to-red-800/20 rounded-lg flex items-center justify-center cursor-pointer hover:from-red-600/30 hover:to-red-800/30 transition-colors youtube-thumbnail"
            onClick={handleThumbnailClick}
          >
            <div className="text-center youtube-play-button">
              <Youtube className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <span className="text-white text-sm">유튜브 비디오</span>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && createPortal(
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-6 md:p-8 lg:p-12"
          onClick={(e) => {
            // 모달 배경 클릭 시에만 닫기
            if (e.target === e.currentTarget) {
              handleModalClose(e);
            }
          }}
        >
          {/* Close button */}
          <WaveButton
            variant="ghost"
            size="sm"
            onClick={(e) => handleModalClose(e)}
            className="absolute top-6 right-6 md:top-8 md:right-8 lg:top-12 lg:right-12 z-10 bg-black/30 hover:bg-black/50 rounded-full p-3"
            ariaLabel="닫기"
          >
            <X className="w-6 h-6 text-white" />
          </WaveButton>

          {/* Video container */}
          <GlassCard 
            variant="travel" 
            className="w-full max-w-5xl mx-auto my-8 md:my-12 lg:my-16 mb-12 md:mb-16 lg:mb-20"
            withWaveEffect={true}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="space-y-6 p-2 md:p-4 lg:p-6 pb-4 md:pb-6 lg:pb-8">
              {title && (
                <div className="flex items-center space-x-2 mb-6">
                  <Youtube className="w-5 h-5 text-red-500" />
                  <h3 className="text-lg md:text-xl font-semibold text-white">{title}</h3>
                </div>
              )}
              
              {/* YouTube iframe or thumbnail */}
              <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
                {isVideoLoaded ? (
                  <iframe
                    src={`${embedUrl}${embedUrl.includes('?') ? '&' : '?'}autoplay=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`}
                    title={title || "YouTube video player"}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                ) : (
                  <div className="relative w-full h-full">
                    {thumbnailUrl ? (
                      <>
                        <img
                          src={thumbnailUrl}
                          alt={title || '유튜브 비디오'}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        {/* Large play button overlay */}
                        <div 
                          className="absolute inset-0 flex items-center justify-center cursor-pointer group youtube-play-button"
                          onClick={handlePlayClick}
                          data-youtube-embed
                        >
                          <div className="bg-red-600 rounded-full p-6 group-hover:bg-red-700 transition-all transform group-hover:scale-110">
                            <Play className="w-12 h-12 text-white ml-1" />
                          </div>
                        </div>
                        {/* YouTube branding */}
                        <div className="absolute bottom-4 right-4">
                          <div className="bg-red-600 px-2 py-1 rounded flex items-center space-x-1">
                            <Youtube className="w-4 h-4 text-white" />
                            <span className="text-white text-sm font-medium">YouTube</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div 
                          className="text-center cursor-pointer youtube-play-button" 
                          onClick={handlePlayClick}
                          data-youtube-embed
                        >
                          <div className="bg-red-600 rounded-full p-6 hover:bg-red-700 transition-colors">
                            <Youtube className="w-12 h-12 text-white" />
                          </div>
                          <span className="text-white text-sm mt-2 block">비디오 재생</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Video info */}
              <div className="flex items-center justify-between text-white/70 text-sm mt-8 pt-6 pb-4 border-t border-white/10">
                <span className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span>YouTube에서 재생 중</span>
                </span>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3 py-2 rounded-lg"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Youtube className="w-4 h-4" />
                  <span>YouTube에서 보기</span>
                </a>
              </div>
            </div>
          </GlassCard>
        </div>,
        document.body
      )}
    </>
  );
};