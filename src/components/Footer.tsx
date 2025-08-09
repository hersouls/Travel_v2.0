
import { useAuth } from '../contexts';
import { GlassCard } from './GlassCard';
import { Heart, Sparkles, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  const { user } = useAuth();

  return (
    <footer className="px-4 pb-6" role="contentinfo" aria-label="페이지 하단 정보">
      <div className="max-w-7xl mx-auto">
        <GlassCard variant="light" className="p-6 relative overflow-hidden group">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
            <div className="absolute top-2 left-4 w-2 h-2 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full animate-pulse"></div>
            <div className="absolute bottom-4 right-6 w-1 h-1 bg-gradient-to-r from-warning-400 to-error-400 rounded-full animate-bounce"></div>
            <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-gradient-to-r from-success-400 to-info-400 rounded-full animate-ping"></div>
          </div>

          {/* Main Content */}
          <div className="relative z-10">
            <div className="flex flex-col items-center space-y-4">
              {/* Logo and Brand */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg">
                  <Moon size={14} className="text-white icon-enhanced" strokeWidth={2} />
                </div>
                <span className="text-white font-medium text-sm tracking-normal">Moonwave Travel</span>
              </div>

              {/* Copyright Text */}
              <div className="text-center">
                <p className="text-white/80 text-sm break-keep-ko leading-relaxed tracking-normal">
                  © 2025 Moonwave Travel •{' '}
                  <span className="text-white font-medium">
                    {user?.displayName || user?.email?.split('@')[0] || '사용자'}
                  </span>
                  님의 여행 공간
                </p>
              </div>

              {/* About Us and Terms Links */}
              <div className="flex items-center justify-center space-x-6 mt-4">
                <Link 
                  to="/about" 
                  className="text-white/80 text-sm hover:text-primary-400 transition-colors duration-300 tracking-normal underline decoration-primary-400/50 hover:decoration-primary-400"
                >
                  About Moonwave Travel
                </Link>
                <span className="text-white/80 text-sm">•</span>
                <Link 
                  to="/terms" 
                  className="text-white/80 text-sm hover:text-primary-400 transition-colors duration-300 tracking-normal underline decoration-primary-400/50 hover:decoration-primary-400"
                >
                  Terms of Service
                </Link>
              </div>

              {/* Decorative Elements */}
              <div className="flex items-center space-x-2 mt-4">
                <div className="flex items-center space-x-1 text-xs text-white/60">
                  <Heart size={12} className="animate-pulse icon-enhanced" strokeWidth={1.5} />
                  <span className="tracking-normal">Made with</span>
                </div>
                <div className="flex items-center space-x-1 text-xs text-white/60">
                  <Sparkles size={12} className="animate-spin icon-enhanced" strokeWidth={1.5} />
                  <span className="tracking-normal">Tailwind CSS</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hover Effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform -skew-x-12"></div>
        </GlassCard>
      </div>
    </footer>
  );
} 
