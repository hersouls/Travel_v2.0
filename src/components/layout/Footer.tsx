import React from 'react';
import { cn } from '@/utils/cn';

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={cn("bg-black/20 backdrop-blur-sm border-t border-white/10", className)}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {/* 로고 및 브랜드 정보 */}
          <div className="flex items-center space-x-4">
            <img
              src="/moonwave_log.png"
              alt="Moonwave"
              className="h-8 w-auto"
            />
            <div>
              <p className="text-sm text-white font-medium">Moonwave</p>
              <p className="text-xs text-gray-400">평범함에서 특별함으로</p>
            </div>
          </div>

          {/* 링크 */}
          <div className="flex items-center space-x-6">
            <a
              href="/about"
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              오안나 소개
            </a>
            <a
              href="/tracks"
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              음악 듣기
            </a>
            <a
              href="/docs/이용약관"
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              이용약관
            </a>
            <a
              href="/docs/콘텐츠 고지사항"
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              고지사항
            </a>
          </div>

          {/* 저작권 */}
          <div className="text-center md:text-right">
            <p className="text-xs text-gray-400">
              © {currentYear} Moonwave. All rights reserved.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Made with ❤️ by Moonwave Team
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};