import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Briefcase, User, Mail, Lock, ArrowRight, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password || !confirmPassword) {
      return showToast('Please fill in all fields', 'error');
    }
    if (password.length < 6) {
      return showToast('Password must be at least 6 characters', 'error');
    }
    if (password !== confirmPassword) {
      return showToast('Passwords do not match', 'error');
    }
    setIsSubmitting(true);
    
    const result = await register(username, email, password);
    setIsSubmitting(false);
    
    if (result.success) {
      showToast('Registration successful! Welcome to CareerVault.', 'success');
      navigate('/dashboard');
    } else {
      showToast(result.message || 'Registration failed. Try again.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row overflow-hidden font-sans">
      
      {/* LEFT SIDE: Branding + Visual Storytelling */}
      <div className="hidden md:flex md:w-[45%] lg:w-[50%] bg-[#243B53] relative overflow-hidden flex-col justify-between p-12 text-white select-none">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:30px_30px] opacity-70 pointer-events-none" />
        
        {/* Decorative glowing gradient flows */}
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] rounded-full bg-blue-500/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-[300px] h-[300px] rounded-full bg-indigo-500/10 blur-[80px] pointer-events-none" />

        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-md">
            <Briefcase className="h-4.5 w-4.5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white leading-none font-display">CareerVault</h1>
            <span className="text-[9px] text-blue-400 font-bold uppercase tracking-widest mt-1 block">SaaS Platform</span>
          </div>
        </div>

        {/* Central visual text storytelling */}
        <div className="relative z-10 space-y-6 my-auto max-w-lg">
          <h2 className="text-4xl lg:text-5xl font-bold font-display leading-[1.1] text-white">
            Kickstart your <span className="text-blue-400 bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">career tracker</span> in seconds.
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Create an account to unlock premium job boards management, status charts, search indexing, and a clean professional recruiter portfolio presentation.
          </p>

          {/* Highlights */}
          <div className="space-y-3.5 pt-4">
            <div className="flex items-center gap-3 text-sm text-slate-200">
              <div className="h-5 w-5 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-400/30">
                <CheckCircle2 className="h-3 w-3 text-blue-400" />
              </div>
              <span className="font-medium">100% Free SaaS tier</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-200">
              <div className="h-5 w-5 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-400/30">
                <CheckCircle2 className="h-3 w-3 text-blue-400" />
              </div>
              <span className="font-medium">Instant dashboard calculations</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-200">
              <div className="h-5 w-5 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-400/30">
                <CheckCircle2 className="h-3 w-3 text-blue-400" />
              </div>
              <span className="font-medium">Secure local JWT storage</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-xs text-slate-400 font-medium">
          © {new Date().getFullYear()} CareerVault Premium. All rights reserved.
        </div>
      </div>

      {/* RIGHT SIDE: Onboarding Registration Card */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-16 relative overflow-y-auto">
        {/* Subtle grid background */}
        <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />

        <div className="w-full max-w-[420px] space-y-7 relative z-10 animate-slide-up py-8">
          {/* Mobile brand header (Hidden on desktop) */}
          <div className="flex items-center gap-3 md:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#243B53] shadow-md">
              <Briefcase className="h-4.5 w-4.5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-[#0F172A] font-display">CareerVault</h1>
          </div>

          <div>
            <h2 className="text-3xl font-extrabold text-[#0F172A] tracking-tight font-display">Create your account</h2>
            <p className="mt-1 text-sm text-slate-500">
              Fill in your details to start tracking applications.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4.5">
            {/* Username */}
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Username
              </label>
              <div className="premium-input-icon-wrapper">
                <User className="premium-input-icon" />
                <input
                  type="text"
                  placeholder="johndoe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="premium-input pl-12"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Email Address
              </label>
              <div className="premium-input-icon-wrapper">
                <Mail className="premium-input-icon" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="premium-input pl-12"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Password
              </label>
              <div className="premium-input-icon-wrapper">
                <Lock className="premium-input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="premium-input pl-12 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Confirm Password
              </label>
              <div className="premium-input-icon-wrapper">
                <Lock className="premium-input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="premium-input pl-12 pr-12"
                  required
                />
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 bg-[#243B53] text-white rounded-xl py-3.5 px-4 font-semibold hover:bg-[#1a2d40] shadow-sm transition-all duration-200 disabled:opacity-50"
              >
                {isSubmitting ? 'Creating account...' : 'Create Account'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>

          {/* Footer Link */}
          <p className="text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-blue-500 hover:text-blue-600 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
