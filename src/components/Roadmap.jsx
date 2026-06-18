import { useState } from 'react';
import { useTranslation } from 'react-i18next';

function Roadmap({ roadmapProgress = [], onToggleTask }) {
  const { i18n } = useTranslation();
  const [expandedWeek, setExpandedWeek] = useState(1);

  const lang = (i18n.language || 'en').split('-')[0];

  const localLabels = {
    en: {
      title: '4-Week Net-Zero Roadmap',
      subtitle: 'Track your personal path to carbon neutrality week-by-week.',
      progress: 'Net-Zero Roadmap Progress',
      tasksCompleted: 'tasks completed',
      w1: 'Week 1: Carbon Awareness & Auditing',
      w1_1: 'Log daily carbon emissions in the Calculator.',
      w1_2: 'Complete a Daily Eco Quiz.',
      w1_3: 'Audit your home for standby power leaks.',
      w2: 'Week 2: Sustainable Commuting',
      w2_1: 'Try different distances in the Travel Simulator.',
      w2_2: 'Accept the No Car Week challenge.',
      w2_3: 'Choose public transit, walking, or biking for a trip.',
      w3: 'Week 3: Dietary & Waste Habits',
      w3_1: 'Try vegan or vegetarian meals for two days.',
      w3_2: 'Accept the Zero Plastic Challenge.',
      w3_3: 'Avoid single-use plastics for 48 hours.',
      w4: 'Week 4: Energy Efficiency & Offsets',
      w4_1: 'Lower daily electricity usage below 10 kWh.',
      w4_2: 'Sponsor a carbon offset project.',
      w4_3: 'Plant a tree or support local green drives.'
    },
    hi: {
      title: '4-सप्ताह का नेट-ज़ीरो रोडमैप',
      subtitle: 'सप्ताह-दर-सप्ताह कार्बन तटस्थता के लिए अपने व्यक्तिगत पथ को ट्रैक करें।',
      progress: 'नेट-ज़ीरो रोडमैप प्रगति',
      tasksCompleted: 'कार्य पूर्ण',
      w1: 'सप्ताह 1: कार्बन जागरूकता और ऑडिटिंग',
      w1_1: 'कैलकुलेटर में दैनिक कार्बन उत्सर्जन लॉग करें।',
      w1_2: 'एक दैनिक इको प्रश्नोत्तरी पूरी करें।',
      w1_3: 'स्टैंडबाय बिजली रिसाव के लिए अपने घर का ऑडिट करें।',
      w2: 'सप्ताह 2: सतत आवागमन',
      w2_1: 'ट्रैवल सिम्युलेटर में विभिन्न दूरियों का प्रयास करें।',
      w2_2: 'नो कार वीक चुनौती स्वीकार करें।',
      w2_3: 'यात्रा के लिए सार्वजनिक परिवहन, पैदल चलना या साइकिल चुनना।',
      w3: 'सप्ताह 3: आहार और अपशिष्ट आदतें',
      w3_1: 'दो दिनों के लिए शाकाहारी भोजन का प्रयास करें।',
      w3_2: 'जीरो प्लास्टिक चुनौती स्वीकार करें।',
      w3_3: '48 घंटों के लिए सिंगल-यूज़ प्लास्टिक से बचें।',
      w4: 'सप्ताह 4: ऊर्जा दक्षता और ऑफसेट',
      w4_1: 'दैनिक बिजली का उपयोग 10 kWh से कम करें।',
      w4_2: 'एक कार्बन ऑफसेट परियोजना को प्रायोजित करें।',
      w4_3: 'एक पेड़ लगाएं या स्थानीय हरित अभियानों का समर्थन करें।'
    },
    te: {
      title: '4-వారాల నెట్-జీరో కార్యాచరణ',
      subtitle: 'వారం వారీగా మీ నికర శూన్య కార్బన్ లక్ష్యాన్ని సాధించండి.',
      progress: 'నెట్-జీరో ప్రగతి నివేదిక',
      tasksCompleted: 'పనులు పూర్తయ్యాయి',
      w1: 'వారం 1: కార్బన్ గుర్తింపు మరియు విశ్లేషణ',
      w1_1: 'రోజువారీ కార్బన్ లెక్కలను క్యాలిక్యులేటర్ లో నమోదు చేయండి.',
      w1_2: 'రోజువారీ ఇకో క్విజ్ లో పాల్గొనండి.',
      w1_3: 'ఇంట్లో అనవసరంగా ఖర్చవుతున్న కరెంట్ ను ఆదా చేయండి.',
      w2: 'వారం 2: పర్యావరణ అనుకూల ప్రయాణాలు',
      w2_1: 'ట్రావెల్ సిమ్యులేటర్ లో వేర్వేరు రవాణా పద్ధతులను పరిశీలించండి.',
      w2_2: 'नो కార్ వీక్ ఛాలెంజ్ ను అంగీకరించండి.',
      w2_3: 'కారు/బైక్ కాకుండా బస్సు, నడక లేదా సైకిల్ ఎంచుకోండి.',
      w3: 'వారం 3: ఆహారం మరియు వ్యర్థాల నియంత్రణ',
      w3_1: 'కనీസം రెండు రోజుల పాటు వీగన్ లేదా శాఖాహారం తీసుకోండి.',
      w3_2: 'జీరో ప్లాస్టిక్ ఛాలెంజ్ ను అంగీకరించండి.',
      w3_3: '48 గంటల పాటు ఒకేసారి వాడే ప్లాస్టిక్ వస్తువులను వాడకండి.',
      w4: 'వారం 4: విద్యుత్ ఆదా మరియు ఆఫ్సెటింగ్',
      w4_1: 'రోజువారీ విద్యుత్ వాడకాన్ని 10 kWh లోపలికి తగ్గించండి.',
      w4_2: 'కార్బన్ ఆఫ్సెట్ ప్రాజెక్ట్ కి స్పాన్సర్ చేయండి.',
      w4_3: 'మొక్కలు నాటండి లేదా స్థానిక పర్యావరణ కార్యక్రమాలకు మద్దతు ఇవ్వండి.'
    },
    ta: {
      title: '4-வார நிகர-பூஜ்ஜிய வழிகாட்டி',
      subtitle: 'வாரம் வாரம் கார்பன் நடுநிலையை நோக்கிய உங்கள் பயணத்தை கண்காணிக்கவும்.',
      progress: 'நிகர-பூஜ்ஜிய வழிகாட்டி முன்னேற்றம்',
      tasksCompleted: 'பணிகள் முடிவடைந்தன',
      w1: 'வாரம் 1: கார்பன் விழிப்புணர்வு & தணிக்கை',
      w1_1: 'கணக்கியலில் தினசரி கார்பன் உமிழ்வை பதிவு செய்யவும்.',
      w1_2: 'தினசரி சுற்றுச்சூழல் வினாடி வினாவை முடிக்கவும்.',
      w1_3: 'வீட்டில் தேவையற்ற மின் விரயத்தை கண்டறிந்து தவிர்க்கவும்.',
      w2: 'வாரம் 2: நிலையான பயணம்',
      w2_1: 'பயண சிமுலேட்டரில் வெவ்வேறு தூரங்களை முயற்சிக்கவும்.',
      w2_2: 'நோ கார் வாரம் சவாலை ஏற்கவும்.',
      w2_3: 'பயணத்திற்கு பொது போக்குவரத்து, நடை அல்லது மிதிவண்டியைத் தேர்வு செய்யவும்.',
      w3: 'வாரம் 3: உணவு & கழிவு பழக்கங்கள்',
      w3_1: 'இரண்டு நாட்களுக்கு சைவ உணவுகளை முயற்சிக்கவும்.',
      w3_2: 'பூஜ்ஜிய பிளாஸ்டிக் சவாலை ஏற்கவும்.',
      w3_3: '48 மணி நேரத்திற்கு ஒருமுறை பயன்படுத்தும் பிளாஸ்டிக்கைத் தவிர்க்கவும்.',
      w4: 'வாரம் 4: ஆற்றல் திறன் & ஆஃப்செட்டுகள்',
      w4_1: 'தினசரி மின்சார பயன்பாட்டை 10 kWh க்குக் கீழே குறைக்கவும்.',
      w4_2: 'ஒரு கார்பன் ஆஃப்செட் திட்டத்திற்கு நிதியுதவி செய்யுங்கள்.',
      w4_3: 'ஒரு மரத்தை நடவும் அல்லது உள்ளூர் பசுமை இயக்கங்களை ஆதரிக்கவும்.'
    },
    kn: {
      title: '4-ವಾರಗಳ ನೆಟ್-ಝೀರೋ ರೋಡ್‌ಮ್ಯಾಪ್',
      subtitle: 'ವಾರದಿಂದ ವಾರಕ್ಕೆ ಇಂಗಾಲದ ತಟಸ್ಥತೆಯ ಕಡೆಗೆ ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಹಾದಿಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ.',
      progress: 'ನೆಟ್-ಝೀರೋ ಪ್ರಗತಿ',
      tasksCompleted: 'ಕಾರ್ಯಗಳು ಪೂರ್ಣಗೊಂಡಿವೆ',
      w1: 'ವಾರ 1: ಇಂಗಾಲದ ಅರಿವು ಮತ್ತು ಆಡಿಟಿಂಗ್',
      w1_1: 'ಕ್ಯಾಲ್ಕುಲೇಟರ್‌ನಲ್ಲಿ ದೈನಂದಿನ ಇಂಗಾಲದ ಹೊರಸೂಸುವಿಕೆಯನ್ನು ನಮೂದಿಸಿ.',
      w1_2: 'ದೈನಂದಿನ ಪರಿಸರ ರಸಪ್ರಶ್ನೆ ಪೂರ್ಣಗೊಳಿಸಿ.',
      w1_3: 'ಮನೆಯಲ್ಲಿ ವ್ಯರ್ಥವಾಗುತ್ತಿರುವ ವಿದ್ಯುತ್ ಸೋರಿಕೆಯನ್ನು ತಡೆಗಟ್ಟಿ.',
      w2: 'ವಾರ 2: ಸುಸ್ಥಿರ ಪ್ರಯಾಣ',
      w2_1: 'ಟ್ರಾವೆಲ್ ಸಿಮ್ಯುಲೇಟರ್‌ನಲ್ಲಿ ವಿಭಿನ್ನ ಪ್ರಯಾಣ ವಿಧಾನ ಪರಿಶೀಲಿಸಿ.',
      w2_2: 'ನೋ ಕಾರ್ ವೀಕ್ ಸವಾಲನ್ನು ಸ್ವೀಕರಿಸಿ.',
      w2_3: 'ಪ್ರಯಾಣಕ್ಕಾಗಿ ಸಾರ್ವಜನಿಕ ಸಾರಿಗೆ, ನಡಿಗೆ ಅಥವಾ ಸೈಕಲ್ ಬಳಸಿ.',
      w3: 'ವಾರ 3: ಆಹಾರ ochu ತ್ಯಾಜ್ಯ ಅಭ್ಯಾಸಗಳು',
      w3_1: 'ಎರಡು ದಿನಗಳ ಕಾಲ ಸಂಪೂರ್ಣ ಸಸ್ಯಾಹಾರವನ್ನು ಪ್ರಯತ್ನಿಸಿ.',
      w3_2: 'ಝೀರೋ ಪ್ಲಾಸ್ಟಿಕ್ ಸವಾಲನ್ನು ಸ್ವೀಕರಿಸಿ.',
      w3_3: '48 ಗಂಟೆಗಳ ಕಾಲ ಒಮ್ಮೆ ಬಳಸುವ ಪ್ಲಾಸ್ಟಿಕ್ ಬಳಸಬೇಡಿ.',
      w4: 'ವಾರ 4: ಇಂಧನ ದಕ್ಷತೆ ಮತ್ತು ಆಫ್‌ಸೆಟ್‌ಗಳು',
      w4_1: 'ದೈನಂದಿನ ವಿದ್ಯುತ್ ಬಳಕೆಯನ್ನು 10 kWh ಗಿಂತ ಕಡಿಮೆ ಮಾಡಿ.',
      w4_2: 'ಇಂಗಾಲದ ಆಫ್‌ಸೆಟ್ ಯೋಜನೆಗೆ ಹಣಕಾಸಿನ ನೆರವು ನೀಡಿ.',
      w4_3: 'ಗಿಡ ನೆಡಿ ಅಥವಾ ಸ್ಥಳೀಯ ಪರಿಸರ ಕಾಳಜಿಗೆ ಬೆಂಬಲ ನೀಡಿ.'
    },
    ml: {
      title: '4-ആഴ്ച നെറ്റ്-സീറോ റോഡ്മാപ്പ്',
      subtitle: 'കാർബൺ നിഷ്പക്ഷതയിലേക്കുള്ള നിങ്ങളുടെ വ്യക്തിഗത യാത്ര ഓരോ ആഴ്ചയും ട്രാക്ക് ചെയ്യുക.',
      progress: 'നെറ്റ്-സീറോ പുരോഗതി',
      tasksCompleted: 'ജോലികൾ പൂർത്തിയായി',
      w1: 'ആഴ്ച 1: കാർബൺ അവബോധവും ഓഡിറ്റിംഗും',
      w1_1: 'കണക്കുകൂട്ടലിൽ ദിവസേനയുള്ള കാർബൺ പുറന്തള്ളൽ രേഖപ്പെടുത്തുക.',
      w1_2: 'ദിനപത്ര ക്വിസ് പൂർത്തിയാക്കുക.',
      w1_3: 'വീട്ടിലെ അനാവശ്യ വൈദ്യുതി പാഴാക്കലുകൾ പരിശോധിക്കുക.',
      w2: 'ആഴ്ച 2: സുസ്ഥിര യാത്ര',
      w2_1: 'ട്രാവൽ സിമുലേറ്ററിൽ വിവിധ യാത്രാ ദൂരങ്ങൾ പരീക്ഷിക്കുക.',
      w2_2: 'നോ കാർ വീക്ക് ചലഞ്ച് സ്വീകരിക്കുക.',
      w2_3: 'യാത്രയ്ക്കായി പൊതുഗതാഗതം, നടത്തം അല്ലെങ്കിൽ സൈക്കിൾ തിരഞ്ഞെടുക്കുക.',
      w3: 'ആഴ്ച 3: ഭക്ഷണവും മാലിന്യ ശീലങ്ങളും',
      w3_1: 'രണ്ട് ദിവസത്തേക്ക് പൂർണ്ണമായി സസ്യാഹാരം പരീക്ഷിക്കുക.',
      w3_2: 'സീറോ പ്ലാസ്റ്റിക് ചലഞ്ച് സ്വീകരിക്കുക.',
      w3_3: '48 മണിക്കൂർ നേരത്തേക്ക് ഒരു തവണ ഉപയോഗിക്കുന്ന പ്ലാസ്റ്റിക്കുകൾ ഒഴിവാക്കുക.',
      w4: 'ആഴ്ച 4: ഊർജ്ജ കാര്യക്ഷമതയും ഓഫ്സെറ്റുകളും',
      w4_1: 'ദിവസേനയുള്ള വൈദ്യുതി ഉപയോഗം 10 kWh-ൽ താഴെയാക്കുക.',
      w4_2: 'ഒരു കാർബൺ ഓഫ്സെറ്റ് പ്രോജക്റ്റ് സ്പോൺസർ ചെയ്യുക.',
      w4_3: 'മരം നടുകയോ പ്രാദേശിക പരിസ്ഥിതി പ്രവർത്തനങ്ങളെ പിന്തുണയ്ക്കുകയോ ചെയ്യുക.'
    }
  };

  const activeLabels = localLabels[lang] || localLabels.en;

  const roadmapData = [
    {
      weekNumber: 1,
      title: activeLabels.w1,
      tasks: [
        { id: 'w1_logs', text: activeLabels.w1_1 },
        { id: 'w1_quiz', text: activeLabels.w1_2 },
        { id: 'w1_check', text: activeLabels.w1_3 }
      ]
    },
    {
      weekNumber: 2,
      title: activeLabels.w2,
      tasks: [
        { id: 'w2_sim', text: activeLabels.w2_1 },
        { id: 'w2_accept', text: activeLabels.w2_2 },
        { id: 'w2_public', text: activeLabels.w2_3 }
      ]
    },
    {
      weekNumber: 3,
      title: activeLabels.w3,
      tasks: [
        { id: 'w3_diet', text: activeLabels.w3_1 },
        { id: 'w3_challenge', text: activeLabels.w3_2 },
        { id: 'w3_waste', text: activeLabels.w3_3 }
      ]
    },
    {
      weekNumber: 4,
      title: activeLabels.w4,
      tasks: [
        { id: 'w4_electricity', text: activeLabels.w4_1 },
        { id: 'w4_offset', text: activeLabels.w4_2 },
        { id: 'w4_tree', text: activeLabels.w4_3 }
      ]
    }
  ];

  const totalTasks = 12;
  const completedTasksCount = roadmapProgress.length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0;

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl shadow-slate-950/25">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-emerald-300">
            4-Week <span className="term-tooltip" data-explanation="Net-Zero: Cutting greenhouse gas emissions to as close to zero as possible (e.g. through clean commutes and energy efficiency), with any remaining emissions re-absorbed.">Net-Zero</span> Roadmap
          </h2>
          <p className="text-sm text-slate-400 mt-1">{activeLabels.subtitle}</p>
        </div>
      </div>

      {/* Progress Bar Display */}
      <div className="rounded-3xl bg-slate-950/80 p-5 mb-6 space-y-3">
        <div className="flex justify-between items-center text-xs font-semibold text-slate-300">
          <span>{activeLabels.progress}</span>
          <span className="text-emerald-450 font-mono">
            {completedTasksCount} / {totalTasks} {activeLabels.tasksCompleted} ({progressPercent}%)
          </span>
        </div>
        <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Accordion / Weeks List */}
      <div className="space-y-4">
        {roadmapData.map((week) => {
          const isOpen = expandedWeek === week.weekNumber;
          const completedInWeek = week.tasks.filter(t => roadmapProgress.includes(t.id)).length;

          return (
            <div
              key={week.weekNumber}
              className={`rounded-3xl border border-slate-800 bg-slate-950/40 overflow-hidden transition-all duration-300 ${
                isOpen ? 'border-slate-700 bg-slate-950/70' : 'hover:border-slate-700'
              }`}
            >
              <button
                type="button"
                onClick={() => setExpandedWeek(isOpen ? 0 : week.weekNumber)}
                className="flex w-full items-center justify-between px-5 py-4 text-left font-semibold text-slate-200 focus:outline-none"
              >
                <div className="flex items-center gap-3">
                  <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                    completedInWeek === 3 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {week.weekNumber}
                  </span>
                  <span>{week.title}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span>{completedInWeek} / 3</span>
                  <span>{isOpen ? '▲' : '▼'}</span>
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 border-t border-slate-800/50 space-y-3">
                  {week.tasks.map((task) => {
                    const isChecked = roadmapProgress.includes(task.id);

                    return (
                      <label
                        key={task.id}
                        className={`flex items-start gap-3.5 rounded-2xl border px-4 py-3 cursor-pointer transition-all ${
                          isChecked
                            ? 'border-emerald-500/20 bg-emerald-950/10 text-emerald-350 shadow-[0_0_15px_rgba(16,185,129,0.03)]'
                            : 'border-slate-850 bg-slate-950/50 text-slate-350 hover:border-slate-700 hover:bg-slate-950/80'
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="mt-1.5 h-4 w-4 rounded border-slate-700 bg-slate-850 text-emerald-500 focus:ring-emerald-500/30 accent-emerald-500"
                          checked={isChecked}
                          onChange={() => onToggleTask && onToggleTask(task.id)}
                        />
                        <span className="text-sm font-medium leading-relaxed">{task.text}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Roadmap;
