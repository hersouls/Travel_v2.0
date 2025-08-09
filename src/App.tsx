
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts';
import { Home } from './pages/Home';
import { TripCreate } from './pages/TripCreate';
import { TripEdit } from './pages/TripEdit';
import { TripDetail } from './pages/TripDetail';
import { PlanDetail } from './pages/PlanDetail';
import { PlaceSearch } from './pages/PlaceSearch';
import { TripMap } from './pages/TripMap';
import { Login } from './pages/Login';
import { Settings } from './pages/Settings';
import { AboutUs } from './components/AboutUs';
import { TermsOfService } from './components/TermsOfService';
import { WaveBackground } from './components/WaveBackground';
import { MusicPlayer } from './components/MusicPlayer';

function App() {

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen relative">
          <WaveBackground />
          <div className="relative z-10 min-h-screen">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/trips/new" element={<TripCreate />} />
              <Route path="/trips/:id/edit" element={<TripEdit />} />
              <Route path="/trips/:id" element={<TripDetail />} />
              <Route path="/trips/:tripId/plans/new" element={<PlanDetail />} />
              <Route path="/trips/:tripId/plans/:planId" element={<PlanDetail />} />
              <Route path="/places/search" element={<PlaceSearch />} />
              <Route path="/trips/:id/map" element={<TripMap />} />
              <Route path="/trip-map" element={<TripMap />} />
              <Route path="*" element={<div>404 - Page Not Found</div>} />
            </Routes>
          </div>
          
          {/* Music Player - Fixed Bottom */}
          <div className="px-4 pb-4">
            <MusicPlayer />
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;