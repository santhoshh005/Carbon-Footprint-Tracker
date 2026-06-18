import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db, signInWithEmailAndPassword, doc, getDoc, safeStorage } from '../firebase/firebase';

function Login({ onLogin }) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const data = userDoc.exists() ? userDoc.data() : {};
      safeStorage.setItem(
        'carbonUser',
        JSON.stringify({
          uid: user.uid,
          email: user.email,
          name: data.name || '',
          age: data.age || null,
          emissionData: data.emissionData || null
        })
      );
      if (onLogin) onLogin();
      navigate('/');
    } catch (authError) {
      const message = authError?.code || authError?.message || t('loginError');
      let friendly = t('loginError');

      if (message.includes('auth/user-not-found')) {
        friendly = t('userNotFound');
      } else if (message.includes('auth/wrong-password')) {
        friendly = t('wrongPassword');
      } else if (message.includes('auth/invalid-email')) {
        friendly = t('invalidEmail');
      } else if (message.includes('auth/network-request-failed')) {
        friendly = t('networkError');
      } else if (message.includes('auth/too-many-requests')) {
        friendly = t('tooManyAttempts');
      }

      setError(friendly);
      console.error('Login error:', authError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-[calc(100vh-130px)] items-center lg:grid-cols-12 gap-12 py-6">
      
      {/* Left Column - Showcase Visuals */}
      <div className="lg:col-span-6 hidden lg:flex flex-col justify-center space-y-8 pr-4">
        <div>
          <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
            {t('modernGreenUI')}
          </span>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-100 sm:text-5xl">
            Empowering Your <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Net-Zero Journey</span>
          </h1>
          <p className="mt-4 text-base text-slate-400 leading-relaxed max-w-lg">
            Track personal carbon emissions, participate in community challenges, and purchase offsets inside our premium interactive sandbox.
          </p>
        </div>

        {/* Abstract Telemetry Graphic */}
        <div className="relative flex items-center justify-center w-full h-[360px] rounded-3xl border border-slate-800/40 bg-slate-900/20 backdrop-blur-lg overflow-hidden shadow-2xl">
          {/* Glowing Radial Orb */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.08)_0,transparent_65%)]" />
          
          {/* Rotating Dashed Rings */}
          <div className="absolute w-60 h-60 border border-dashed border-emerald-500/20 rounded-full animate-[spin_40s_linear_infinite]" />
          <div className="absolute w-72 h-72 border border-dashed border-slate-800 rounded-full animate-[spin_60s_linear_infinite_reverse]" />
          
          {/* Center Gauge dial */}
          <div className="relative flex flex-col items-center justify-center w-44 h-44 rounded-full border border-emerald-500/20 bg-slate-950/90 shadow-2xl shadow-emerald-500/5 animate-float">
            <svg className="absolute inset-0 -rotate-90 w-full h-full" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" stroke="#0f172a" strokeWidth="4" fill="transparent" />
              <circle 
                cx="50" 
                cy="50" 
                r="42" 
                stroke="url(#dial-grad)" 
                strokeWidth="5" 
                fill="transparent" 
                strokeDasharray="263" 
                strokeDashoffset="65" 
                strokeLinecap="round" 
              />
              <defs>
                <linearGradient id="dial-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#14b8a6" />
                </linearGradient>
              </defs>
            </svg>
            <span className="text-[10px] font-semibold tracking-[0.24em] text-slate-500 uppercase">Eco Score</span>
            <span className="text-4xl font-extrabold text-white mt-1">72</span>
            <span className="text-[10px] text-emerald-400 font-semibold mt-1">▲ Elite Tier</span>
          </div>

          {/* Floating Widget 1 */}
          <div className="absolute top-8 left-8 p-3 rounded-2xl border border-slate-800/80 bg-slate-950/80 backdrop-blur-md shadow-lg animate-float-delayed flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-wider text-slate-500">Live Simulator</p>
              <p className="text-xs font-bold text-slate-200">-5.2 kg CO₂</p>
            </div>
          </div>

          {/* Floating Widget 2 */}
          <div className="absolute bottom-8 right-8 p-3 rounded-2xl border border-slate-800/80 bg-slate-950/80 backdrop-blur-md shadow-lg animate-float flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-wider text-slate-500">Net-Zero Plan</p>
              <p className="text-xs font-bold text-slate-200">Week 2 Active</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Login Form */}
      <div className="lg:col-span-6 w-full max-w-md mx-auto">
        <div className="rounded-3xl border border-slate-800/80 bg-slate-900/50 p-8 shadow-2xl backdrop-blur-lg">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-100">{t('loginTitle')}</h2>
            <p className="mt-2 text-sm text-slate-400">{t('loginDescription')}</p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                {t('email')}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@company.com"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-slate-950/40 border border-slate-800 rounded-2xl focus:border-emerald-500/40 focus:ring-emerald-500/10 focus:outline-none transition-all duration-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                {t('password')}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-slate-950/40 border border-slate-800 rounded-2xl focus:border-emerald-500/40 focus:ring-emerald-500/10 focus:outline-none transition-all duration-300"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-2xl bg-rose-500/10 border border-rose-500/20 p-3 text-sm text-rose-400 flex items-center gap-2">
                <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center rounded-2xl bg-emerald-500 hover:bg-emerald-400 px-5 py-3.5 text-sm font-semibold text-slate-950 transition duration-300 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-slate-950" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Verifying...</span>
                </div>
              ) : (
                t('signIn')
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-400">
            <span>New to CarbonWise? </span>
            <Link to="/register" className="font-semibold text-emerald-400 hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Login;
