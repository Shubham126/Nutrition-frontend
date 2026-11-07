import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, User, LogOut, Camera } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Read stored user from localStorage
  useEffect(() => {
    const syncUser = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
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

    // Listen to storage changes across windows/tabs
    window.addEventListener('storage', syncUser);
    return () => window.removeEventListener('storage', syncUser);
  }, []);

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

  // End-to-end Logout Handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    setDropdownOpen(false);
    navigate('/login');
  };

  const handleAddProfilePicture = () => {
    // Placeholder for future profile picture upload logic
    alert('Add profile picture upload modal will open here.');
    setDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0A0D0A] border-b border-[#C5A059]/30 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand / Logo */}
        <Link to="/" className="flex items-center space-x-3 text-[#C5A059] font-bold text-xl tracking-wide">
          <Activity className="w-7 h-7 text-[#A7AD58]" />
          <span>NutriTrack AI</span>
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-sm text-[#A7AD58]/80 font-medium">
          <Link to="/" className="hover:text-[#C5A059] transition-colors">Home</Link>
          <a href="#features" className="hover:text-[#C5A059] transition-colors">Features</a>
          <a href="#about" className="hover:text-[#C5A059] transition-colors">About</a>
        </nav>

        {/* Right Section: Auth Buttons OR User Profile Menu */}
        <div className="flex items-center space-x-4">
          {!currentUser ? (
            /* Logged Out View */
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-semibold text-[#A7AD58] border border-[#A7AD58]/40 rounded-lg hover:bg-[#A7AD58]/10 transition-all"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 text-sm font-semibold text-[#0A0D0A] bg-[#C5A059] rounded-lg hover:bg-[#E6CA65] transition-all shadow-[0_0_15px_rgba(197,160,89,0.3)]"
              >
                Sign Up
              </Link>
            </>
          ) : (
            /* Logged In View: Avatar Icon & Compact Dropdown */
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-[#A7AD58] to-[#3D3F11] border-2 border-[#C5A059] flex items-center justify-center text-[#020E05] hover:scale-105 transition-all shadow-md focus:outline-none"
                aria-expanded={dropdownOpen}
              >
                {/* Fallback to first letter of name or User icon */}
                {currentUser?.name ? (
                  <span className="font-bold text-sm uppercase">
                    {currentUser.name.charAt(0)}
                  </span>
                ) : (
                  <User className="w-5 h-5 text-[#020E05]" />
                )}
              </button>

              {/* Compact Top-Right Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 rounded-xl bg-[#020E05] border border-[#C5A059]/40 shadow-[0_10px_25px_rgba(0,0,0,0.8)] py-2 z-50 text-sm">
                  {/* User info preview header */}
                  <div className="px-4 py-2 border-b border-[#3D3F11]/60">
                    <p className="text-white font-medium truncate">{currentUser.name || 'User'}</p>
                    <p className="text-xs text-zinc-400 truncate">{currentUser.email}</p>
                  </div>

                  {/* Option 1: Add profile picture */}
                  <button
                    type="button"
                    onClick={handleAddProfilePicture}
                    className="w-full text-left px-4 py-2.5 flex items-center space-x-2 text-[#A7AD58] hover:bg-[#3D3F11]/40 hover:text-[#C5A059] transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Add profile picture</span>
                  </button>

                  <div className="my-1 border-t border-[#3D3F11]/60"></div>

                  {/* Option 2: Logout */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 flex items-center space-x-2 text-rose-400 hover:bg-rose-950/30 hover:text-rose-300 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
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