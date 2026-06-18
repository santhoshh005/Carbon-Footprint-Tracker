import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { auth, signOut, safeStorage } from '../firebase/firebase';
import LanguageSelector from './LanguageSelector';

function Navbar({ activeSection, setActiveSection, isAuthenticated, onLogout }) {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout failed', error);
    }
    safeStorage.removeItem('carbonUser');
    if (onLogout) onLogout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <div className="rounded-xl bg-emerald-500/10 p-2 border border-emerald-500/20 group-hover:border-emerald-500/40 transition-all duration-350">
            <svg 
              className="h-5 w-5 text-emerald-400 group-hover:scale-110 transition-transform duration-350" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M17 8C8 10 5.9 16.1 5.9 16.1S3 14 3 10C3 5 8 3 13 3C18 3 21 6.5 21 10.5C21 14.5 17 19.5 13 21C15 17 17 12 17 8Z" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-400 bg-clip-text text-transparent hidden sm:inline">
            {t('carbonFootprintTracker')}
          </span>
        </Link>
        
        <div className="flex items-center gap-4">
          <nav className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
            {isAuthenticated ? (
              <>
                {/* Home link representing Overview */}
                <Link
                  to="/"
                  onClick={() => setActiveSection('overview')}
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 transition-all duration-300 ${
                    location.pathname === '/' && activeSection === 'overview'
                      ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 scale-[1.01]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                  }`}
                >
                  <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  HOME
                </Link>

                <button
                  type="button"
                  onClick={() => setActiveSection('quiz')}
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 transition-all duration-300 ${
                    activeSection === 'quiz'
                      ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 scale-[1.01]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                  }`}
                >
                  <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  DAILY QUIZ
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSection('offset')}
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 transition-all duration-300 ${
                    activeSection === 'offset'
                      ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 scale-[1.01]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                  }`}
                >
                  <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 10C12 10 13.5 6.5 17 6.5C17 10 13.5 12 13.5 12M12 10C12 10 10.5 6.5 7 6.5C7 10 10.5 12 10.5 12M12 21V10" />
                  </svg>
                  OFFSETTING
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSection('roadmap')}
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 transition-all duration-300 ${
                    activeSection === 'roadmap'
                      ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 scale-[1.01]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                  }`}
                >
                  <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  NET-ZERO ROADMAP
                </button>

                {/* Divider */}
                <div className="h-5 w-[1px] bg-slate-800/80 mx-1 hidden md:block"></div>

                {/* Logout button */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full bg-slate-800 border border-slate-700 hover:border-rose-500/40 text-slate-300 hover:text-rose-400 px-4 py-2 transition-all duration-300 active:scale-95"
                >
                  {t('logout')}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`rounded-full px-4 py-2 font-medium transition-all duration-300 ${
                    location.pathname === '/login'
                      ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 scale-[1.02]'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-slate-100'
                  }`}
                >
                  {t('login')}
                </Link>
                <Link
                  to="/register"
                  className={`rounded-full px-4 py-2 font-medium transition-all duration-300 ${
                    location.pathname === '/register'
                      ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 scale-[1.02]'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-slate-100'
                  }`}
                >
                  {t('register')}
                </Link>
              </>
            )}
          </nav>
          <div className="h-5 w-[1px] bg-slate-800"></div>
          <LanguageSelector />
        </div>
      </div>
    </header>
  );
}

export default Navbar;
