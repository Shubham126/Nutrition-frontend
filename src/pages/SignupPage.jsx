import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [countdown, setCountdown] = useState(5);

  const navigate = useNavigate();

  // 5-second countdown and redirection handler
  useEffect(() => {
    let timer;
    if (successMessage && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (successMessage && countdown === 0) {
      navigate('/login');
    }
    return () => clearInterval(timer);
  }, [successMessage, countdown, navigate]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        name: formData.name,
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      // Show confirmation message and trigger 5s timer
      setSuccessMessage('Account created successfully! Redirecting to login page in');
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Signup failed. Please try again.');
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
      navigate('/dashboard');
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Google sign-up failed.');
    } finally {
      setLoading(false);
    }
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
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-2">Start Your Holistic Wellness Journey</h2>
          <p className="text-sm text-zinc-300 mt-2 max-w-md">Create an account to analyze beverage contents, trace vitamin gaps, and log hydration dynamically.</p>
        </div>
      </div>

      {/* RIGHT HALF: Signup Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16">
        <div className="w-full max-w-md space-y-6">

          <div className="border-b border-[#3D3F11] pb-4">
            <h1 className="text-2xl font-bold text-white tracking-wide">Create an Account</h1>
            <p className="text-xs text-zinc-400 mt-1">Get started with your free health and hydration tracker</p>
          </div>

          {/* Success Banner with Countdown */}
          {successMessage && (
            <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <div>
                <span>{successMessage} </span>
                <span className="font-bold text-emerald-300 text-sm underline">{countdown}s</span>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-300 text-xs">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSignupSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  disabled={Boolean(successMessage)}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-2.5 bg-black/60 border border-[#3D3F11] focus:border-[#D4AF37] rounded-xl text-sm text-white placeholder-zinc-500 outline-none transition-all disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Username</label>
              <div className="relative">
                <span className="text-zinc-400 absolute left-3.5 top-2.5 text-sm font-semibold">@</span>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  disabled={Boolean(successMessage)}
                  placeholder="johndoe"
                  className="w-full pl-10 pr-4 py-2.5 bg-black/60 border border-[#3D3F11] focus:border-[#D4AF37] rounded-xl text-sm text-white placeholder-zinc-500 outline-none transition-all disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={Boolean(successMessage)}
                  placeholder="john@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-black/60 border border-[#3D3F11] focus:border-[#D4AF37] rounded-xl text-sm text-white placeholder-zinc-500 outline-none transition-all disabled:opacity-50"
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
                  disabled={Boolean(successMessage)}
                  placeholder="Create a strong password"
                  className="w-full pl-10 pr-4 py-2.5 bg-black/60 border border-[#3D3F11] focus:border-[#D4AF37] rounded-xl text-sm text-white placeholder-zinc-500 outline-none transition-all disabled:opacity-50"
                />
              </div>
            </div>

            {/* Blue Signup Button */}
            <button
              type="submit"
              disabled={loading || Boolean(successMessage)}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-md shadow-blue-900/30 active:scale-[0.99] flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{loading ? 'Creating Account...' : successMessage ? 'Account Created' : 'Create Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* GOOGLE SIGN UP */}
          <div className="space-y-4 pt-2">
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-[#3D3F11]"></div>
              <span className="flex-shrink mx-4 text-xs uppercase tracking-wider text-zinc-500">Or continue with</span>
              <div className="flex-grow border-t border-[#3D3F11]"></div>
            </div>

            <div className="w-full flex justify-center [&>div]:w-full [&>div>iframe]:!mx-auto">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setErrorMessage('Google sign-up was unsuccessful')}
                theme="filled_black"
                shape="rectangular"
                text="signup_with"
                size="large"
                width="100%"
              />
            </div>
          </div>

          {/* BOTTOM REDIRECT TO LOGIN */}
          <div className="pt-4 text-center border-t border-[#3D3F11]">
            <p className="text-xs text-zinc-400">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold underline underline-offset-4 ml-1">
                Log in
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}