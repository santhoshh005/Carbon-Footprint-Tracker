import { useTranslation } from 'react-i18next';

function Challenges() {
  const { t } = useTranslation();

  const challenges = [
    {
      title: t('noCarWeek'),
      description: t('noCarWeekDesc')
    },
    {
      title: t('zeroPlasticChallenge'),
      description: t('zeroPlasticDesc')
    },
    {
      title: t('treePlantation'),
      description: t('treePlantationDesc')
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
      <div className="grid gap-4 sm:grid-cols-3">
        {challenges.map((challenge) => (
          <article key={challenge.title} className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
            <h3 className="mb-3 text-lg font-semibold text-slate-100">{challenge.title}</h3>
            <p className="text-sm leading-6 text-slate-400">{challenge.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Challenges;
