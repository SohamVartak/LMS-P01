import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { BookOpen, Shield, GraduationCap, CheckCircle2, ArrowRight } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { login, addToast } = useLibrary();
  const [isRegister, setIsRegister] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('sarthakgujar63@gmail.com');
  const [loginPassword, setLoginPassword] = useState('••••••••');
  const [rememberMe, setRememberMe] = useState(true);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regStudentId, setRegStudentId] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regDept, setRegDept] = useState('Computer Science & Engineering');
  const [regYear, setRegYear] = useState('3rd Year (Semester VI)');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) {
      setErrorMsg('Please enter your college email address.');
      return;
    }
    setErrorMsg('');
    login(loginEmail);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regStudentId.trim() || !regEmail.trim()) {
      setErrorMsg('All academic credentials and identification fields are required.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMsg('Passwords do not match. Please verify your entries.');
      return;
    }
    if (regPassword.length < 6) {
      setErrorMsg('Password should be at least 6 characters.');
      return;
    }

    setErrorMsg('');
    addToast('Account Registered', `Welcome to SIT Central Library, ${regName}!`, 'success');
    login(regEmail);
  };

  return (
    <div className="min-h-screen bg-[var(--app-canvas)] flex items-center justify-center p-4 sm:p-6 lg:p-8 transition-colors duration-200">
      <div className="max-w-4xl w-full bg-[var(--app-surface-elevated)] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-[var(--app-border)]">
        
        {/* Left Side: Academic College Illustration & Philosophy in Royal Violet (#4C1D95) */}
        <div className="md:w-5/12 bg-gradient-to-br from-[#4C1D95] via-[#3B0764] to-[#1E293B] p-8 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Subtle geometric pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none"
               style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />

          {/* Top College Crest & Title */}
          <div className="relative z-10">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#F97316] text-white flex items-center justify-center font-extrabold text-base shadow-lg shadow-orange-500/20">
                SIT
              </div>
              <div>
                <h3 className="font-bold text-base tracking-tight leading-none text-white font-serif-academic">
                  SIT Central Library
                </h3>
                <span className="text-[11px] text-purple-200">Sarthak&apos;s Institute of Technology</span>
              </div>
            </div>

            <div className="mt-8 space-y-2">
              <h2 className="text-2xl font-serif-academic font-bold text-white leading-tight">
                Your Digital Library, Anywhere.
              </h2>
              <p className="text-xs text-purple-100/85 leading-relaxed">
                Seamless access to academic textbooks, research papers, study seat carrels, and AI-powered reading recommendations.
              </p>
            </div>
          </div>

          {/* Center Graphic representation */}
          <div className="my-8 py-4 px-5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xs space-y-3 relative z-10">
            <div className="flex items-center gap-3 text-xs text-purple-100">
              <CheckCircle2 className="w-4 h-4 text-[#F97316] shrink-0" />
              <span>30+ Curated Core Textbooks</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-purple-100">
              <CheckCircle2 className="w-4 h-4 text-[#F97316] shrink-0" />
              <span>Interactive Real-time Seat Booking</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-purple-100">
              <CheckCircle2 className="w-4 h-4 text-[#F97316] shrink-0" />
              <span>QR Smart Stacks & Search History</span>
            </div>
          </div>

          {/* Bottom Security Note */}
          <div className="relative z-10 pt-4 border-t border-white/15 text-[11px] text-purple-200 flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-[#F97316]" />
            <span>Authenticated Student Portal · SIT Campus</span>
          </div>
        </div>

        {/* Right Side: Login / Register Form */}
        <div className="md:w-7/12 p-8 sm:p-10 flex flex-col justify-center bg-white">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-[#1E293B] tracking-tight">
              {isRegister ? 'Student Registration' : 'Student Portal Sign In'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {isRegister 
                ? 'Create your SIT Central Digital Library student account' 
                : 'Enter your institutional email credentials to proceed'}
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
              {errorMsg}
            </div>
          )}

          {!isRegister ? (
            /* Login Form */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                  College Email Address
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="student.name@sit.ac.in"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-[#1E293B] focus:outline-hidden focus:border-[#4C1D95] focus:ring-1 focus:ring-[#4C1D95] transition-colors"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-[#1E293B]">
                    Password
                  </label>
                  <button 
                    type="button" 
                    onClick={() => addToast('Reset Link Sent', 'Password reset instructions dispatched to your college email.', 'info')}
                    className="text-[11px] text-[#4C1D95] hover:underline font-semibold"
                  >
                    Forgot Password?
                  </button>
                </div>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-[#1E293B] focus:outline-hidden focus:border-[#4C1D95] focus:ring-1 focus:ring-[#4C1D95] transition-colors"
                  required
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-[#4C1D95] focus:ring-[#4C1D95]"
                  />
                  <span>Remember my session</span>
                </label>
                <span className="text-[11px] text-slate-400">Demo PIN: Any password</span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-[#4C1D95] hover:bg-[#3B0764] text-white font-semibold text-xs shadow-md transition-colors flex items-center justify-center gap-2 mt-2"
              >
                <span>Access Digital Library</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#F97316]" />
              </button>

              <div className="pt-4 text-center border-t border-slate-100">
                <p className="text-xs text-slate-600">
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegister(true);
                      setErrorMsg('');
                    }}
                    className="text-[#4C1D95] font-semibold hover:underline"
                  >
                    Create Account
                  </button>
                </p>
              </div>
            </form>
          ) : (
            /* Registration Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#1E293B] mb-0.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Sarthak Gujar"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-[#4C1D95]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#1E293B] mb-0.5">
                    Student ID
                  </label>
                  <input
                    type="text"
                    value={regStudentId}
                    onChange={(e) => setRegStudentId(e.target.value)}
                    placeholder="SIT-2024-CS-089"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-[#4C1D95]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#1E293B] mb-0.5">
                  Institutional Email
                </label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="sarthak.gujar@sit.ac.in"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-[#4C1D95]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#1E293B] mb-0.5">
                    Academic Department
                  </label>
                  <select
                    value={regDept}
                    onChange={(e) => setRegDept(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white text-[#1E293B] focus:ring-1 focus:ring-[#4C1D95]"
                  >
                    <option>Computer Science & Engineering</option>
                    <option>Artificial Intelligence & Data Science</option>
                    <option>Information Technology</option>
                    <option>Electronics & Telecommunications</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#1E293B] mb-0.5">
                    Academic Year
                  </label>
                  <select
                    value={regYear}
                    onChange={(e) => setRegYear(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white text-[#1E293B] focus:ring-1 focus:ring-[#4C1D95]"
                  >
                    <option>1st Year (Semester I & II)</option>
                    <option>2nd Year (Semester III & IV)</option>
                    <option>3rd Year (Semester V & VI)</option>
                    <option>4th Year (Semester VII & VIII)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#1E293B] mb-0.5">
                    Password
                  </label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Min. 6 chars"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-[#4C1D95]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#1E293B] mb-0.5">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-[#4C1D95]"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-[#4C1D95] hover:bg-[#3B0764] text-white font-semibold text-xs shadow-md transition-colors flex items-center justify-center gap-2 mt-4"
              >
                <span>Create Student Account</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#F97316]" />
              </button>

              <div className="pt-3 text-center border-t border-slate-100">
                <p className="text-xs text-slate-600">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegister(false);
                      setErrorMsg('');
                    }}
                    className="text-[#4C1D95] font-semibold hover:underline"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
