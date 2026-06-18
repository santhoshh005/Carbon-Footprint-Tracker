import { useState } from 'react';
import { useTranslation } from 'react-i18next';

function TravelSimulator() {
  const { i18n } = useTranslation();
  const [distance, setDistance] = useState(25);

  const lang = (i18n.language || 'en').split('-')[0];

  const localLabels = {
    en: {
      title: 'Travel Mode Simulator',
      subtitle: 'Adjust distance and compare CO₂ emissions across transport options.',
      distance: 'Travel Distance',
      selectMode: 'Compare Modes',
      comparisonText: 'Choosing a Bicycle instead of an SUV saves **{{savings}} kg** of CO₂, equivalent to **{{trees}} tree-days** of carbon absorption!',
      suv: 'SUV',
      gasCar: 'Gasoline Car',
      hybrid: 'Hybrid Car',
      ev: 'Electric Vehicle',
      bus: 'Public Bus',
      bike: 'Bicycle / Walk'
    },
    hi: {
      title: 'यात्रा मोड सिम्युलेटर',
      subtitle: 'दूरी समायोजित करें और परिवहन विकल्पों में CO₂ उत्सर्जन की तुलना करें।',
      distance: 'यात्रा की दूरी',
      selectMode: 'मोड की तुलना करें',
      comparisonText: 'एसयूवी के बजाय साइकिल चुनने से **{{savings}} किग्रा** CO₂ की बचत होती है, जो **{{trees}} पेड़-दिनों** के कार्बन अवशोषण के बराबर है!',
      suv: 'एसयूवी',
      gasCar: 'पेट्रोल कार',
      hybrid: 'हाइब्रिड कार',
      ev: 'इलेक्ट्रिक वाहन',
      bus: 'सार्वजनिक बस',
      bike: 'साइकिल / पैदल'
    },
    te: {
      title: 'రవాణా వాహనాల సిమ్యులేటర్',
      subtitle: 'ప్రయాణ దూరాన్ని మార్చి వివిధ వాహనాల కార్బన్ ఉద్గారాలను పోల్చండి.',
      distance: 'ప్రయాణ దూరం',
      selectMode: 'వాహనాల పోలిక',
      comparisonText: 'ఎస్‌యూవీ కి బదులుగా సైకిల్‌ను ఎంచుకోవడం వల్ల **{{savings}} కిలోల** CO₂ ఆదా అవుతుంది, ఇది **{{trees}} రోజుల పాటు ఒక చెట్టు** పీల్చుకునే బొగ్గుపులుసు వాయువుతో సమానం!',
      suv: 'ఎస్‌యూవీ',
      gasCar: 'పెట్రోల్ కార్',
      hybrid: 'హైబ్రిడ్ కార్',
      ev: 'ఎలక్ట్రిక్ వాహనం',
      bus: 'ప్రజా రవాణా బస్సు',
      bike: 'సైకిల్ / నడక'
    },
    ta: {
      title: 'பயண முறை சிமுலேட்டர்',
      subtitle: 'தூரத்தை சரிசெய்து போக்குவரத்து விருப்பங்களில் CO₂ உமிழ்வை ஒப்பிடவும்.',
      distance: 'பயண தூரம்',
      selectMode: 'முறைகளை ஒப்பிடுக',
      comparisonText: 'எஸ்யூவிக்கு பதிலாக மிதிவண்டியைத் தேர்ந்தெடுப்பது **{{savings}} கிலோ** CO₂ ஐச் சேமிக்கிறது, இது **{{trees}} மர-நாட்களின்** கார்பன் உறிஞ்சுதலுக்குச் சமம்!',
      suv: 'எஸ்யூவி',
      gasCar: 'பெட்ரோல் கார்',
      hybrid: 'ஹைப்ரிட் கார்',
      ev: 'மின்சார வாகனம்',
      bus: 'பொது பேருந்து',
      bike: 'மிதிவண்டி / நடை'
    },
    kn: {
      title: 'ಪ್ರಯಾಣ ವಿಧಾನ ಸಿಮ್ಯುಲೇಟರ್',
      subtitle: 'ದೂರವನ್ನು ಹೊಂದಿಸಿ ಮತ್ತು ಸಾರಿಗೆ ಆಯ್ಕೆಗಳಲ್ಲಿ CO₂ ಹೊರಸೂಸುವಿಕೆಯನ್ನು ಹೋಲಿಕೆ ಮಾಡಿ.',
      distance: 'ಪ್ರಯಾಣ ದೂರ',
      selectMode: 'ವಿಧಾನಗಳನ್ನು ಹೋಲಿಸಿ',
      comparisonText: 'ಎಸ್‌ಯುವಿ ಬದಲು ಸೈಕಲ್ ಆರಿಸುವುದರಿಂದ **{{savings}} ಕೆಜಿ** CO₂ ಉಳಿತಾಯವಾಗುತ್ತದೆ, ಇದು **{{trees}} ಮರ-ದಿನಗಳ** ಇಂಗಾಲದ ಹೀರಿಕೊಳ್ಳುವಿಕೆಗೆ ಸಮಾನವಾಗಿದೆ!',
      suv: 'ಎಸ್‌ಯುವಿ',
      gasCar: 'ಪೆಟ್ರೋಲ್ ಕಾರ್',
      hybrid: 'ಹೈಬ್ರಿಡ್ ಕಾರ್',
      ev: 'ಎಲೆಕ್ಟ್ರಿಕ್ ವಾಹನ',
      bus: 'ಸಾರ್ವಜನಿಕ ಬಸ್',
      bike: 'ಸೈಕಲ್ / ಕಾಲ್ನಡಿಗೆ'
    },
    ml: {
      title: 'യാത്രാ മാർഗ്ഗ സിമുലേറ്റർ',
      subtitle: 'ദൂരം ക്രമീകരിച്ച് വിവിധ യാത്രാ മാർഗ്ഗങ്ങളിലെ കാർബൺ പുറന്തള്ളൽ താരതമ്യം ചെയ്യുക.',
      distance: 'യാത്രാ ദൂരം',
      selectMode: 'മാർഗ്ഗങ്ങൾ താരതമ്യം ചെയ്യുക',
      comparisonText: 'എസ്‌യുവിയ്ക്ക് പകരം സൈക്കിൾ തിരഞ്ഞെടുക്കുന്നത് **{{savings}} കിലോ** CO₂ ലാഭിക്കുന്നു, ഇത് **{{trees}} മര-ദിവസങ്ങൾ** ആഗിരണം ചെയ്യുന്ന കാർബണിന് തുല്യമാണ്!',
      suv: 'എസ്‌യുവി',
      gasCar: 'പെട്രോൾ കാർ',
      hybrid: 'ഹൈബ്രിഡ് കാർ',
      ev: 'ഇലക്ട്രിക് വാഹനം',
      bus: 'പൊതു ബസ്',
      bike: 'സൈക്കിൾ / നടപ്പ്'
    }
  };

  const activeLabels = localLabels[lang] || localLabels.en;

  const modes = [
    { id: 'suv', name: activeLabels.suv, multiplier: 0.35, color: 'bg-rose-500' },
    { id: 'gasCar', name: activeLabels.gasCar, multiplier: 0.28, color: 'bg-orange-500' },
    { id: 'bus', name: activeLabels.bus, multiplier: 0.11, color: 'bg-amber-500' },
    { id: 'hybrid', name: activeLabels.hybrid, multiplier: 0.08, color: 'bg-lime-500' },
    { id: 'ev', name: activeLabels.ev, multiplier: 0.03, color: 'bg-emerald-450' },
    { id: 'bike', name: activeLabels.bike, multiplier: 0.00, color: 'bg-emerald-600' }
  ];

  // Calculate comparisons
  const suvEmissions = distance * 0.35;
  const bikeEmissions = 0;
  const savings = Number((suvEmissions - bikeEmissions).toFixed(2));
  const trees = Math.round(savings / 0.06); // ~0.06 kg absorbed per tree per day

  // Find max emission value for scaling progress bars
  const maxEmissions = 100 * 0.35; // 35kg

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl shadow-slate-950/25">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-emerald-300">{activeLabels.title}</h2>
        <p className="text-sm text-slate-400 mt-1">{activeLabels.subtitle}</p>
      </div>

      <div className="space-y-6">
        {/* Slider input */}
        <div className="rounded-3xl bg-slate-950/80 p-5">
          <div className="flex justify-between items-center text-sm font-semibold mb-4 text-slate-350">
            <span>{activeLabels.distance}</span>
            <span className="text-emerald-400 font-mono text-lg">{distance} km</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={distance}
            onChange={(e) => setDistance(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-slate-800 accent-emerald-500 focus:outline-none"
          />
        </div>

        {/* Visual Comparison Chart */}
        <div className="rounded-3xl bg-slate-950/80 p-5 space-y-4">
          <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2">{activeLabels.selectMode}</p>
          <div className="space-y-3.5">
            {modes.map((mode) => {
              const currentEmission = Number((distance * mode.multiplier).toFixed(2));
              const percent = maxEmissions > 0 ? (currentEmission / maxEmissions) * 100 : 0;

              return (
                <div key={mode.id} className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-350">
                    <span>{mode.name}</span>
                    <span className="font-mono text-slate-400">{currentEmission} kg CO₂</span>
                  </div>
                  <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-550 ease-out ${mode.color}`}
                      style={{ width: `${Math.max(1.5, percent)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic educational feedback */}
        {distance > 0 && (
          <div className="rounded-3xl border border-emerald-500/15 bg-emerald-500/5 p-5 text-sm text-slate-300 leading-relaxed text-center">
            {activeLabels.comparisonText
              .replace('{{savings}}', savings)
              .replace('{{trees}}', trees)
              .split('**').map((chunk, index) => 
                index % 2 === 1 ? <strong key={index} className="text-emerald-300 font-bold">{chunk}</strong> : chunk
              )
            }
          </div>
        )}
      </div>
    </section>
  );
}

export default TravelSimulator;
