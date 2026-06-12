import { Link, useLocation, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase';

function Navbar() {
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
    ? [{ path: '/', label: 'Home' }]
    : [
        { path: '/login', label: 'Login' },
        { path: '/register', label: 'Register' }
      ];

  return (
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" className="text-xl font-semibold tracking-tight text-emerald-300">
          Carbon Footprint Tracker
        </Link>
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
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
