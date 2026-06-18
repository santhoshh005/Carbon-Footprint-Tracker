import { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend, 
  ReferenceLine 
} from 'recharts';
import { useTranslation } from 'react-i18next';

const COLORS = ['#22c55e', '#10b981', '#14b8a6', '#0ea5e9', '#a855f7'];

function Dashboard({ score, emissions, weeklyHistory = [], emissionLogs = [] }) {
  const { t, i18n } = useTranslation();
  const [timeframe, setTimeframe] = useState('weekly');

  const refLabels = {
    en: { ecoGoal: 'Eco Goal (8 kg)', globalAvg: 'Global Avg (15 kg)' },
    hi: { ecoGoal: 'इको लक्ष्य (8 किग्रा)', globalAvg: 'वैश्विक औसत (15 किग्रा)' },
    te: { ecoGoal: 'ఇకో లక్ష్యం (8 కిలోలు)', globalAvg: 'ప్రపంచ సగటు (15 కిలోలు)' },
    ta: { ecoGoal: 'சுற்றுச்சூழல் இலக்கு (8 கிலோ)', globalAvg: 'உலகளாவிய சராசரி (15 கிலோ)' },
    kn: { ecoGoal: 'ಪರಿಸರ ಗುರಿ (8 ಕೆಜಿ)', globalAvg: 'ಜಾಗತಿಕ ಸರಾಸರಿ (15 ಕೆಜಿ)' },
    ml: { ecoGoal: 'ഇക്കോ ലക്ഷ്യം (8 കിലോ)', globalAvg: 'ആგോള ശരാശരി (15 കിലോ)' }
  };
  const lang = i18n.language || 'en';
  const refText = refLabels[lang.split('-')[0]] || refLabels.en;

  const hasEmissions = emissions && (emissions.transport > 0 || emissions.diet > 0 || emissions.electricity > 0);

  const emissionData = hasEmissions
    ? [
        { name: t('transport'), value: emissions.transport || 0 },
        { name: t('diet'), value: emissions.diet || 0 },
        { name: t('electricity'), value: emissions.electricity || 0 },
        { name: t('waste'), value: Number(((emissions.transport + emissions.diet + emissions.electricity) * 0.1).toFixed(2)) },
        { name: t('misc'), value: Number(((emissions.transport + emissions.diet + emissions.electricity) * 0.15).toFixed(2)) }
      ]
    : [
        { name: t('transport'), value: 5.5 },
        { name: t('diet'), value: 3.5 },
        { name: t('electricity'), value: 4.2 },
        { name: t('waste'), value: 1.5 },
        { name: t('misc'), value: 2.0 }
      ];

  // Helper to format date strings to user local format
  const formatDateLabel = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(i18n.language, { day: 'numeric', month: 'short' });
    } catch (e) {
      return dateStr;
    }
  };

  // Generate trend data based on timeframe & actual logs
  const trendData = (() => {
    if (!emissionLogs || emissionLogs.length === 0) {
      // Fallback to weeklyHistory static map
      return (weeklyHistory || []).map(item => ({
        name: t(item.name.toLowerCase()),
        emissions: item.emissions
      }));
    }

    // Sort logs chronologically
    const sortedLogs = [...emissionLogs].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Slice based on weekly or monthly timeframe
    const limit = timeframe === 'weekly' ? 7 : 30;
    const slicedLogs = sortedLogs.slice(-limit);

    return slicedLogs.map(log => ({
      name: formatDateLabel(log.date),
      emissions: log.daily
    }));
  })();

  // COLORS constant is defined outside the component scope

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl shadow-slate-950/25">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-emerald-300">{t('dashboard')}</h2>
          <p className="text-sm text-slate-400">{t('visualizeFootprint')}</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {/* Timeframe Selector */}
          <div className="flex gap-1 bg-slate-950/80 p-1 rounded-2xl border border-slate-800">
            <button 
              type="button"
              onClick={() => setTimeframe('weekly')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-xl transition-all ${timeframe === 'weekly' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
            >
              {t('weekly')}
            </button>
            <button 
              type="button"
              onClick={() => setTimeframe('monthly')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-xl transition-all ${timeframe === 'monthly' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
            >
              {t('monthly')}
            </button>
          </div>
          <div className="rounded-3xl bg-slate-950/80 px-4 py-3 text-sm text-slate-300">
            {t('sustainabilityTier')}: <span className="font-semibold text-emerald-300">{score > 80 ? t('elite') : score > 60 ? t('balanced') : t('starter')}</span>
          </div>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">{t('co2Trend')}</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={trendData} margin={{ top: 15, right: 10, left: -10, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155' }} />
              {/* Reference benchmarks */}
              <ReferenceLine y={8} stroke="#10b981" strokeDasharray="3 3" label={{ value: refText.ecoGoal, fill: '#10b981', position: 'top', fontSize: 10 }} />
              <ReferenceLine y={15} stroke="#f43f5e" strokeDasharray="3 3" label={{ value: refText.globalAvg, fill: '#f43f5e', position: 'top', fontSize: 10 }} />
              <Line type="monotone" dataKey="emissions" stroke="#22c55e" strokeWidth={4} dot={{ fill: '#22c55e' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">{t('emissionBreakdown')}</h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={emissionData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95} paddingAngle={4}>
                  {emissionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ color: '#94a3b8' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
            <p className="text-sm text-slate-400">{t('sustainabilityScoreDesc')}</p>
            <div className="mt-4 rounded-3xl bg-slate-900 p-5 text-center">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{t('score')}</p>
              <p className="mt-3 text-5xl font-bold text-emerald-300">{score}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
