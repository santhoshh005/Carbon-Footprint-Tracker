import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import LanguageSelector from './LanguageSelector';

function Navbar() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('carbonUser');

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout failed', error);
    }
    localStorage.removeItem('carbonUser');
    navigate('/login');
  };

  const navItems = isAuthenticated
    ? [{ path: '/', label: t('home') }]
    : [
        { path: '/login', label: t('login') },
        { path: '/register', label: t('register') }
      ];

  return (
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" className="text-xl font-semibold tracking-tight text-emerald-300">
          {t('carbonFootprintTracker')}
        </Link>
        <div className="flex items-center gap-6">
          <nav className="flex items-center gap-4 text-sm text-slate-300">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`rounded-full px-4 py-2 transition ${
                  location.pathname === item.path
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'hover:bg-slate-800 hover:text-slate-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="rounded-full bg-emerald-500 px-4 py-2 text-slate-950 transition hover:bg-emerald-400"
              >
                {t('logout')}
              </button>
            )}
          </nav>
          <LanguageSelector />
        </div>
      </div>
    </header>
  );
}

export default Navbar;
