import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import TrackerPage from './pages/TrackerPage';
import DrinkDetailPage from './pages/DrinkDetailPage';
import { GoogleOAuthProvider } from '@react-oauth/google';

export default function App() {
  const GOOGLE_CLIENT_ID = "579629611107-4f67sgukk9bn2q449legavrkcv59jtd1.apps.googleusercontent.com";
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/drink/:id" element={<DrinkDetailPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/tracker" element={<TrackerPage />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}
