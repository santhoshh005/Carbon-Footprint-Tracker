import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';

function Login() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const data = userDoc.exists() ? userDoc.data() : {};
      localStorage.setItem(
        'carbonUser',
        JSON.stringify({
          uid: user.uid,
          email: user.email,
          name: data.name || '',
          age: data.age || null,
          emissionData: data.emissionData || null
        })
      );
      window.location.href = '/';
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
    }
  };

  return (
    <div className="mx-auto max-w-xl rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-xl shadow-slate-950/30">
      <h1 className="text-3xl font-semibold text-emerald-300">{t('loginTitle')}</h1>
      <p className="mt-2 text-slate-400">{t('loginDescription')}</p>
      <form onSubmit={handleLogin} className="mt-8 space-y-6">
        <label className="block text-sm text-slate-300">
          {t('email')}
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="mt-2 w-full px-4 py-3"
          />
        </label>
        <label className="block text-sm text-slate-300">
          {t('password')}
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="mt-2 w-full px-4 py-3"
          />
        </label>
        {error && <p className="text-sm text-rose-400">{error}</p>}
        <button type="submit" className="w-full rounded-3xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400">
          {t('signIn')}
        </button>
      </form>
    </div>
  );
}

export default Login;
