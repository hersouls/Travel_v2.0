import { Link, useLocation } from 'react-router-dom';
import { Home, User, Map } from 'lucide-react';
import { WaveButton } from './WaveButton';

export function Header() {
  const location = useLocation();

  const isHome = location.pathname === '/';
  const isSettings = location.pathname === '/settings';
  const isTripMap = location.pathname === '/trip-map';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-4" role="banner" aria-label="페이지 상단 네비게이션">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Left: Home Button */}
          <div className="flex-shrink-0">
            <Link to="/">
              <WaveButton
                variant={isHome ? "primary" : "ghost"}
                size="sm"
                ariaLabel="홈으로 이동"
                className="p-2 hover:bg-white/30 active:scale-95 focus:ring-2 focus:ring-white/50 transition-all"
              >
                <Home size={20} className="icon-enhanced" />
              </WaveButton>
            </Link>
          </div>

          {/* Right: Map & Profile */}
          <div className="flex items-center space-x-2">
            {/* Map */}
            <Link to="/trip-map">
              <WaveButton
                variant={isTripMap ? "primary" : "ghost"}
                size="sm"
                ariaLabel="지도로 이동"
                className="p-2 hover:bg-white/30 active:scale-95 focus:ring-2 focus:ring-white/50 transition-all"
              >
                <Map size={20} className="icon-enhanced" />
              </WaveButton>
            </Link>
            
            {/* Profile */}
            <Link to="/settings">
              <WaveButton
                variant={isSettings ? "primary" : "ghost"}
                size="sm"
                ariaLabel="설정으로 이동"
                className="p-2 hover:bg-white/30 active:scale-95 focus:ring-2 focus:ring-white/50 transition-all"
              >
                <User size={20} className="icon-enhanced" />
              </WaveButton>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}