import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { db, collection, onSnapshot, orderBy, query, limit } from '../firebase/firebase';

function Leaderboard({ friends = [], userEmail = '', onAddFriend }) {
  const { t, i18n } = useTranslation();
  const [leaders, setLeaders] = useState([]);
  const [activeTab, setActiveTab] = useState('global');
  const [friendEmailInput, setFriendEmailInput] = useState('');
  const [feedback, setFeedback] = useState('');

  const lang = (i18n.language || 'en').split('-')[0];

  const localLabels = {
    en: { global: 'Global', friends: 'Friends', addFriend: 'Add Friend', friendEmail: "Enter friend's email", addedSuccess: 'Friend added!', alreadyFriend: 'Already added' },
    hi: { global: 'वैश्विक', friends: 'मित्र', addFriend: 'मित्र जोड़ें', friendEmail: 'मित्र का ईमेल दर्ज करें', addedSuccess: 'मित्र जोड़ा गया!', alreadyFriend: 'पहले से ही मित्र हैं' },
    te: { global: 'ప్రపంచ', friends: 'స్నేహితులు', addFriend: 'స్నేహితుడిని జోడించు', friendEmail: 'స్నేహితుడి ఈమెయిల్ రాయండి', addedSuccess: 'స్నేహితుడు జోడించబడ్డారు!', alreadyFriend: 'ఇప్పటికే జోడించారు' },
    ta: { global: 'உலகளாவிய', friends: 'நண்பர்கள்', addFriend: 'நண்பரைச் சேர்', friendEmail: 'நண்பரின் மின்னஞ்சலை உள்ளிடவும்', addedSuccess: 'நண்பர் சேர்க்கப்பட்டார்!', alreadyFriend: 'ஏற்கனவே நண்பர்' },
    kn: { global: 'ಜಾಗತಿಕ', friends: 'ಸ್ನೇಹಿತರು', addFriend: 'ಸ್ನೇಹಿತರನ್ನು ಸೇರಿಸಿ', friendEmail: 'ಸ್ನೇಹಿತರ ಇಮೇಲ್ ನಮೂದಿಸಿ', addedSuccess: 'ಸ್ನೇಹಿತರನ್ನು ಸೇರಿಸಲಾಗಿದೆ!', alreadyFriend: 'ಈಗಾಗಲೇ ಸೇರಿಸಲಾಗಿದೆ' },
    ml: { global: 'ആഗോള', friends: 'സുഹൃത്തുക്കൾ', addFriend: 'സുഹൃത്തിനെ ചേർക്കുക', friendEmail: 'സുഹൃത്തിന്റെ ഇമെയിൽ എഴുതുക', addedSuccess: 'സുഹൃത്തിനെ ചേർത്തു!', alreadyFriend: 'ഇപ്പോൾ തന്നെ സുഹൃത്താണ്' }
  };

  const labels = localLabels[lang] || localLabels.en;

  useEffect(() => {
    // We listen to all users so we can support filtering them locally
    const usersQuery = query(collection(db, 'users'), orderBy('sustainabilityScore', 'desc'), limit(15));
    const unsubscribe = onSnapshot(usersQuery, (snapshot) => {
      setLeaders(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return unsubscribe;
  }, []);

  const handleAddFriend = (e) => {
    e.preventDefault();
    if (!friendEmailInput) return;

    const emailToSearch = friendEmailInput.trim().toLowerCase();

    if (emailToSearch === userEmail.toLowerCase()) {
      setFeedback("You cannot add yourself.");
      setTimeout(() => setFeedback(''), 3050);
      return;
    }

    if (friends.map(f => f.toLowerCase()).includes(emailToSearch)) {
      setFeedback(labels.alreadyFriend);
      setTimeout(() => setFeedback(''), 3050);
      return;
    }

    if (onAddFriend) {
      onAddFriend(emailToSearch);
      setFeedback(labels.addedSuccess);
      setTimeout(() => setFeedback(''), 3050);
    }
    setFriendEmailInput('');
  };

  // Filter leaders based on active tab
  const displayedLeaders = activeTab === 'global'
    ? leaders.slice(0, 5) // Top 5 globally
    : leaders.filter(user => 
        (user.email && friends.map(f => f.toLowerCase()).includes(user.email.toLowerCase())) || 
        (user.email && user.email.toLowerCase() === userEmail.toLowerCase())
      );

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl shadow-slate-950/25">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-emerald-300">{t('leaderboard')}</h2>
          <p className="text-sm text-slate-400">{t('rankBySustainability')}</p>
        </div>

        {/* Tab Filters */}
        <div className="flex gap-1 bg-slate-950/80 p-1 rounded-2xl border border-slate-850">
          <button
            type="button"
            onClick={() => setActiveTab('global')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'global' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {labels.global}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('friends')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'friends' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {labels.friends}
          </button>
        </div>
      </div>

      {activeTab === 'friends' && (
        <form onSubmit={handleAddFriend} className="mb-6 space-y-2">
          <div className="flex gap-2">
            <input
              type="email"
              required
              placeholder={labels.friendEmail}
              value={friendEmailInput}
              onChange={(e) => setFriendEmailInput(e.target.value)}
              className="flex-1 rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-2 text-xs text-slate-100 placeholder-slate-650"
            />
            <button
              type="submit"
              className="rounded-2xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-400 transition"
            >
              {labels.addFriend}
            </button>
          </div>
          {feedback && (
            <p className={`text-[11px] font-medium ${feedback === labels.addedSuccess ? 'text-emerald-400' : 'text-rose-400'}`}>
              {feedback}
            </p>
          )}
        </form>
      )}

      <div className="space-y-3">
        {displayedLeaders.length > 0 ? (
          displayedLeaders.map((user, index) => {
            const isMe = user.email && user.email.toLowerCase() === userEmail.toLowerCase();
            return (
              <div
                key={user.id}
                className={`flex items-center justify-between rounded-3xl border px-5 py-4 transition-all duration-300 ${
                  isMe
                    ? 'border-emerald-500/30 bg-emerald-950/20 shadow-[0_0_15px_rgba(16,185,129,0.08)]'
                    : 'border-slate-800 bg-slate-950/80'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-500">#{index + 1}</p>
                    {isMe && (
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-semibold text-emerald-400 border border-emerald-500/20">
                        YOU
                      </span>
                    )}
                  </div>
                  <p className="text-lg font-semibold text-slate-100">{user.name || user.email || 'Anonymous'}</p>
                </div>
                <div className="rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-300">
                  {user.sustainabilityScore ?? 0}
                </div>
              </div>
            );
          })
        ) : (
          <p className="rounded-3xl border border-slate-800 bg-slate-950/80 px-5 py-4 text-sm text-slate-400">
            {t('noLeaderboardData')}
          </p>
        )}
      </div>
    </section>
  );
}

export default Leaderboard;
