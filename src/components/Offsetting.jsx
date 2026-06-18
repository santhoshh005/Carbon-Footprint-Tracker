import { useState } from 'react';
import { useTranslation } from 'react-i18next';

function Offsetting({ challengePoints = 0, offsetTotal = 0, onPurchase }) {
  const { i18n } = useTranslation();
  const [successMsg, setSuccessMsg] = useState('');

  const lang = (i18n.language || 'en').split('-')[0];

  const labels = {
    en: {
      title: 'Carbon Offsetting',
      subtitle: 'Sponsor green projects using challenge points to offset your remaining emissions.',
      pts: 'Challenge Points',
      totalOffset: 'Total Offset',
      offsetNow: 'Offset Now',
      insufficientPoints: 'Need more points',
      project1: 'Tree Planting Drive',
      desc1: 'Plant native trees in deforested areas to absorb atmospheric CO2.',
      project2: 'Solar Power Plant',
      desc2: 'Fund solar panels to replace fossil fuel energy in local grids.',
      project3: 'Ocean Cleanup Initiative',
      desc3: 'Remove plastic waste from water bodies, preventing marine pollution.',
      successMsg: 'Thank you for your sponsorship! Offset applied successfully.'
    },
    hi: {
      title: 'कार्बन ऑफसेटिंग',
      subtitle: 'अपने शेष उत्सर्जन की भरपाई के लिए चुनौती अंकों का उपयोग करके हरित परियोजनाओं को प्रायोजित करें।',
      pts: 'चुनौती अंक',
      totalOffset: 'कुल ऑफसेट',
      offsetNow: 'अभी ऑफसेट करें',
      insufficientPoints: 'अधिक अंकों की आवश्यकता',
      project1: 'वृक्षारोपण अभियान',
      desc1: 'वायुमंडलीय CO2 को अवशोषित करने के लिए वनों की कटाई वाले क्षेत्रों में देशी पेड़ लगाएं।',
      project2: 'सौर ऊर्जा संयंत्र',
      desc2: 'स्थानीय ग्रिड में जीवाश्म ईंधन ऊर्जा को बदलने के लिए सौर पैनलों को निधि दें।',
      project3: 'महासागर सफाई पहल',
      desc3: 'जल निकायों से प्लास्टिक कचरे को हटाना, समुद्री प्रदूषण को रोकना।',
      successMsg: 'आपके प्रायोजन के लिए धन्यवाद! ऑफसेट सफलतापूर्वक लागू किया गया।'
    },
    te: {
      title: 'కార్బన్ ఆఫ్సెటింగ్',
      subtitle: 'ఛాలెంజ్ పాయింట్లతో పర్యావరణ అనుకూల ప్రాజెక్టులకు నిధులు అందించి ఉద్గారాలను తగ్గించండి.',
      pts: 'ఛాలెంజ్ పాయింట్లు',
      totalOffset: 'మొత్తం తగ్గించినది',
      offsetNow: 'నిధులు అందించు',
      insufficientPoints: 'పాయింట్లు సరిపోవు',
      project1: 'వృక్షో రక్షతి రక్షితః',
      desc1: 'వాతావరణంలో కార్బన్ తగ్గించడానికి అడవులు నశించిన చోట స్థానిక మొక్కలు నాటండి.',
      project2: 'సౌర విద్యుత్ ప్లాంట్',
      desc2: 'సాంప్రదాయ విద్యుత్ స్థానంలో సోలార్ గ్రిడ్ల ఏర్పాటుకు మద్దతు ఇవ్వండి.',
      project3: 'సముద్రాల శుద్ధి',
      desc3: 'സമുദ്രങ്ങൾ మరియు నదులలో ప్లాస్టిక్ వ్యర్థాలను తొలగించి జీవవైవిధ్యాన్ని రక్షించండి.',
      successMsg: 'మీ మద్దతుకు ధన్యవాదాలు! కార్బൻ విజయవంతంగా తగ్గించబడింది.'
    },
    ta: {
      title: 'கார்பன் ஆஃப்செட்டிங்',
      subtitle: 'உங்கள் மீதமுள்ள உமிழ்வை ஈடுசெய்ய சவால் புள்ளிகளைப் பயன்படுத்தி பசுமைத் திட்டங்களுக்கு நிதியுதவி செய்யுங்கள்.',
      pts: 'சவால் புள்ளிகள்',
      totalOffset: 'மொத்த ஆஃப்செட்',
      offsetNow: 'ஆஃப்செட் செய்க',
      insufficientPoints: 'புள்ளிகள் போதாது',
      project1: 'மரநடுகை இயக்கம்',
      desc1: 'வளிமண்டல CO2 ஐ உறிஞ்சுவதற்கு காடழிக்கப்பட்ட பகுதிகளில் மரங்களை நடவும்.',
      project2: 'சூரிய மின் நிலையம்',
      desc2: 'உள்ளூர் கட்டங்களில் புதைபடிவ எரிபொருள் ஆற்றலை மாற்ற சோலார் பேனல்களுக்கு நிதியளிக்கவும்.',
      project3: 'கடல் தூய்மைப்படுத்தும் திட்டம்',
      desc3: 'நீர்நிலைகளில் இருந்து பிளாஸ்டிக் கழிவுகளை அகற்றுதல், கடல் மாசுபாட்டைத் தடுத்தல்.',
      successMsg: 'உங்கள் ஆதரவிற்கு நன்றி! கார்பன் ஆஃப்செட் வெற்றிகரமாக பயன்படுத்தப்பட்டது.'
    },
    kn: {
      title: 'ಕಾರ್ಬൻ ಆಫ್‌ಸೆಟಿಂಗ್',
      subtitle: 'ಉಳಿದಿರುವ ಇಂಗಾಲದ ಹೊರಸೂಸುವಿಕೆಯನ್ನು ಸರಿದೂಗಿಸಲು ಸವಾಲು ಅಂಕಗಳನ್ನು ಬಳಸಿ ಹസിರು ಯೋಜನೆಗಳನ್ನು ಪ್ರಾಯೋಜಿಸಿ.',
      pts: 'ಸವಾಲು ಅಂಕಗಳು',
      totalOffset: 'ಒಟ್ಟು ಆಫ್‌ಸೆಟ್',
      offsetNow: 'ಈಗಲೇ ಪ್ರಾಯೋಜಿಸಿ',
      insufficientPoints: 'ಹೆಚ್ಚಿನ ಅಂಕಗಳ ಅಗತ್ಯವಿದೆ',
      project1: 'ವೃಕ್ಷಾರೋಪಣ ಅಭಿಯಾನ',
      desc1: 'ವಾತಾವರಣದ CO2 ಅನ್ನು ಹೀರಿಕೊಳ್ಳಲು ಕಾಡು ನಾಶವಾದ ಪ್ರದೇಶಗಳಲ್ಲಿ ಸ್ಥಳೀಯ ಮರಗಳನ್ನು ನೆಡಿ.',
      project2: 'ಸೌರ ವಿದ್ಯುತ್ ಸ್ಥಾವರ',
      desc2: 'ಸ್ಥಳೀಯ ಗ್ರಿಡ್‌ಗಳಲ್ಲಿ ಪಳೆಯುಳಿಕೆ ಇಂಧನ ಶಕ್ತಿಯನ್ನು ಬದಲಿಸಲು ಸೌರ ಫಲಕಗಳಿಗೆ ಧನಸಹಾಯ ನೀಡಿ.',
      project3: 'ಸಮುದ್ರ ಸ್ವಚ್ಛತಾ ಉಪಕ್ರಮ',
      desc3: 'ಜಲಮೂಲಗಳಿಂದ ಪ್ಲಾಸ್ಟಿಕ್ ತ್ಯಾಜ್ಯವನ್ನು ತೆಗೆದುಹಾಕುವುದು ಮತ್ತು ಕಡಲ ಮಾಲಿನ್ಯ ತಡೆಯುವುದು.',
      successMsg: 'ನಿಮ್ಮ ಪ್ರಾಯೋಜಕತ್ವಕ್ಕೆ ಧನ್ಯವಾದಗಳು! ಆಫ್‌ಸೆಟ್ ಯಶಸ್ವಿಯಾಗಿ ಅನ್ವയಿಸಲಾಗಿದೆ.'
    },
    ml: {
      title: 'കാർബൺ ഓഫ്സെറ്റിംഗ്',
      subtitle: 'അവശേഷിക്കുന്ന കാർബൺ പുറന്തള്ളൽ നികത്താൻ ചലഞ്ച് പോയിന്റുകൾ ഉപയോഗിച്ച് ഹരിത പദ്ധതികൾ സ്പോൺസർ ചെയ്യുക.',
      pts: 'ചലഞ്ച് പോയിന്റുകൾ',
      totalOffset: 'ആകെ കുറച്ചത്',
      offsetNow: 'ഇപ്പോൾ ചെയ്യുക',
      insufficientPoints: 'പോയിന്റുകൾ തികയില്ല',
      project1: 'വൃക്ഷത്തൈ നടീൽ യജ്ഞം',
      desc1: 'അന്തരീക്ഷ കാർബൺ ആഗിരണം ചെയ്യാൻ കാടുകൾ നശിച്ച സ്ഥലങ്ങളിൽ മരങ്ങൾ നടുക.',
      project2: 'സോളാർ പവർ പ്ലാന്റ്',
      desc2: 'ഫോസിൽ ഇന്ധനങ്ങൾക്കു പകരം സൗരോർജ്ജം കൊണ്ടുവരാൻ സോളാർ പാനലുകൾ സ്ഥാപിക്കുക.',
      project3: 'സമുദ്ര ശുചീകരണ പദ്ധതി',
      desc3: 'ജലാശയങ്ങളിൽ നിന്നുള്ള പ്ലാസ്റ്റിക് മാലിന്യങ്ങൾ നീക്കം ചെയ്ത് സമുദ്ര മലിനീകരണം തടയുക.',
      successMsg: 'നിങ്ങളുടെ പങ്കാളിത്തത്തിന് നന്ദി! ഓഫ്സെറ്റിംഗ് വിജയകരമായി പൂർത്തിയായി.'
    }
  };

  const activeLabels = labels[lang] || labels.en;

  const projects = [
    {
      id: 'tree',
      title: activeLabels.project1,
      desc: activeLabels.desc1,
      cost: 50,
      offset: 10
    },
    {
      id: 'solar',
      title: activeLabels.project2,
      desc: activeLabels.desc2,
      cost: 80,
      offset: 18
    },
    {
      id: 'ocean',
      title: activeLabels.project3,
      desc: activeLabels.desc3,
      cost: 100,
      offset: 25
    }
  ];

  const handleBuy = (project) => {
    if (challengePoints < project.cost) return;

    if (onPurchase) {
      onPurchase(project.cost, project.offset);
    }

    setSuccessMsg(activeLabels.successMsg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl shadow-slate-950/25">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-emerald-300">
            <span className="term-tooltip" data-explanation="Carbon Offsetting: Compesating for emissions you cannot reduce by funding environmental projects elsewhere—such as forest restorations, ocean plastic cleanups, or solar farms.">Carbon Offsetting</span>
          </h2>
          <p className="text-sm text-slate-400">{activeLabels.subtitle}</p>
        </div>
        <div className="flex gap-4">
          <div className="rounded-2xl border border-slate-850 bg-slate-950/80 px-4 py-2 text-center">
            <p className="text-[10px] uppercase tracking-wide text-slate-500">{activeLabels.pts}</p>
            <p className="text-lg font-bold text-sky-400">{challengePoints}</p>
          </div>
          <div className="rounded-2xl border border-slate-850 bg-slate-950/80 px-4 py-2 text-center">
            <p className="text-[10px] uppercase tracking-wide text-slate-500">{activeLabels.totalOffset}</p>
            <p className="text-lg font-bold text-emerald-400">{offsetTotal} kg</p>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="mb-6 rounded-2xl border border-emerald-500/20 bg-emerald-950/20 px-4 py-3 text-sm text-emerald-400 font-semibold text-center">
          {successMsg}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-3">
        {projects.map((project) => {
          const canAfford = challengePoints >= project.cost;

          return (
            <article
              key={project.id}
              className="flex flex-col justify-between rounded-3xl border border-slate-800 bg-slate-950/80 p-5 hover:border-slate-700 transition"
            >
              <div>
                <h3 className="text-lg font-semibold text-slate-100 mb-2">{project.title}</h3>
                <p className="text-xs leading-5 text-slate-400 mb-4">{project.desc}</p>
              </div>

              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">{activeLabels.pts}:</span>
                  <span className="font-semibold text-sky-400">{project.cost} pts</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Offset Impact:</span>
                  <span className="font-semibold text-emerald-400">-{project.offset} kg CO₂</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleBuy(project)}
                  disabled={!canAfford}
                  className={`w-full rounded-2xl py-2.5 text-xs font-semibold transition ${
                    canAfford
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md'
                      : 'bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {canAfford ? activeLabels.offsetNow : activeLabels.insufficientPoints}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default Offsetting;
