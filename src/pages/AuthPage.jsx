import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { Mail, Lock, User, ShieldCheck, KeyRound, ArrowRight, ArrowLeft } from 'lucide-react';
import axios from 'axios';

export default function AuthPage() {
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup' | 'otp'
  const [isAdmin, setIsAdmin] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    otp: ''
  });
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Google OAuth Success Handler
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      const res = await axios.post('http://localhost:5000/api/auth/google', {
        token: credentialResponse.credential
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/');
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Google Auth Failed' });
    } finally {
      setLoading(false);
    }
  };

  // Standard Username/Password & Admin Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      if (authMode === 'signup') {
        const res = await axios.post('http://localhost:5000/api/auth/register', {
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
        setMessage({ type: 'success', text: 'Registration successful! You can now log in.' });
        setAuthMode('login');
      } else if (authMode === 'login') {
        const endpoint = isAdmin 
          ? 'http://localhost:5000/api/auth/admin-login' 
          : 'http://localhost:5000/api/auth/login';
        
        const res = await axios.post(endpoint, {
          email: formData.email,
          password: formData.password
        });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        navigate(isAdmin ? '/admin-dashboard' : '/');
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Authentication error' });
    } finally {
      setLoading(false);
    }
  };

  // OTP Handlers
  const handleSendOtp = async () => {
    if (!formData.email) {
      setMessage({ type: 'error', text: 'Please enter your email first.' });
      return;
    }
    try {
      setLoading(true);
      await axios.post('http://localhost:5000/api/auth/send-otp', { email: formData.email });
      setOtpSent(true);
      setMessage({ type: 'success', text: 'OTP sent to your email.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Could not send OTP' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post('http://localhost:5000/api/auth/verify-otp', {
        email: formData.email,
        otp: formData.otp
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/');
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Invalid or expired OTP' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-[#020E05] text-white">
      {/* LEFT HALF: Image Container */}
      <div className="relative hidden md:flex flex-col justify-between p-12 bg-black border-r border-[#3D3F11]/40 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1200&auto=format&fit=crop')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020E05] via-transparent to-[#020E05]/80" />

        <div className="relative z-10">
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center space-x-2 text-sm text-[#A7AD58] hover:text-[#C5A059] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
        </div>

        <div className="relative z-10 space-y-4 max-w-md">
          <div className="inline-block px-3 py-1 bg-[#3D3F11]/60 border border-[#C5A059]/40 rounded-full text-xs text-[#A7AD58] uppercase tracking-wider font-semibold">
            Health & Hydration Portal
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight text-white leading-tight">
            Every sip matters to your vitality.
          </h2>
          <p className="text-zinc-300 text-sm leading-relaxed">
            Access customized nutrition logs, AI drink insights, and deficiency tracking from one integrated account.
          </p>
        </div>

        <div className="relative z-10 text-xs text-zinc-500">
          &copy; 2026 NutriTrack AI. All rights reserved.
        </div>
      </div>

      {/* RIGHT HALF: Form Controls */}
      <div className="flex flex-col justify-center items-center p-8 sm:p-14 bg-[#020E05]">
        <div className="w-full max-w-md space-y-6">
          
          {/* Admin Toggle & Mode Selectors */}
          <div className="flex items-center justify-between border-b border-[#3D3F11]/60 pb-4">
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setIsAdmin(false); }}
                className={`text-sm font-semibold transition-colors ${
                  authMode === 'login' && !isAdmin ? 'text-blue-500 border-b-2 border-blue-500 pb-1' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('signup'); setIsAdmin(false); }}
                className={`text-sm font-semibold transition-colors ${
                  authMode === 'signup' && !isAdmin ? 'text-blue-500 border-b-2 border-blue-500 pb-1' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Sign Up
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('otp'); setIsAdmin(false); }}
                className={`text-sm font-semibold transition-colors ${
                  authMode === 'otp' ? 'text-blue-500 border-b-2 border-blue-500 pb-1' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Email OTP
              </button>
            </div>

            {/* Admin Switch */}
            <button
              type="button"
              onClick={() => { setIsAdmin(!isAdmin); setAuthMode('login'); }}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded text-xs font-semibold border transition-all ${
                isAdmin 
                  ? 'bg-rose-950/40 text-rose-400 border-rose-500/50' 
                  : 'bg-zinc-900 text-zinc-400 border-zinc-700 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isAdmin ? 'Admin Mode On' : 'Admin Login'}</span>
            </button>
          </div>

          {/* Heading */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              {isAdmin 
                ? 'System Administration' 
                : authMode === 'signup' 
                ? 'Create an Account' 
                : authMode === 'otp' 
                ? 'Passwordless OTP Login' 
                : 'Welcome Back'}
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              {isAdmin 
                ? 'Authorized administrator credentials required' 
                : 'Enter your credentials or choose alternative authentication.'}
            </p>
          </div>

          {/* Alert Message */}
          {message.text && (
            <div className={`p-3 rounded-lg text-xs font-medium border ${
              message.type === 'error' 
                ? 'bg-rose-950/40 text-rose-300 border-rose-500/40' 
                : 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40'
            }`}>
              {message.text}
            </div>
          )}

          {/* STANDARD & ADMIN FORM */}
          {authMode !== 'otp' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {authMode === 'signup' && (
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Jane Doe"
                      className="w-full bg-black/60 border border-[#3D3F11] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className="w-full bg-black/60 border border-[#3D3F11] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full bg-black/60 border border-[#3D3F11] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Blue Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-900/30 flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <span>{loading ? 'Processing...' : authMode === 'signup' ? 'Create Account' : isAdmin ? 'Admin Access' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* OTP FORM */}
          {authMode === 'otp' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Registered Email</label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    name="email"
                    required
                    disabled={otpSent}
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className="flex-1 bg-black/60 border border-[#3D3F11] rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={loading || otpSent}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold whitespace-nowrap transition-colors disabled:opacity-50"
                  >
                    {otpSent ? 'Sent' : 'Get OTP'}
                  </button>
                </div>
              </div>

              {otpSent && (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">Enter 6-Digit OTP</label>
                    <div className="relative">
                      <KeyRound className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                      <input
                        type="text"
                        name="otp"
                        required
                        maxLength={6}
                        value={formData.otp}
                        onChange={handleChange}
                        placeholder="123456"
                        className="w-full bg-black/60 border border-[#3D3F11] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white tracking-widest placeholder-zinc-600 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-900/30 flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    <span>{loading ? 'Verifying...' : 'Verify OTP & Enter'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Google Auth Divider & Button (Hidden for Admin) */}
          {!isAdmin && (
            <>
              <div className="flex items-center my-4">
                <div className="flex-1 h-[1px] bg-[#3D3F11]/60"></div>
                <span className="px-3 text-xs text-zinc-500 font-medium">Or continue with</span>
                <div className="flex-1 h-[1px] bg-[#3D3F11]/60"></div>
              </div>

              <div className="flex justify-center w-full">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setMessage({ type: 'error', text: 'Google sign-in was unsuccessful' })}
                  theme="filled_black"
                  shape="rectangular"
                  width="100%"
                />
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}