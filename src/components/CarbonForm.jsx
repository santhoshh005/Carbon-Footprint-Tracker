import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

const transportOptions = [
  { name: 'car', value: 0.28 },
  { name: 'bike', value: 0.05 },
  { name: 'bus', value: 0.11 },
  { name: 'train', value: 0.06 },
  { name: 'flight', value: 0.24 }
];

const dietOptions = [
  { name: 'vegan', value: 1.2 },
  { name: 'vegetarian', value: 2.1 },
  { name: 'mixed', value: 3.5 },
  { name: 'heavyMeat', value: 5.1 }
];

function CarbonForm({ onUpdate }) {
  const { t, i18n } = useTranslation();

  const getDietExplanation = (name) => {
    const explanations = {
      vegan: "VEGAN: Plant-based diet excluding all animal products. Produces the lowest carbon footprint (~1.2 kg CO₂/day).",
      vegetarian: "VEGETARIAN: Excludes meat, but includes dairy and eggs. Has a low carbon footprint (~2.1 kg CO₂/day).",
      mixed: "MIXED: A balanced diet containing vegetables, grains, dairy, and moderate meat. Average carbon footprint (~3.5 kg CO₂/day).",
      heavyMeat: "HEAVY MEAT: High red meat and poultry intake. Produces the highest diet carbon footprint (~5.1 kg CO₂/day)."
    };
    return explanations[name] || "";
  };

  const getTransportExplanation = (name) => {
    const explanations = {
      car: "CAR: Personal vehicle commute. Emits significant CO₂ (~0.28 kg/km) due to fossil fuel combustion.",
      bike: "BIKE/WALK: Active, non-motorized transport. Zero carbon emissions.",
      bus: "BUS: Public bus transit. Shares fuel emissions among passengers, yielding low impact (~0.11 kg/km).",
      train: "TRAIN: Rail transit. Highly efficient electric/diesel transit, yielding very low carbon impact (~0.06 kg/km).",
      flight: "FLIGHT: Air travel. Burns massive jet fuel, releasing extremely high CO₂ (~0.24 kg/km) per passenger."
    };
    return explanations[name] || "";
  };

  const [transport, setTransport] = useState('car');
  const [transportDistance, setTransportDistance] = useState(10);
  const [diet, setDiet] = useState('mixed');
  const [electricity, setElectricity] = useState(12);
  const [showTelemetry, setShowTelemetry] = useState(false);

  const langTel = (i18n.language || 'en').split('-')[0];

  const telemetryLabels = {
    en: { toggle: 'Formula Telemetry Matrix', sum: 'Direct Emissions Sum', waste: 'Waste overhead (10%)', misc: 'Misc overhead (15%)', net: 'Net Footprint' },
    hi: { toggle: 'सूत्र टेलीमेट्री मैट्रिक्स', sum: 'प्रत्यक्ष उत्सर्जन का योग', waste: 'अपशिष्ट ओवरहेड (10%)', misc: 'विविध ओवरहेड (15%)', net: 'शुद्ध कार्बन पदचिह्न' },
    te: { toggle: 'గణన సూత్రాల విశ్లేషణ', sum: 'प्रत्यक्ष ఉద్గారాల మొత్తం', waste: 'వ్యర్థాల అంచనా (10%)', misc: 'ఇతర అంచనాలు (15%)', net: 'నికర కార్బన్ ఉద్గారాలు' },
    ta: { toggle: 'சூத்திர டெலிமெட்ரி மேட்ரிக்ஸ்', sum: 'நேரடி உமிழ்வுகளின் கூட்டுத்தொகை', waste: 'கழிவு மேல்நிலை (10%)', misc: 'இதர மேல்நிலை (15%)', net: 'நிகர கார்பன் தடம்' },
    kn: { toggle: 'ಸೂತ್ರ ಟೆಲಿಮೆಟ್ರಿ ಮ್ಯಾಟ್ರಿಕ್ಸ್', sum: 'ನೇರ ಹೊರಸೂಸುವಿಕೆಯ ಮೊತ್ತ', waste: 'ತ್ಯಾಜ್ಯ ಓವರ್‌ಹೆಡ್ (10%)', misc: 'ಇತರ ಓವರ್‌ಹೆಡ್ (15%)', net: 'ನಿವ್ವಳ ಇಂಗಾಲದ ಹೆಜ್ಜೆಗುರುತು' },
    ml: { toggle: 'സൂത്ര ടെലിമെട്രി മാട്രിക്സ്', sum: 'നേരിട്ടുള്ള കാർബൺ അളവ്', waste: 'മാലിന്യ ഓവർഹെഡ് (10%)', misc: 'മറ്റു ഓവർഹെഡുകൾ (15%)', net: 'ആകെ കാർബൺ അളവ്' }
  };

  const telLabels = telemetryLabels[langTel] || telemetryLabels.en;

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
      electricity: Number(dailyElectricity.toFixed(2)),
      transportMultiplier,
      dietValue,
      dailyElectricity
    };
  }, [transport, transportDistance, diet, electricity]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onUpdate(result);
  };

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl shadow-slate-950/30">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-emerald-300">{t('carbonCalculator')}</h2>
          <p className="text-sm text-slate-400">{t('estimateEmissions')}</p>
        </div>
        <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs text-emerald-250">{t('modernGreenUI')}</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Transportation Mode Cards */}
        <div className="space-y-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {t('transportationMode')}
          </span>
          <div className="grid grid-cols-5 gap-2">
            {transportOptions.map((option) => {
              let icon = null;
              if (option.name === 'car') {
                icon = (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V15a1 1 0 01-1 1h-1.05" />
                  </svg>
                );
              } else if (option.name === 'bike') {
                icon = (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <circle cx="6" cy="16" r="3" />
                    <circle cx="18" cy="16" r="3" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 16l3-6h5m-8 0h4m-1-4h2" />
                  </svg>
                );
              } else if (option.name === 'bus') {
                icon = (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <rect x="4" y="4" width="16" height="12" rx="2" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 16v2m12-2v2M8 12h8m-8-4h8" />
                  </svg>
                );
              } else if (option.name === 'train') {
                icon = (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <rect x="5" y="3" width="14" height="12" rx="2" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 15l-2 4m12-4l2 4M7 8h10" />
                  </svg>
                );
              } else {
                icon = (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8M3 10h18" />
                  </svg>
                );
              }

              const isActive = transport === option.name;
              return (
                <button
                  key={option.name}
                  type="button"
                  onClick={() => setTransport(option.name)}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-300 ${
                    isActive
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300 shadow-lg'
                      : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {icon}
                  <span className="text-[10px] font-bold mt-2 uppercase tracking-wide truncate max-w-full px-1">
                    {t(option.name)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Diet Type Cards */}
        <div className="space-y-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {t('dietType')}
          </span>
          <div className="grid grid-cols-4 gap-2">
            {dietOptions.map((option) => {
              let icon = null;
              if (option.name === 'vegan') {
                icon = (
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17 8C8 10 5.9 16.1 5.9 16.1S3 14 3 10C3 5 8 3 13 3C18 3 21 6.5 21 10.5C21 14.5 17 19.5 13 21C15 17 17 12 17 8Z" />
                  </svg>
                );
              } else if (option.name === 'vegetarian') {
                icon = (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4m11-2l2 2m-2 0l-3 3M8 11a4 4 0 118 0 4 4 0 01-8 0z" />
                  </svg>
                );
              } else if (option.name === 'mixed') {
                icon = (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 3v18M3 12h18" />
                  </svg>
                );
              } else {
                icon = (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 009-9c0-1.664-1.336-3-3-3H6C4.336 9 3 10.336 3 12a9 9 0 009 9z" />
                  </svg>
                );
              }

              const isActive = diet === option.name;
              return (
                <button
                  key={option.name}
                  type="button"
                  onClick={() => setDiet(option.name)}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-300 card-tooltip ${
                    isActive
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300 shadow-lg'
                      : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                  data-explanation={getDietExplanation(option.name)}
                >
                  {icon}
                  <span className="text-[10px] font-bold mt-2 uppercase tracking-wide truncate max-w-full px-1">
                    {t(option.name)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Numerical inputs */}
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-300 block">
            <span className="term-tooltip" data-explanation="Daily Distance: The total kilometers traveled per day using your selected mode of transport. Emits CO₂ proportional to the distance.">
              {t('dailyDistance')}
            </span>
            <input
              type="number"
              min="0"
              value={transportDistance}
              onChange={(e) => setTransportDistance(Number(e.target.value))}
              className="w-full px-4 py-3 mt-2"
            />
          </label>

          <label className="space-y-2 text-sm text-slate-300 block">
            <span className="term-tooltip" data-explanation="Daily Electricity: Your average daily power usage in kilowatt-hours. Calculated using grid emission factors (~0.45 kg CO₂ per kWh).">
              {t('dailyElectricity')}
            </span>
            <input
              type="number"
              min="0"
              value={electricity}
              onChange={(e) => setElectricity(Number(e.target.value))}
              className="w-full px-4 py-3 mt-2"
            />
          </label>
        </div>

        {/* Core Calculation Outputs */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4 text-center">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Daily <span className="term-tooltip" data-explanation="CO₂ (Carbon Dioxide): The main greenhouse gas emitted through actions like burning fossil fuels (driving, electricity) and food production.">CO₂</span>
            </p>
            <p className="mt-2 text-3xl font-extrabold text-emerald-300">{result.daily} {t('kg')}</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4 text-center">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Weekly <span className="term-tooltip" data-explanation="CO₂ (Carbon Dioxide): The main greenhouse gas emitted through actions like burning fossil fuels (driving, electricity) and food production.">CO₂</span>
            </p>
            <p className="mt-2 text-3xl font-extrabold text-emerald-300">{result.weekly} {t('kg')}</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4 text-center">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Monthly <span className="term-tooltip" data-explanation="CO₂ (Carbon Dioxide): The main greenhouse gas emitted through actions like burning fossil fuels (driving, electricity) and food production.">CO₂</span>
            </p>
            <p className="mt-2 text-3xl font-extrabold text-emerald-300">{result.monthly} {t('kg')}</p>
          </div>
        </div>

        {/* Telemetry Matrix Dropdown */}
        <div className="border-t border-slate-800/80 pt-4">
          <button
            type="button"
            onClick={() => setShowTelemetry(!showTelemetry)}
            className="flex w-full items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400 hover:text-emerald-300 transition focus:outline-none"
          >
            <span>
              Formula <span className="term-tooltip" data-explanation="Telemetry Matrix: An interactive grid showing the exact mathematical calculations and emission factors used to compute your totals.">Telemetry</span> Matrix
            </span>
            <span className="text-[10px]">{showTelemetry ? '▲' : '▼'}</span>
          </button>
          
          {showTelemetry && (
            <div className="mt-4 rounded-2xl border border-slate-850 bg-slate-950/70 p-5 text-xs text-slate-400 space-y-3 font-medium">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 border-b border-slate-900 pb-2.5">
                <span className="text-slate-500 font-semibold">{t('transport')}:</span>
                <span className="font-mono">
                  {transportDistance} km × {result.transportMultiplier} ({t(transport)}) = <span className="text-emerald-400 font-semibold">{result.transport} kg CO₂</span>
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 border-b border-slate-900 pb-2.5">
                <span className="text-slate-500 font-semibold">{t('diet')}:</span>
                <span className="font-mono">
                  {t(diet)} Baseline = <span className="text-emerald-400 font-semibold">{result.diet} kg CO₂</span>
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 border-b border-slate-900 pb-2.5">
                <span className="text-slate-500 font-semibold">{t('electricity')}:</span>
                <span className="font-mono">
                  {electricity} kWh × 0.45 kg/kWh = <span className="text-emerald-400 font-semibold">{result.electricity} kg CO₂</span>
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 border-b border-slate-900 pb-2.5">
                <span className="text-slate-300 font-bold">{telLabels.sum}:</span>
                <span className="font-mono text-emerald-450 font-bold">{result.daily} kg CO₂</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 border-b border-slate-900 pb-2.5 text-slate-550">
                <span>{telLabels.waste}:</span>
                <span className="font-mono">{(result.daily * 0.1).toFixed(2)} kg CO₂</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 border-b border-slate-900 pb-2.5 text-slate-550">
                <span>{telLabels.misc}:</span>
                <span className="font-mono">{(result.daily * 0.15).toFixed(2)} kg CO₂</span>
              </div>
              <div className="flex justify-between text-slate-200 font-bold text-sm pt-1">
                <span>
                  <span className="term-tooltip" data-explanation="Net Footprint: The final footprint calculations including all indirect wastes and general lifestyle emission overheads.">Net Footprint</span>:
                </span>
                <span className="font-mono text-emerald-300">{(result.daily * 1.25).toFixed(2)} kg CO₂</span>
              </div>
            </div>
          )}
        </div>

        <button className="w-full rounded-3xl bg-emerald-500 px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-450">
          {t('updateReport')}
        </button>
      </form>
    </section>
  );
}

export default CarbonForm;
