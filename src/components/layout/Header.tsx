import React from 'react';
import { Typography } from '@/components/ui/Typography';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-glass-primary backdrop-blur-sm border-b border-glass-border ${className}`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* 로고 */}
          <div className="flex items-center space-x-3">
            <img
              src="/moonwave_log.png"
              alt="Moonwave"
              className="w-8 h-8 rounded-full"
            />
            <Typography variant="h5" className="text-white font-bold">
              Moonwave
            </Typography>
          </div>

          {/* 네비게이션 */}
          <nav className="hidden md:flex items-center space-x-6">
            <a
              href="/"
              className="text-white hover:text-moonwave-300 transition-colors"
            >
              홈
            </a>
            <a
              href="/tracks"
              className="text-white hover:text-moonwave-300 transition-colors"
            >
              트랙
            </a>
            <a
              href="/about"
              className="text-white hover:text-moonwave-300 transition-colors"
            >
              오안나
            </a>
          </nav>

          {/* 모바일 메뉴 버튼 */}
          <button className="md:hidden p-2 rounded-lg hover:bg-glass-secondary transition-colors">
            <svg
              className="w-6 h-6 text-white"
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