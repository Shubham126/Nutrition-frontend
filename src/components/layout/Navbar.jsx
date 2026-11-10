import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Activity, User, LogOut, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Sync auth state from localStorage
  useEffect(() => {
    const syncUser = () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      if (storedToken && storedUser) {
        try {
          setCurrentUser(JSON.parse(storedUser));
        } catch {
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
    };

    syncUser();
    window.addEventListener('storage', syncUser);
    return () => window.removeEventListener('storage', syncUser);
  }, [location.pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    setDropdownOpen(false);
    navigate('/login');
  };

  const isInternalApp = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/tracker');

  return (
    <header className="sticky top-0 z-50 bg-[#0A0D0A] border-b border-[#3D3F11]/60 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Left: Brand Logo & Navigation */}
        <div className="flex items-center space-x-10">
          <Link to="/" className="flex items-center space-x-2.5 text-[#C5A059] font-bold text-xl tracking-wide hover:opacity-90 transition-opacity">
            <Activity className="w-6 h-6 text-[#A7AD58]" />
            <span className="font-sans">NutriTrack AI</span>
          </Link>

          {/* Navigation Links with unified font, size, and styling */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium font-sans">
            {isInternalApp ? (
              /* When in Dashboard or Tracker: Home, Dashboard, Tracker */
              <>
                <Link
                  to="/"
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  Home
                </Link>
                <Link
                  to="/dashboard"
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    location.pathname === '/dashboard'
                      ? 'bg-[#152319] text-[#10B981] font-semibold border border-[#10B981]/30'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/tracker"
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    location.pathname === '/tracker'
                      ? 'bg-[#152319] text-[#10B981] font-semibold border border-[#10B981]/30'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Tracker
                </Link>
              </>
            ) : (
              /* When on Home or Public pages: Home, Features, Beverages, (Dashboard if logged in) */
              <>
                <Link
                  to="/"
                  className={`transition-colors ${
                    location.pathname === '/' ? 'text-white font-semibold' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Home
                </Link>
                <a
                  href="/#beverages"
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  Beverages
                </a>
                <a
                  href="/#features"
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  Features
                </a>
                {currentUser && (
                  <Link
                    to="/dashboard"
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    Dashboard
                  </Link>
                )}
              </>
            )}
          </nav>
        </div>

        {/* Right Section: Auth Buttons OR User Profile Menu */}
        <div className="flex items-center space-x-4">
          {!currentUser ? (
            /* Logged Out View: Login and Signup */
            <div className="flex items-center space-x-3 text-sm font-sans">
              <Link
                to="/login"
                className="px-4 py-2 text-zinc-300 hover:text-white font-medium transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 rounded-lg bg-[#C5A059] hover:bg-[#E6CA65] text-[#0A0D0A] font-semibold transition-all shadow-[0_0_15px_rgba(197,160,89,0.25)]"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            /* Logged In View: StudyLog style user pill (subham v) */
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center space-x-2.5 px-3 py-1.5 rounded-full bg-[#111612] border border-[#3D3F11] hover:border-[#C5A059]/60 text-zinc-200 text-xs font-medium transition-all"
                aria-expanded={dropdownOpen}
              >
                <div className="w-6 h-6 rounded-full bg-[#1B291F] text-[#10B981] font-bold text-[11px] flex items-center justify-center uppercase">
                  {currentUser.name ? currentUser.name.charAt(0) : 'U'}
                </div>
                <span className="font-semibold text-zinc-200">{currentUser.name || currentUser.username || 'User'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              </button>

              {/* Compact Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2.5 w-52 rounded-xl bg-[#0A0D0A] border border-[#3D3F11] shadow-2xl py-1.5 z-50 text-xs font-sans">
                  <div className="px-3.5 py-2 border-b border-[#1F2520]">
                    <p className="text-white font-semibold truncate">{currentUser.name || 'User'}</p>
                    <p className="text-zinc-500 text-[11px] truncate">{currentUser.email}</p>
                  </div>

                  <Link
                    to="/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    className="w-full text-left px-3.5 py-2 flex items-center space-x-2 text-zinc-300 hover:bg-[#152319] hover:text-[#10B981] transition-colors"
                  >
                    <span>Dashboard</span>
                  </Link>

                  <Link
                    to="/tracker"
                    onClick={() => setDropdownOpen(false)}
                    className="w-full text-left px-3.5 py-2 flex items-center space-x-2 text-zinc-300 hover:bg-[#152319] hover:text-[#10B981] transition-colors"
                  >
                    <span>Tracker</span>
                  </Link>

                  <div className="my-1 border-t border-[#1F2520]"></div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-left px-3.5 py-2 flex items-center space-x-2 text-rose-400 hover:bg-rose-950/30 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
