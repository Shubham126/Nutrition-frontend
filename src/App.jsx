import React from 'react';
import { BrowserRouter as Router, Routes, Route, useParams, Link } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import { GoogleOAuthProvider } from '@react-oauth/google';

function DrinkDetailPlaceholder() {
  const { id } = useParams();
  return (
    <div className="min-h-screen bg-[#020E05] text-[#A7AD58] flex flex-col items-center justify-center p-6 space-y-6">
      <h1 className="text-3xl font-bold text-white capitalize">{id.replace('-', ' ')} Profile</h1>
      <p className="text-[#A7AD58]/70 max-w-md text-center">
        Detailed nutrition breakdown, vitamin deficiency suitability, and AI recommendations will be shown here.
      </p>
      <Link to="/" className="px-5 py-2.5 rounded-lg bg-[#C5A059] text-black font-semibold hover:opacity-90">
        Back to Home
      </Link>
    </div>
  );
}

export default function App() {
  const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/drink/:id" element={<DrinkDetailPlaceholder />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}