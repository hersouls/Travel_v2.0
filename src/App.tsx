import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts';
import { Home } from './pages/Home';
import { TripCreate } from './pages/TripCreate';
import { TripDetail } from './pages/TripDetail';
import { PlanDetail } from './pages/PlanDetail';
import { PlaceSearch } from './pages/PlaceSearch';
import { TripMap } from './pages/TripMap';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/trips/new" element={<TripCreate />} />
            <Route path="/trips/:id" element={<TripDetail />} />
            <Route path="/trips/:tripId/plans/new" element={<PlanDetail />} />
            <Route path="/trips/:tripId/plans/:planId" element={<PlanDetail />} />
            <Route path="/places/search" element={<PlaceSearch />} />
            <Route path="/trips/:id/map" element={<TripMap />} />
            <Route path="*" element={<div>404 - Page Not Found</div>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;