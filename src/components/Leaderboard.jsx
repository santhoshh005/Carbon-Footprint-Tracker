import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { collection, onSnapshot, orderBy, query, limit } from 'firebase/firestore';
import { db } from '../firebase/firebase';

function Leaderboard() {
  const { t } = useTranslation();
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    const usersQuery = query(collection(db, 'users'), orderBy('sustainabilityScore', 'desc'), limit(5));
    const unsubscribe = onSnapshot(usersQuery, (snapshot) => {
      setLeaders(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return unsubscribe;
  }, []);

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl shadow-slate-950/25">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-emerald-300">{t('leaderboard')}</h2>
          <p className="text-sm text-slate-400">{t('rankBySustainability')}</p>
        </div>
        <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs text-emerald-200">{t('topUsers')}</span>
      </div>
      <div className="space-y-3">
        {leaders.length > 0 ? (
          leaders.map((user, index) => (
            <div
              key={user.id}
              className="flex items-center justify-between rounded-3xl border border-slate-800 bg-slate-950/80 px-5 py-4"
            >
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">#{index + 1}</p>
                <p className="text-lg font-semibold text-slate-100">{user.name || user.email || 'Anonymous'}</p>
              </div>
              <div className="rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-300">
                {user.sustainabilityScore ?? 0}
              </div>
            </div>
          ))
        ) : (
          <p className="rounded-3xl border border-slate-800 bg-slate-950/80 px-5 py-4 text-sm text-slate-400">{t('noLeaderboardData')}</p>
        )}
      </div>
    </section>
  );
}

export default Leaderboard;
