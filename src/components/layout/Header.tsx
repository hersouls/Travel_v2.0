import React from 'react';
import { Typography } from '@/components/ui/Typography';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-glass-primary backdrop-blur-sm border-b border-glass-border ${className}`}>
      <div className="container-mobile sm:container-tablet lg:container-desktop py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* 로고 */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <img
              src="/moonwave_log.png"
              alt="Moonwave"
              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full"
            />
            <Typography variant="h5" className="text-white font-bold text-sm sm:text-base">
              Moonwave
            </Typography>
          </div>

          {/* 네비게이션 */}
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
            <a
              href="/"
              className="text-white hover:text-moonwave-300 transition-colors text-sm lg:text-base"
            >
              홈
            </a>
            <a
              href="/tracks"
              className="text-white hover:text-moonwave-300 transition-colors text-sm lg:text-base"
            >
              트랙
            </a>
            <a
              href="/about"
              className="text-white hover:text-moonwave-300 transition-colors text-sm lg:text-base"
            >
              오안나
            </a>
          </nav>

          {/* 모바일 메뉴 버튼 */}
          <button className="md:hidden btn-touch rounded-lg hover:bg-glass-secondary transition-colors">
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};