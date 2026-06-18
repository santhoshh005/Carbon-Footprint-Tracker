import { useTranslation } from 'react-i18next';

function Challenges({ activeChallenges = [], completedChallenges = [], onAction }) {
  const { t, i18n } = useTranslation();

  const localTranslations = {
    en: { accept: 'Accept', complete: 'Complete', completed: 'Completed', active: 'Active', pts: 'pts' },
    hi: { accept: 'स्वीकार करें', complete: 'पूरा करें', completed: 'पूरा हुआ', active: 'सक्रिय', pts: 'अंक' },
    te: { accept: 'అంగీకరించు', complete: 'పూర్తి చేయి', completed: 'పూర్తయింది', active: 'సక్రియంగా ఉంది', pts: 'పాయింట్లు' },
    ta: { accept: 'ஏற்கவும்', complete: 'முடிக்கவும்', completed: 'முடிந்தது', active: 'செயலில் உள்ளது', pts: 'புள்ளிகள்' },
    kn: { accept: 'ಸ್ವೀಕರಿಸಿ', complete: 'ಪೂರ್ಣಗೊಳಿಸಿ', completed: 'ಪೂರ್ಣಗೊಂಡಿದೆ', active: 'ಸಕ್ರಿಯ', pts: 'ಅಂಕಗಳು' },
    ml: { accept: 'സ്വീകരിക്കുക', complete: 'പൂർത്തിയാക്കുക', completed: 'പൂർത്തിയായി', active: 'സജീവം', pts: 'പോയിന്റുകൾ' }
  };

  const lang = i18n.language || 'en';
  const local = localTranslations[lang.split('-')[0]] || localTranslations.en;

  const challenges = [
    {
      id: 'noCarWeek',
      title: t('noCarWeek'),
      description: t('noCarWeekDesc'),
      points: 15
    },
    {
      id: 'zeroPlasticChallenge',
      title: t('zeroPlasticChallenge'),
      description: t('zeroPlasticDesc'),
      points: 10
    },
    {
      id: 'treePlantation',
      title: t('treePlantation'),
      description: t('treePlantationDesc'),
      points: 20
    }
  ];

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl shadow-slate-950/25">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-emerald-300">{t('challenges')}</h2>
          <p className="text-sm text-slate-400">{t('engageSustainableGoals')}</p>
        </div>
        <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs text-emerald-200">{t('weeklyGoals')}</span>
      </div>
      
      <div className="space-y-3">
        {challenges.map((challenge) => {
          const isActive = activeChallenges.includes(challenge.id);
          const isCompleted = completedChallenges.includes(challenge.id);

          // Matching icons for each challenge
          let icon = null;
          if (challenge.id === 'noCarWeek') {
            icon = (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            );
          } else if (challenge.id === 'zeroPlasticChallenge') {
            icon = (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            );
          } else {
            icon = (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707" />
              </svg>
            );
          }

          return (
            <article
              key={challenge.id}
              className={`flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-2xl border p-4 gap-4 transition-all duration-300 ${
                isCompleted
                  ? 'border-emerald-500/20 bg-emerald-950/5 shadow-md'
                  : isActive
                  ? 'border-sky-500/20 bg-sky-950/5 shadow-md'
                  : 'border-slate-800 bg-slate-950/40 hover:border-slate-750'
              }`}
            >
              <div className="flex items-start gap-4 flex-1">
                <div className={`p-2.5 rounded-xl shrink-0 ${
                  isCompleted 
                    ? 'bg-emerald-500/10 text-emerald-400' 
                    : isActive 
                    ? 'bg-sky-500/10 text-sky-400' 
                    : 'bg-slate-800 text-slate-450'
                }`}>
                  {icon}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-slate-100">{challenge.title}</h3>
                    {isCompleted ? (
                      <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                        {local.completed}
                      </span>
                    ) : isActive ? (
                      <span className="rounded-full bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 text-[10px] font-semibold text-sky-400">
                        {local.active}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1.5 text-xs text-slate-450 leading-relaxed max-w-xl">{challenge.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto border-t sm:border-t-0 border-slate-800/60 pt-3 sm:pt-0 shrink-0">
                <span className="text-xs font-semibold text-emerald-450 bg-emerald-500/5 px-2.5 py-1 rounded-lg border border-emerald-500/10">
                  +{challenge.points} {local.pts}
                </span>

                {isCompleted ? (
                  <div className="h-7 w-7 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold shadow-md shadow-emerald-500/5">
                    ✓
                  </div>
                ) : isActive ? (
                  <button
                    onClick={() => onAction && onAction(challenge.id, 'complete')}
                    className="rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 px-3.5 py-1.5 text-xs font-bold transition shadow-lg shadow-sky-500/15"
                  >
                    {local.complete}
                  </button>
                ) : (
                  <button
                    onClick={() => onAction && onAction(challenge.id, 'accept')}
                    className="rounded-full border border-slate-700 hover:border-emerald-500/50 hover:bg-emerald-500/10 text-slate-300 hover:text-emerald-300 px-3.5 py-1.5 text-xs font-bold transition"
                  >
                    {local.accept}
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default Challenges;
