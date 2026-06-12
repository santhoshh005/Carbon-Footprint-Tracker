import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const emissionData = [
  { name: 'Transport', value: 28 },
  { name: 'Diet', value: 22 },
  { name: 'Electricity', value: 18 },
  { name: 'Waste', value: 12 },
  { name: 'Misc', value: 20 }
];

const trendData = [
  { name: 'Mon', emissions: 18 },
  { name: 'Tue', emissions: 20 },
  { name: 'Wed', emissions: 17 },
  { name: 'Thu', emissions: 16 },
  { name: 'Fri', emissions: 14 },
  { name: 'Sat', emissions: 12 },
  { name: 'Sun', emissions: 15 }
];

const COLORS = ['#22c55e', '#10b981', '#14b8a6', '#0ea5e9', '#a855f7'];

function Dashboard({ score }) {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl shadow-slate-950/25">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-emerald-300">Dashboard</h2>
          <p className="text-sm text-slate-400">Visualize your footprint and track progress across the week.</p>
        </div>
        <div className="rounded-3xl bg-slate-950/80 px-4 py-3 text-sm text-slate-300">
          Sustainability tier: <span className="font-semibold text-emerald-300">{score > 80 ? 'Elite' : score > 60 ? 'Balanced' : 'Starter'}</span>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">CO₂ Trend</h3>
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
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Emission Breakdown</h3>
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
            <p className="text-sm text-slate-400">Your current sustainability score is based on emissions, challenges, and energy habits.</p>
            <div className="mt-4 rounded-3xl bg-slate-900 p-5 text-center">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Score</p>
              <p className="mt-3 text-5xl font-bold text-emerald-300">{score}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
