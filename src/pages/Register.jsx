import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db, createUserWithEmailAndPassword, doc, setDoc, safeStorage } from '../firebase/firebase';

function Register({ onLogin }) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        name: name || 'Anonymous',
        age: Number(age) || null,
        createdAt: new Date().toISOString(),
        sustainabilityScore: 72,
        emissionData: { daily: 0, weekly: 0, monthly: 0, transport: 0, diet: 0, electricity: 0 },
        weeklyHistory: [
          { name: 'Mon', emissions: 14 },
          { name: 'Tue', emissions: 15 },
          { name: 'Wed', emissions: 14 },
          { name: 'Thu', emissions: 16 },
          { name: 'Fri', emissions: 13 },
          { name: 'Sat', emissions: 11 },
          { name: 'Sun', emissions: 12 }
        ],
        activeChallenges: [],
        completedChallenges: []
      });
      safeStorage.setItem(
        'carbonUser',
        JSON.stringify({ uid: user.uid, email: user.email, name: name || 'Anonymous', age: Number(age) || null })
      );
      if (onLogin) onLogin();
      navigate('/');
    } catch (authError) {
      const message = authError?.code || authError?.message || t('registerError');
      let friendly = t('registerError');

      if (message.includes('auth/email-already-in-use')) {
        friendly = t('emailExists');
      } else if (message.includes('auth/invalid-email')) {
        friendly = t('invalidEmail');
      } else if (message.includes('auth/weak-password')) {
        friendly = t('weakPassword');
      } else if (message.includes('auth/network-request-failed')) {
        friendly = t('networkError');
      } else if (message.includes('auth/configuration-not-found')) {
        friendly = t('firebaseNotConfigured');
      }

      setError(friendly);
      console.error('Register error:', authError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-[calc(100vh-130px)] items-center lg:grid-cols-12 gap-12 py-6">
      
      {/* Left Column - Key Features Showcase */}
      <div className="lg:col-span-6 hidden lg:flex flex-col justify-center space-y-6 pr-4">
        <div>
          <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
            CarbonWise AI Core features
          </span>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-100 sm:text-5xl">
            Why join our <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Eco Community?</span>
          </h1>
          <p className="mt-4 text-base text-slate-400 leading-relaxed max-w-lg">
            Track, gamify, and offset your ecological footprint using our premium sustainability toolkit.
          </p>
        </div>

        {/* Highlight Feature Cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/10 p-5 shadow-lg flex flex-col justify-between hover:border-emerald-500/20 transition-all duration-300">
            <div className="p-3 w-fit rounded-xl bg-emerald-500/10 text-emerald-400">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-bold text-slate-200">Telemetry Formula Matrix</h3>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">View transparent, real-time math calculations backing your scores.</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/10 p-5 shadow-lg flex flex-col justify-between hover:border-emerald-500/20 transition-all duration-300">
            <div className="p-3 w-fit rounded-xl bg-teal-500/10 text-teal-400">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-bold text-slate-200">Travel Simulator Sandbox</h3>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">Slide distances to simulate transport selections and carbon savings.</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/10 p-5 shadow-lg flex flex-col justify-between hover:border-emerald-500/20 transition-all duration-300">
            <div className="p-3 w-fit rounded-xl bg-sky-500/10 text-sky-400">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-bold text-slate-200">4-Week Net-Zero Roadmap</h3>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">Follow structured weekly targets to systematically bring emissions down.</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/10 p-5 shadow-lg flex flex-col justify-between hover:border-emerald-500/20 transition-all duration-300">
            <div className="p-3 w-fit rounded-xl bg-indigo-500/10 text-indigo-400">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h2a2.5 2.5 0 002.5-2.5V14m-3 1.5a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-bold text-slate-200">Interactive Offsetting</h3>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">Invest points earned from eco challenges to purchase virtual carbon offsets.</p>
            </div>
          </div>

        </div>
      </div>

      {/* Right Column - Register Form */}
      <div className="lg:col-span-6 w-full max-w-md mx-auto">
        <div className="rounded-3xl border border-slate-800/80 bg-slate-900/50 p-8 shadow-2xl backdrop-blur-lg">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-100">{t('registerTitle')}</h2>
            <p className="mt-2 text-sm text-slate-400">{t('registerDescription')}</p>
          </div>

          <form onSubmit={handleRegister} className="mt-8 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                {t('name')}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="John Doe"
                  required
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-950/40 border border-slate-800 rounded-2xl focus:border-emerald-500/40 focus:ring-emerald-500/10 focus:outline-none transition-all duration-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                {t('age')}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </span>
                <input
                  type="number"
                  min="1"
                  value={age}
                  onChange={(event) => setAge(event.target.value)}
                  placeholder="25"
                  required
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-950/40 border border-slate-800 rounded-2xl focus:border-emerald-500/40 focus:ring-emerald-500/10 focus:outline-none transition-all duration-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                {t('email')}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@company.com"
                  required
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-950/40 border border-slate-800 rounded-2xl focus:border-emerald-500/40 focus:ring-emerald-500/10 focus:outline-none transition-all duration-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                {t('password')}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  minLength={6}
                  required
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-950/40 border border-slate-800 rounded-2xl focus:border-emerald-500/40 focus:ring-emerald-500/10 focus:outline-none transition-all duration-300"
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
              className="w-full flex items-center justify-center rounded-2xl bg-emerald-500 hover:bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition duration-300 disabled:opacity-50 mt-2"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-slate-950" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Creating Account...</span>
                </div>
              ) : (
                t('createAccount')
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-400">
            <span>Already have an account? </span>
            <Link to="/login" className="font-semibold text-emerald-400 hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Register;
