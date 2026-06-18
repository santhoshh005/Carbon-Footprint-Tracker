import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

function SustainabilityScore({ score = 0, emissions }) {
  const { t } = useTranslation();
  const [animatedOffset, setAnimatedOffset] = useState(314.16);

  const grade = score > 85 ? t('excellent') : score > 70 ? t('good') : score > 50 ? t('average') : t('needsImprovement');
  const accent = score > 85 ? 'bg-emerald-500' : score > 70 ? 'bg-lime-500' : score > 50 ? 'bg-amber-500' : 'bg-rose-500';

  const highestSector = (() => {
    if (!emissions) return null;
    const tVal = emissions.transport || 0;
    const dVal = emissions.diet || 0;
    const eVal = emissions.electricity || 0;
    if (tVal === 0 && dVal === 0 && eVal === 0) return null;
    if (tVal >= dVal && tVal >= eVal) return 'transport';
    if (dVal >= tVal && dVal >= eVal) return 'diet';
    return 'electricity';
  })();

  // Animate the circular progress bar on mount or score change
  useEffect(() => {
    const circumference = 2 * Math.PI * 50; // ~314.16
    const offset = circumference - (score / 100) * circumference;
    const timer = setTimeout(() => {
      setAnimatedOffset(offset);
    }, 150);
    return () => clearTimeout(timer);
  }, [score]);

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl shadow-slate-950/25">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-emerald-300">
            <span className="term-tooltip" data-explanation="Sustainability Score: A dynamic metric (40 to 100) reflecting how ecological your lifestyle habits are. It increases as you complete challenges and keep daily energy/travel emissions low.">Sustainability Score</span>
          </h2>
          <p className="text-sm text-slate-400">{t('snapshotEcoHabits')}</p>
        </div>
        <div className={`rounded-full px-4 py-2 text-sm font-semibold text-slate-950 transition-colors duration-300 ${accent}`}>
          {grade}
        </div>
      </div>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 items-center">
        {/* Animated Circular Gauge */}
        <div className="rounded-3xl bg-slate-950/80 p-5 flex flex-col items-center justify-center min-h-[180px]">
          <p className="text-xs uppercase tracking-wide text-slate-500 mb-4">{t('overallScore')}</p>
          <div className="relative flex items-center justify-center w-36 h-36">
            <svg className="w-full h-full transform -rotate-90">
              <defs>
                <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="60%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
              {/* Background Track */}
              <circle
                cx="72"
                cy="72"
                r="50"
                stroke="#1e293b"
                strokeWidth="10"
                fill="transparent"
              />
              {/* Animated Foreground Progress */}
              <circle
                cx="72"
                cy="72"
                r="50"
                stroke="url(#scoreGrad)"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray="314.16"
                strokeDashoffset={animatedOffset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)' }}
              />
            </svg>
            <span className="absolute text-4xl font-extrabold text-slate-100 glow-text">{score}</span>
          </div>
        </div>

        <div className="rounded-3xl bg-slate-950/80 p-5 min-h-[180px] flex flex-col justify-center">
          <p className="text-sm text-slate-300 mb-4">{t('focusReducing')}</p>
          <ul className="space-y-2.5 text-sm text-slate-400">
            <li className={`transition-all duration-300 py-0.5 ${highestSector === 'transport' ? 'text-emerald-400 font-semibold' : ''}`}>
              • {t('tip1')}
              {highestSector === 'transport' && (
                <span className="text-[10px] bg-emerald-500/15 text-emerald-400 px-2.5 py-0.5 rounded-full font-medium ml-2 inline-block border border-emerald-500/20">
                  Priority
                </span>
              )}
            </li>
            <li className={`transition-all duration-300 py-0.5 ${highestSector === 'diet' ? 'text-emerald-400 font-semibold' : ''}`}>
              • {t('tip2')}
              {highestSector === 'diet' && (
                <span className="text-[10px] bg-emerald-500/15 text-emerald-400 px-2.5 py-0.5 rounded-full font-medium ml-2 inline-block border border-emerald-500/20">
                  Priority
                </span>
              )}
            </li>
            <li className={`transition-all duration-300 py-0.5 ${highestSector === 'electricity' ? 'text-emerald-400 font-semibold' : ''}`}>
              • {t('tip3')}
              {highestSector === 'electricity' && (
                <span className="text-[10px] bg-emerald-500/15 text-emerald-400 px-2.5 py-0.5 rounded-full font-medium ml-2 inline-block border border-emerald-500/20">
                  Priority
                </span>
              )}
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default SustainabilityScore;
