import { useMemo, useState } from 'react';

const transportOptions = [
  { name: 'Car', value: 0.28 },
  { name: 'Bike', value: 0.05 },
  { name: 'Bus', value: 0.11 },
  { name: 'Train', value: 0.06 },
  { name: 'Flight', value: 0.24 }
];

const dietOptions = [
  { name: 'Vegan', value: 1.2 },
  { name: 'Vegetarian', value: 2.1 },
  { name: 'Mixed', value: 3.5 },
  { name: 'Heavy Meat', value: 5.1 }
];

function CarbonForm({ onUpdate }) {
  const [transport, setTransport] = useState('Car');
  const [transportDistance, setTransportDistance] = useState(10);
  const [diet, setDiet] = useState('Mixed');
  const [electricity, setElectricity] = useState(12);

  const result = useMemo(() => {
    const transportMultiplier = transportOptions.find((option) => option.name === transport)?.value ?? 0;
    const dietValue = dietOptions.find((option) => option.name === diet)?.value ?? 0;
    const dailyTransport = transportDistance * transportMultiplier;
    const dailyDiet = dietValue;
    const dailyElectricity = electricity * 0.45;
    const dailyTotal = Number((dailyTransport + dailyDiet + dailyElectricity).toFixed(2));
    const weeklyTotal = Number((dailyTotal * 7).toFixed(2));
    const monthlyTotal = Number((dailyTotal * 30).toFixed(2));

    return {
      daily: dailyTotal,
      weekly: weeklyTotal,
      monthly: monthlyTotal,
      transport: Number(dailyTransport.toFixed(2)),
      diet: Number(dailyDiet.toFixed(2)),
      electricity: Number(dailyElectricity.toFixed(2))
    };
  }, [transport, transportDistance, diet, electricity]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onUpdate(result);
  };

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl shadow-slate-950/30">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-emerald-300">Carbon Calculator</h2>
          <p className="text-sm text-slate-400">Estimate your daily, weekly, and monthly CO₂ emissions.</p>
        </div>
        <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs text-emerald-200">Modern Green UI</span>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-300">
            Transportation mode
            <select value={transport} onChange={(e) => setTransport(e.target.value)} className="w-full px-4 py-3">
              {transportOptions.map((option) => (
                <option key={option.name} value={option.name}>{option.name}</option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm text-slate-300">
            Daily distance (km)
            <input
              type="number"
              min="0"
              value={transportDistance}
              onChange={(e) => setTransportDistance(Number(e.target.value))}
              className="w-full px-4 py-3"
            />
          </label>

          <label className="space-y-2 text-sm text-slate-300">
            Diet type
            <select value={diet} onChange={(e) => setDiet(e.target.value)} className="w-full px-4 py-3">
              {dietOptions.map((option) => (
                <option key={option.name} value={option.name}>{option.name}</option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm text-slate-300">
            Daily electricity (kWh)
            <input
              type="number"
              min="0"
              value={electricity}
              onChange={(e) => setElectricity(Number(e.target.value))}
              className="w-full px-4 py-3"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4 text-center">
            <p className="text-xs uppercase tracking-wide text-slate-400">Daily CO₂</p>
            <p className="mt-2 text-3xl font-semibold text-emerald-300">{result.daily} kg</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4 text-center">
            <p className="text-xs uppercase tracking-wide text-slate-400">Weekly CO₂</p>
            <p className="mt-2 text-3xl font-semibold text-emerald-300">{result.weekly} kg</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4 text-center">
            <p className="text-xs uppercase tracking-wide text-slate-400">Monthly CO₂</p>
            <p className="mt-2 text-3xl font-semibold text-emerald-300">{result.monthly} kg</p>
          </div>
        </div>

        <button className="w-full rounded-3xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400">
          Update Report
        </button>
      </form>
    </section>
  );
}

export default CarbonForm;
