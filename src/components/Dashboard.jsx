import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useTranslation } from 'react-i18next';

function Dashboard({ score }) {
  const { t } = useTranslation();

  const emissionData = [
    { name: t('transport'), value: 28 },
    { name: t('diet'), value: 22 },
    { name: t('electricity'), value: 18 },
    { name: t('waste'), value: 12 },
    { name: t('misc'), value: 20 }
  ];

  const trendData = [
    { name: t('mon'), emissions: 18 },
    { name: t('tue'), emissions: 20 },
    { name: t('wed'), emissions: 17 },
    { name: t('thu'), emissions: 16 },
    { name: t('fri'), emissions: 14 },
    { name: t('sat'), emissions: 12 },
    { name: t('sun'), emissions: 15 }
  ];

  const COLORS = ['#22c55e', '#10b981', '#14b8a6', '#0ea5e9', '#a855f7'];

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl shadow-slate-950/25">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-emerald-300">{t('dashboard')}</h2>
          <p className="text-sm text-slate-400">{t('visualizeFootprint')}</p>
        </div>
        <div className="rounded-3xl bg-slate-950/80 px-4 py-3 text-sm text-slate-300">
          {t('sustainabilityTier')}: <span className="font-semibold text-emerald-300">{score > 80 ? t('elite') : score > 60 ? t('balanced') : t('starter')}</span>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">{t('co2Trend')}</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155' }} />
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
