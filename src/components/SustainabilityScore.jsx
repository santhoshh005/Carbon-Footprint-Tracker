function SustainabilityScore({ score }) {
  const grade = score > 85 ? 'Excellent' : score > 70 ? 'Good' : score > 50 ? 'Average' : 'Needs Improvement';
  const accent = score > 85 ? 'bg-emerald-500' : score > 70 ? 'bg-lime-500' : score > 50 ? 'bg-amber-500' : 'bg-rose-500';

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl shadow-slate-950/25">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-emerald-300">Sustainability Score</h2>
          <p className="text-sm text-slate-400">A snapshot of your eco-friendly habits.</p>
        </div>
        <div className={`rounded-full px-4 py-2 text-sm font-semibold text-slate-950 ${accent}`}>
          {grade}
        </div>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl bg-slate-950/80 p-5 text-center">
          <p className="text-xs uppercase tracking-wide text-slate-500">Overall Score</p>
          <p className="mt-4 text-5xl font-bold text-emerald-300">{score}</p>
        </div>
        <div className="rounded-3xl bg-slate-950/80 p-5">
          <p className="text-sm text-slate-300">Focus on reducing car trips, eating plant-based meals, and lowering electricity.</p>
          <ul className="mt-4 space-y-2 text-sm text-slate-400">
            <li>• Choose low-emission travel modes.</li>
            <li>• Swap heavy meat days for vegetarian or vegan meals.</li>
            <li>• Save energy with smart home practices.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default SustainabilityScore;
