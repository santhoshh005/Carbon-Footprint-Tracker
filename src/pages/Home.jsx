import { useEffect, useMemo, useState } from 'react';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import CarbonForm from '../components/CarbonForm';
import Dashboard from '../components/Dashboard';
import Challenges from '../components/Challenges';
import Leaderboard from '../components/Leaderboard';
import SustainabilityScore from '../components/SustainabilityScore';

function Home() {
  const storedUser = JSON.parse(localStorage.getItem('carbonUser') || 'null');
  const [userProfile, setUserProfile] = useState({ name: '', age: null });
  const [emissionData, setEmissionData] = useState({ daily: 0, weekly: 0, monthly: 0, transport: 0, diet: 0, electricity: 0 });

  useEffect(() => {
    if (!storedUser?.uid) return;

    const userRef = doc(db, 'users', storedUser.uid);
    const unsubscribe = onSnapshot(userRef, (snapshot) => {
      if (!snapshot.exists()) return;
      const data = snapshot.data();

      setUserProfile({ name: data.name || '', age: data.age || null });
      if (data.emissionData) {
        setEmissionData(data.emissionData);
      }

      localStorage.setItem(
        'carbonUser',
        JSON.stringify({
          uid: storedUser.uid,
          email: storedUser.email,
          name: data.name || '',
          age: data.age || null,
          emissionData: data.emissionData || null
        })
      );
    });

    return unsubscribe;
  }, [storedUser?.uid, storedUser?.email]);

  const score = useMemo(() => {
    if (!emissionData.daily && !emissionData.weekly && !emissionData.monthly) return 0;
    const base = 100 - emissionData.daily * 2;
    const computed = Math.max(40, Math.min(100, Math.round(base)));
    return computed;
  }, [emissionData.daily, emissionData.weekly, emissionData.monthly]);

  const handleUpdate = async (result) => {
    setEmissionData(result);
    if (storedUser?.uid) {
      const userRef = doc(db, 'users', storedUser.uid);
      const newScore = Math.max(40, Math.min(100, Math.round(100 - result.daily * 2)));
      await updateDoc(userRef, { emissionData: result, sustainabilityScore: newScore });
    }
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl shadow-slate-950/25">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-emerald-400">
              Welcome back{userProfile.name ? `, ${userProfile.name}` : ''}
            </p>
            <h1 className="mt-4 text-4xl font-semibold text-slate-100 sm:text-5xl">Track your carbon footprint with insights and challenges.</h1>
            <p className="mt-4 max-w-2xl text-slate-400">
              {userProfile.age ? `Age ${userProfile.age} • ` : ''}Use daily planning, sustainable lifestyle tips, and friendly competition to lower your emissions.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 text-slate-100 shadow-2xl shadow-slate-950/40">
            <div className="space-y-4">
              <div className="rounded-3xl bg-slate-950/80 p-5">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Current Stats</p>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-slate-900/80 p-4 text-center">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Daily</p>
                    <p className="mt-3 text-3xl font-semibold text-emerald-300">{emissionData.daily} kg</p>
                  </div>
                  <div className="rounded-3xl bg-slate-900/80 p-4 text-center">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Weekly</p>
                    <p className="mt-3 text-3xl font-semibold text-emerald-300">{emissionData.weekly} kg</p>
                  </div>
                </div>
              </div>
              <div className="rounded-3xl bg-emerald-500/10 p-5 text-slate-300">
                <p className="text-sm uppercase tracking-[0.24em] text-emerald-300">Sustainability Score</p>
                <p className="mt-4 text-5xl font-bold text-emerald-300">{score}</p>
                <p className="mt-2 text-sm text-slate-400">Your score improves as you reduce transport, diet, and electricity emissions.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-8 xl:grid-cols-[0.9fr_0.7fr]">
        <CarbonForm onUpdate={handleUpdate} />
        <div className="space-y-6">
          <SustainabilityScore score={score} />
          <Challenges />
        </div>
      </div>
      <Dashboard score={score} />
      <Leaderboard />
    </div>
  );
}

export default Home;
