import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';

function Register() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        name: name || 'Anonymous',
        age: Number(age) || null,
        createdAt: new Date().toISOString(),
        sustainabilityScore: 72
      });
      localStorage.setItem(
        'carbonUser',
        JSON.stringify({ uid: user.uid, email: user.email, name: name || 'Anonymous', age: Number(age) || null })
      );
      window.location.href = '/';
    } catch (authError) {
      const message = authError?.code || authError?.message || 'Registration failed. Please try again.';
      let friendly = 'Registration failed. Please try again with a valid email and password.';

      if (message.includes('auth/email-already-in-use')) {
        friendly = 'This email is already registered. Please log in instead.';
      } else if (message.includes('auth/invalid-email')) {
        friendly = 'Please enter a valid email address.';
      } else if (message.includes('auth/weak-password')) {
        friendly = 'Password is too weak. Use at least 6 characters.';
      } else if (message.includes('auth/network-request-failed')) {
        friendly = 'Network error. Check your internet connection.';
      } else if (message.includes('auth/configuration-not-found')) {
        friendly = 'Firebase is not fully configured. Enable Email/Password auth in your Firebase console.';
      }

      setError(friendly);
      console.error('Register error:', authError);
    }
  };

  return (
    <div className="mx-auto max-w-xl rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-xl shadow-slate-950/30">
      <h1 className="text-3xl font-semibold text-emerald-300">Register</h1>
      <p className="mt-2 text-slate-400">Create an account to log your footprint and climb the leaderboard.</p>
      <form onSubmit={handleRegister} className="mt-8 space-y-6">
        <label className="block text-sm text-slate-300">
          Name
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            className="mt-2 w-full px-4 py-3"
          />
        </label>
        <label className="block text-sm text-slate-300">
          Age
          <input
            type="number"
            min="1"
            value={age}
            onChange={(event) => setAge(event.target.value)}
            required
            className="mt-2 w-full px-4 py-3"
          />
        </label>
        <label className="block text-sm text-slate-300">
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="mt-2 w-full px-4 py-3"
          />
        </label>
        <label className="block text-sm text-slate-300">
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={6}
            required
            className="mt-2 w-full px-4 py-3"
          />
        </label>
        {error && <p className="text-sm text-rose-400">{error}</p>}
        <button type="submit" className="w-full rounded-3xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400">
          Create Account
        </button>
      </form>
    </div>
  );
}

export default Register;
