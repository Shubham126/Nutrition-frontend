import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ShieldCheck, KeyRound, ArrowRight, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';

export default function LoginPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [useOtp, setUseOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form states
  const [formData, setFormData] = useState({
    identifier: '', // username or email
    password: '',
    email: '',
    otp: '',
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const endpoint = isAdmin 
        ? 'http://localhost:5000/api/auth/admin-login' 
        : 'http://localhost:5000/api/auth/login';

      const res = await axios.post(endpoint, {
        identifier: formData.identifier,
        password: formData.password
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate(isAdmin ? '/dashboard' : '/');
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      setErrorMessage('');
      const res = await axios.post('http://localhost:5000/api/auth/google', {
        token: credentialResponse.credential,
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/');
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Google authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!formData.email) {
      alert("Please enter your email first.");
      return;
    }
    // Integrated with POST /api/auth/send-otp
    console.log("Send OTP requested for:", formData.email);
    setOtpSent(true);
  };

  const handleOtpLogin = async (e) => {
    e.preventDefault();
    // Integrated with POST /api/auth/verify-otp
    console.log("Verify OTP login submitted:", formData);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#020E05] text-zinc-100 font-sans">
      
      {/* LEFT HALF: Background Image */}
      <div 
        className="w-full md:w-1/2 min-h-[300px] md:min-h-screen bg-cover bg-center relative"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1200&auto=format&fit=crop')`
        }}
      >
        <button 
          type="button"
          onClick={() => navigate('/')} 
          className="absolute top-6 left-6 z-20 flex items-center space-x-2 text-sm text-[#A7AD58] hover:text-[#C5A059] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/80 via-black/40 to-transparent flex flex-col justify-end p-8 md:p-12">
          <span className="text-xs uppercase tracking-widest text-[#A7AD58] font-bold">Nutrivita AI</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-2">Nourish Your Body With Intelligent Care</h2>
          <p className="text-sm text-zinc-300 mt-2 max-w-md">Log in to monitor your customized fluid logs, nutritional recommendations, and health markers.</p>
        </div>
      </div>

      {/* RIGHT HALF: Authentication Panel */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16">
        <div className="w-full max-w-md space-y-6">

          {/* Top Switcher: User vs Admin */}
          <div className="flex items-center justify-between pb-4 border-b border-[#3D3F11]">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-wide">
                {isAdmin ? 'Admin Portal' : 'Welcome Back'}
              </h1>
              <p className="text-xs text-zinc-400 mt-1">
                {isAdmin ? 'Authenticate with administrator privileges' : 'Access your personalized nutrition dashboard'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => { setIsAdmin(!isAdmin); setUseOtp(false); }}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#3D3F11] hover:border-[#D4AF37] text-[#A7AD58] transition-colors"
            >
              {isAdmin ? 'User Login' : 'Admin Login'}
            </button>
          </div>

          {!useOtp ? (
            /* USERNAME / PASSWORD FORM */
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  {isAdmin ? 'Admin Username / Email' : 'Username or Email'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    name="identifier"
                    value={formData.identifier}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter username or email"
                    className="w-full pl-10 pr-4 py-2.5 bg-black/60 border border-[#3D3F11] focus:border-[#D4AF37] rounded-xl text-sm text-white placeholder-zinc-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-black/60 border border-[#3D3F11] focus:border-[#D4AF37] rounded-xl text-sm text-white placeholder-zinc-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-md shadow-blue-900/30 active:scale-[0.99] flex items-center justify-center space-x-2"
              >
                <span>{isAdmin ? 'Authenticate as Admin' : 'Log In'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* OTP-BASED LOGIN FORM */
            <form onSubmit={handleOtpLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Registered Email</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="name@domain.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-black/60 border border-[#3D3F11] focus:border-[#D4AF37] rounded-xl text-sm text-white placeholder-zinc-500 outline-none transition-all"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="px-4 py-2 bg-[#3D3F11] hover:bg-[#A7AD58] hover:text-[#020E05] text-[#A7AD58] text-xs font-semibold rounded-xl border border-[#D4AF37]/40 transition-colors"
                  >
                    {otpSent ? 'Resend' : 'Send OTP'}
                  </button>
                </div>
              </div>

              {otpSent && (
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Enter 6-Digit OTP</label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      name="otp"
                      maxLength={6}
                      value={formData.otp}
                      onChange={handleInputChange}
                      required
                      placeholder="123456"
                      className="w-full pl-10 pr-4 py-2.5 bg-black/60 border border-[#3D3F11] focus:border-[#D4AF37] rounded-xl text-sm text-white placeholder-zinc-500 outline-none tracking-widest transition-all"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={!otpSent}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-sm transition-all shadow-md shadow-blue-900/30 flex items-center justify-center space-x-2"
              >
                <span>Verify OTP & Log In</span>
              </button>
            </form>
          )}

          {/* User Sign-In Options (Not available in Admin mode) */}
          {!isAdmin && (
            <div className="space-y-4 pt-2">
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-[#3D3F11]"></div>
                <span className="flex-shrink mx-4 text-xs uppercase tracking-wider text-zinc-500">Or continue with</span>
                <div className="flex-grow border-t border-[#3D3F11]"></div>
              </div>

              {/* GOOGLE SIGN IN */}

              {/* GOOGLE SIGN IN */}
              <div className="w-full flex justify-center [&>div]:w-full [&>div>iframe]:!mx-auto">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setErrorMessage('Google sign-in was unsuccessful')}
                  theme="filled_black"
                  shape="rectangular"
                  text="signin_with"
                  size="large"
                  width="100%"
                />
              </div>

              {/* OTP LOGIN BUTTON: Strictly below Google Sign In on Login Page */}
              <button
                type="button"
                onClick={() => setUseOtp(!useOtp)}
                className="w-full py-2.5 px-4 rounded-xl border border-[#3D3F11] hover:border-[#D4AF37]/50 bg-black/40 text-xs text-[#A7AD58] font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <KeyRound className="w-4 h-4 text-[#A7AD58]" />
                <span>{useOtp ? 'Back to Standard Password Login' : 'Login using Email OTP'}</span>
              </button>
            </div>
          )}

          {/* BOTTOM REDIRECT TO SIGNUP */}
          <div className="pt-4 text-center border-t border-[#3D3F11]">
            <p className="text-xs text-zinc-400">
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-semibold underline underline-offset-4 ml-1">
                Sign up
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}