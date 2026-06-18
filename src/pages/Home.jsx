import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { db, doc, onSnapshot, updateDoc, safeStorage } from '../firebase/firebase';
import CarbonForm from '../components/CarbonForm';
import Dashboard from '../components/Dashboard';
import Challenges from '../components/Challenges';
import Leaderboard from '../components/Leaderboard';
import SustainabilityScore from '../components/SustainabilityScore';
import Quiz from '../components/Quiz';
import Offsetting from '../components/Offsetting';
import Roadmap from '../components/Roadmap';
import TravelSimulator from '../components/TravelSimulator';

function Home({ activeSection, setActiveSection }) {
  const { t, i18n } = useTranslation();
  const storedUser = JSON.parse(safeStorage.getItem('carbonUser') || 'null');
  const [userProfile, setUserProfile] = useState({ name: '', age: null });
  const [emissionData, setEmissionData] = useState({ daily: 0, weekly: 0, monthly: 0, transport: 0, diet: 0, electricity: 0 });
  const [weeklyHistory, setWeeklyHistory] = useState([
    { name: 'Mon', emissions: 14 },
    { name: 'Tue', emissions: 15 },
    { name: 'Wed', emissions: 14 },
    { name: 'Thu', emissions: 16 },
    { name: 'Fri', emissions: 13 },
    { name: 'Sat', emissions: 11 },
    { name: 'Sun', emissions: 12 }
  ]);
  const [activeChallenges, setActiveChallenges] = useState([]);
  const [completedChallenges, setCompletedChallenges] = useState([]);

  // Advanced States
  const [challengePoints, setChallengePoints] = useState(0);
  const [offsetTotal, setOffsetTotal] = useState(0);
  const [friends, setFriends] = useState([]);
  const [quizCompletedDate, setQuizCompletedDate] = useState('');
  const [emissionLogs, setEmissionLogs] = useState([]);
  const [roadmapProgress, setRoadmapProgress] = useState([]);

  const subSectionLabels = {
    en: { overview: 'Overview', quiz: 'Daily Quiz', offsetting: 'Offsetting', roadmap: 'Net-Zero Roadmap' },
    hi: { overview: 'सिंहावलोकन', quiz: 'दैनिक प्रश्नोत्तरी', offsetting: 'ऑफसेटिंग', roadmap: 'नेट-ज़ीरो रोडमैप' },
    te: { overview: 'సమీక్ష', quiz: 'రోజువారీ క్విజ్', offsetting: 'ఆఫ్సెటింగ్', roadmap: 'నెట్-జీరో కార్యాచరణ' },
    ta: { overview: 'கண்ணோட்டம்', quiz: 'தினசரி வினாடி வினா', offsetting: 'ஆஃப்செட்டிங்', roadmap: 'நிகர-பூஜ்ஜிய வழிகாட்டி' },
    kn: { overview: 'ಅವಲೋಕನ', quiz: 'ದೈನಂದಿನ ರಸಪ್ರಶ್ನೆ', offsetting: 'ಆಫ್‌ಸೆಟಿಂಗ್', roadmap: 'ನೆಟ್-ಝೀರೋ ರೋಡ್‌ಮ್ಯಾಪ್' },
    ml: { overview: 'അവലോകനം', quiz: 'ദിനപത്ര ക്വിസ്', offsetting: 'ഓഫ്സെറ്റിംഗ്', roadmap: 'നെറ്റ്-സീറോ റോഡ്മാപ്പ്' }
  };
  const langSub = (i18n.language || 'en').split('-')[0];
  const secLabels = subSectionLabels[langSub] || subSectionLabels.en;

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
      if (data.weeklyHistory) {
        setWeeklyHistory(data.weeklyHistory);
      }
      if (data.activeChallenges) {
        setActiveChallenges(data.activeChallenges);
      }
      if (data.completedChallenges) {
        setCompletedChallenges(data.completedChallenges);
      }
      if (data.challengePoints !== undefined) {
        setChallengePoints(data.challengePoints);
      }
      if (data.offsetTotal !== undefined) {
        setOffsetTotal(data.offsetTotal);
      }
      if (data.friends !== undefined) {
        setFriends(data.friends);
      }
      if (data.quizCompletedDate !== undefined) {
        setQuizCompletedDate(data.quizCompletedDate);
      }
      if (data.emissionLogs !== undefined) {
        setEmissionLogs(data.emissionLogs);
      }
      if (data.roadmapProgress !== undefined) {
        setRoadmapProgress(data.roadmapProgress);
      }

      safeStorage.setItem(
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
    const challengeBonus = (completedChallenges || []).length * 4;
    const offsetBonus = Math.floor((offsetTotal || 0) / 5) * 2;
    const roadmapBonus = (roadmapProgress || []).length * 1.5;
    
    const computed = Math.max(40, Math.min(100, Math.round(base + challengeBonus + offsetBonus + roadmapBonus)));
    return computed;
  }, [emissionData.daily, emissionData.weekly, emissionData.monthly, completedChallenges, offsetTotal, roadmapProgress]);

  const handleUpdate = async (result) => {
    setEmissionData(result);
    
    const todayStr = new Date().toISOString().split('T')[0];
    
    let updatedLogs = [...emissionLogs];
    const existingIndex = updatedLogs.findIndex(log => log.date === todayStr);
    
    if (existingIndex >= 0) {
      updatedLogs[existingIndex] = { date: todayStr, ...result };
    } else {
      updatedLogs.push({ date: todayStr, ...result });
    }
    setEmissionLogs(updatedLogs);

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const currentDay = days[new Date().getDay()];
    
    const updatedHistory = weeklyHistory.map(item => {
      if (item.name.toLowerCase() === currentDay.toLowerCase()) {
        return { ...item, emissions: result.daily };
      }
      return item;
    });
    setWeeklyHistory(updatedHistory);

    if (storedUser?.uid) {
      const userRef = doc(db, 'users', storedUser.uid);
      const baseScore = Math.max(40, Math.min(100, Math.round(100 - result.daily * 2)));
      const challengeBonus = (completedChallenges || []).length * 4;
      const offsetBonus = Math.floor((offsetTotal || 0) / 5) * 2;
      const roadmapBonus = (roadmapProgress || []).length * 1.5;
      const finalScore = Math.max(40, Math.min(100, Math.round(baseScore + challengeBonus + offsetBonus + roadmapBonus)));
      
      await updateDoc(userRef, { 
        emissionData: result, 
        sustainabilityScore: finalScore,
        weeklyHistory: updatedHistory,
        emissionLogs: updatedLogs
      });
    }
  };

  const handleChallengeAction = async (challengeId, action) => {
    if (!storedUser?.uid) return;
    const userRef = doc(db, 'users', storedUser.uid);
    
    let updatedActive = [...activeChallenges];
    let updatedCompleted = [...completedChallenges];
    let pointsAwarded = 0;
    
    if (action === 'accept') {
      if (!updatedActive.includes(challengeId)) {
        updatedActive.push(challengeId);
      }
    } else if (action === 'complete') {
      updatedActive = updatedActive.filter(c => c !== challengeId);
      if (!updatedCompleted.includes(challengeId)) {
        updatedCompleted.push(challengeId);
        const payout = { noCarWeek: 50, zeroPlasticChallenge: 30, treePlantation: 80 };
        pointsAwarded = payout[challengeId] || 40;
      }
    }
    
    const newPoints = challengePoints + pointsAwarded;
    setChallengePoints(newPoints);

    const baseScore = Math.max(40, Math.min(100, Math.round(100 - emissionData.daily * 2)));
    const challengeBonus = updatedCompleted.length * 4;
    const offsetBonus = Math.floor(offsetTotal / 5) * 2;
    const roadmapBonus = (roadmapProgress || []).length * 1.5;
    const finalScore = Math.max(40, Math.min(100, Math.round(baseScore + challengeBonus + offsetBonus + roadmapBonus)));
    
    await updateDoc(userRef, {
      activeChallenges: updatedActive,
      completedChallenges: updatedCompleted,
      challengePoints: newPoints,
      sustainabilityScore: finalScore
    });
  };

  const handleQuizComplete = async (pointsEarned) => {
    if (!storedUser?.uid) return;
    const userRef = doc(db, 'users', storedUser.uid);
    const todayStr = new Date().toISOString().split('T')[0];

    const newPoints = challengePoints + pointsEarned;
    setChallengePoints(newPoints);
    setQuizCompletedDate(todayStr);

    const baseScore = Math.max(40, Math.min(100, Math.round(100 - emissionData.daily * 2)));
    const challengeBonus = (completedChallenges || []).length * 4;
    const offsetBonus = Math.floor(offsetTotal / 5) * 2;
    const roadmapBonus = (roadmapProgress || []).length * 1.5;
    const finalScore = Math.max(40, Math.min(100, Math.round(baseScore + challengeBonus + offsetBonus + roadmapBonus)));

    await updateDoc(userRef, {
      challengePoints: newPoints,
      quizCompletedDate: todayStr,
      sustainabilityScore: finalScore
    });
  };

  const handleOffsetPurchase = async (cost, offsetAmount) => {
    if (!storedUser?.uid) return;
    const userRef = doc(db, 'users', storedUser.uid);

    const newPoints = challengePoints - cost;
    const newOffset = offsetTotal + offsetAmount;
    setChallengePoints(newPoints);
    setOffsetTotal(newOffset);

    const baseScore = Math.max(40, Math.min(100, Math.round(100 - emissionData.daily * 2)));
    const challengeBonus = (completedChallenges || []).length * 4;
    const offsetBonus = Math.floor(newOffset / 5) * 2;
    const roadmapBonus = (roadmapProgress || []).length * 1.5;
    const finalScore = Math.max(40, Math.min(100, Math.round(baseScore + challengeBonus + offsetBonus + roadmapBonus)));

    await updateDoc(userRef, {
      challengePoints: newPoints,
      offsetTotal: newOffset,
      sustainabilityScore: finalScore
    });
  };

  const handleToggleRoadmapTask = async (taskId) => {
    if (!storedUser?.uid) return;
    const userRef = doc(db, 'users', storedUser.uid);

    let updatedProgress = [...roadmapProgress];
    if (updatedProgress.includes(taskId)) {
      updatedProgress = updatedProgress.filter(id => id !== taskId);
    } else {
      updatedProgress.push(taskId);
    }
    setRoadmapProgress(updatedProgress);

    const baseScore = Math.max(40, Math.min(100, Math.round(100 - emissionData.daily * 2)));
    const challengeBonus = (completedChallenges || []).length * 4;
    const offsetBonus = Math.floor(offsetTotal / 5) * 2;
    const roadmapBonus = updatedProgress.length * 1.5;
    const finalScore = Math.max(40, Math.min(100, Math.round(baseScore + challengeBonus + offsetBonus + roadmapBonus)));

    await updateDoc(userRef, {
      roadmapProgress: updatedProgress,
      sustainabilityScore: finalScore
    });
  };

  const handleAddFriend = async (email) => {
    if (!storedUser?.uid) return;
    const userRef = doc(db, 'users', storedUser.uid);
    const newFriends = [...friends, email];
    setFriends(newFriends);
    await updateDoc(userRef, { friends: newFriends });
  };

  return (
    <div className="space-y-8">
      {/* Header Profile Info */}
      <section className="rounded-3xl border border-slate-800/80 bg-slate-900/40 p-6 shadow-2xl backdrop-blur-md">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-400">
                {t('welcomeBack')}{userProfile.name ? `, ${userProfile.name}` : ''}
              </p>
            </div>
            <h1 className="mt-4 text-4xl font-extrabold text-slate-100 tracking-tight sm:text-5xl leading-tight">
              {t('trackYourFootprint')}
            </h1>
            <p className="mt-4 max-w-xl text-sm text-slate-400 leading-relaxed">
              {userProfile.age ? `${t('age')} ${userProfile.age} • ` : ''}{t('useDailyPlanning')}
            </p>
          </div>
          
          <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 text-slate-100 shadow-2xl shadow-slate-950/40">
            <div className="space-y-4">
              <div className="rounded-2xl bg-slate-950/60 border border-slate-900 p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500 flex items-center gap-1.5">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
                  </svg>
                  {t('currentStats')}
                </p>
                <div className="mt-3.5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl bg-slate-900/60 border border-slate-850 p-3 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{t('daily')}</p>
                    <p className="mt-2 text-2xl font-bold text-emerald-300">
                      {emissionData.daily} <span className="text-xs text-slate-400">{t('kg')}</span>
                    </p>
                  </div>
                  <div className="rounded-xl bg-slate-900/60 border border-slate-850 p-3 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{t('weekly')}</p>
                    <p className="mt-2 text-2xl font-bold text-emerald-300">
                      {emissionData.weekly} <span className="text-xs text-slate-400">{t('kg')}</span>
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="flex-1 rounded-2xl bg-emerald-500/10 border border-emerald-500/10 p-4 text-slate-300 flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17 8C8 10 5.9 16.1 5.9 16.1S3 14 3 10C3 5 8 3 13 3C18 3 21 6.5 21 10.5C21 14.5 17 19.5 13 21C15 17 17 12 17 8Z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Eco Score</p>
                    <p className="mt-1 text-2xl font-extrabold text-emerald-300">{score}</p>
                  </div>
                </div>
                <div className="flex-1 rounded-2xl bg-sky-500/10 border border-sky-500/10 p-4 text-slate-300 flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Points</p>
                    <p className="mt-1 text-2xl font-extrabold text-sky-300">{challengePoints}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Tab Panels */}
      {activeSection === 'overview' && (
        <>
          <div className="grid gap-8 xl:grid-cols-[0.9fr_0.7fr]">
            <CarbonForm onUpdate={handleUpdate} />
            <div className="space-y-6">
              <SustainabilityScore score={score} emissions={emissionData} />
              <Challenges 
                activeChallenges={activeChallenges} 
                completedChallenges={completedChallenges} 
                onAction={handleChallengeAction} 
              />
            </div>
          </div>
          <Dashboard score={score} emissions={emissionData} weeklyHistory={weeklyHistory} emissionLogs={emissionLogs} />
        </>
      )}

      {activeSection === 'quiz' && (
        <Quiz 
          challengePoints={challengePoints} 
          quizCompletedDate={quizCompletedDate} 
          onComplete={handleQuizComplete} 
        />
      )}

      {activeSection === 'offset' && (
        <Offsetting 
          challengePoints={challengePoints} 
          offsetTotal={offsetTotal} 
          onPurchase={handleOffsetPurchase} 
        />
      )}

      {activeSection === 'roadmap' && (
        <div className="grid gap-8 xl:grid-cols-[0.9fr_0.7fr]">
          <Roadmap 
            roadmapProgress={roadmapProgress} 
            onToggleTask={handleToggleRoadmapTask} 
          />
          <div className="space-y-6">
            <TravelSimulator />
          </div>
        </div>
      )}

      <Leaderboard 
        friends={friends} 
        userEmail={storedUser?.email || ''} 
        onAddFriend={handleAddFriend} 
      />
    </div>
  );
}

export default Home;
