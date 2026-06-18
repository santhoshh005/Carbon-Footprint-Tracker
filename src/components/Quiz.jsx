import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

function Quiz({ challengePoints = 0, quizCompletedDate = '', onComplete }) {
  const { i18n } = useTranslation();
  const [selectedOption, setSelectedOption] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);

  const lang = (i18n.language || 'en').split('-')[0];

  const labels = {
    en: {
      title: 'Daily Eco Quiz',
      subtitle: 'Test your eco-knowledge and earn challenge points.',
      completed: "You have answered today's quiz! Come back tomorrow for a new question.",
      correct: 'Correct! +10 Points awarded.',
      incorrect: 'Incorrect. Better luck tomorrow!',
      submit: 'Submit Answer',
      pts: 'Challenge Points'
    },
    hi: {
      title: 'दैनिक इको प्रश्नोत्तरी',
      subtitle: 'अपने पर्यावरण-ज्ञान का परीक्षण करें और अंक अर्जित करें।',
      completed: 'आपने आज की प्रश्नोत्तरी का उत्तर दे दिया है! नए प्रश्न के लिए कल वापस आएं।',
      correct: 'सही उत्तर! +10 अंक प्रदान किए गए।',
      incorrect: 'गलत उत्तर। कल बेहतर भाग्य की कामना!',
      submit: 'उत्तर जमा करें',
      pts: 'चुनौती अंक'
    },
    te: {
      title: 'రోజువారీ ఇకో క్విజ్',
      subtitle: 'పర్యావరణ జ్ఞానాన్ని పరీక్షించుకుని పాయింట్లు సంపాదించండి.',
      completed: 'మీరు ఈరోజు క్విజ్ పూర్తి చేశారు! రేపు కొత్త ప్రశ్న కోసం మళ్ళీ రండి.',
      correct: 'సరైన సమాధానం! +10 పాయింట్లు లభించాయి.',
      incorrect: 'తప్పు సమాధానం. రేపు మళ్ళీ ప్రయత్నించండి!',
      submit: 'సമാధానం పంపండి',
      pts: 'ఛాలెంజ్ పాయింట్లు'
    },
    ta: {
      title: 'தினசரி சுற்றுச்சூழல் வினாடி வினா',
      subtitle: 'சுற்றுச்சூழல் அறிவை சோதித்து சவால் புள்ளிகளைப் பெறுங்கள்.',
      completed: 'இன்றைய வினாடி வினாவிற்கு நீங்கள் பதிலளித்துவிட்டீர்கள்! புதிய கேள்விக்கு நாளை மீண்டும் வரவும்.',
      correct: 'சரியான பதில்! +10 புள்ளிகள் வழங்கப்பட்டன.',
      incorrect: 'தவறான பதில். நாளை நல்ல அதிர்ஷ்டம்!',
      submit: 'பதிலை சமர்ப்பிக்கவும்',
      pts: 'சவால் புள்ளிகள்'
    },
    kn: {
      title: 'ದೈನಂದಿನ ಪರಿಸರ ರಸಪ್ರಶ್ನೆ',
      subtitle: 'ನಿಮ್ಮ ಪರಿಸರ ಜ್ಞಾನವನ್ನು ಪರೀಕ್ಷಿಸಿ ಮತ್ತು ಅಂಕಗಳನ್ನು ಗಳಿಸಿ.',
      completed: 'ನೀವು ಇಂದಿನ ರಸಪ್ರಶ್ನೆಗೆ ಉತ್ತರಿಸಿದ್ದೀರಿ! ಹೊಸ ಪ್ರಶ್ನೆಯನ್ನು ನಾಳೆ ನೋಡಿ.',
      correct: 'ಸರಿಯಾದ ಉತ್ತರ! +10 ಅಂಕಗಳನ್ನು ನೀಡಲಾಗಿದೆ.',
      incorrect: 'ತಪ್ಪು ಉತ್ತರ. ನಾಳೆ ಉತ್ತಮ ಪ್ರಯತ್ನ ಮಾಡಿ!',
      submit: 'ಉತ್ತರವನ್ನು ಸಲ್ಲಿಸಿ',
      pts: 'ಸವಾಲು ಅಂಕಗಳು'
    },
    ml: {
      title: 'ദിനപത്ര ഇക്കോ ക്വിസ്',
      subtitle: 'പരിസ്ഥിതി അറിവ് പരീക്ഷിച്ച് പോയിന്റുകൾ നേടു.',
      completed: 'നിങ്ങൾ ഇന്നത്തെ ക്വിസ് പൂർത്തിയാക്കി കഴിഞ്ഞു! പുതിയ ചോദ്യത്തിനായി നാളെ വീണ്ടും വരിക.',
      correct: 'ശരിയായ ഉത്തരം! +10 പോയിന്റുകൾ ലഭിച്ചു.',
      incorrect: 'തെറ്റായ ഉത്തരം. നാളെ വീണ്ടും ശ്രമിക്കുക!',
      submit: 'ഉത്തരം സമർപ്പിക്കുക',
      pts: 'ചലഞ്ച് പോയിന്റുകൾ'
    }
  };

  const quizPool = {
    en: [
      {
        question: "Which of the following diets has the lowest carbon footprint?",
        options: ["Vegan (100% plant-based)", "Vegetarian (includes dairy/eggs)", "Mixed (includes poultry/fish)", "Heavy Meat-based"],
        answer: 0,
        explanation: "A vegan diet has the lowest emissions because plant crops require significantly less land, water, and energy than raising animals for food."
      },
      {
        question: "What is the most energy-efficient way to wash clothes?",
        options: ["Warm water wash & tumble dry", "Cold water wash & air dry", "Hot water wash & air dry", "Warm water wash & air dry"],
        answer: 1,
        explanation: "Heating water accounts for 90% of a washing machine's energy consumption. Line drying also avoids the high energy usage of dryers."
      },
      {
        question: "Which mode of transit produces the highest carbon emissions per passenger-kilometer?",
        options: ["Public Bus", "Subway Train", "Gasoline Car (single occupant)", "Electric Bicycle"],
        answer: 2,
        explanation: "Driving a solo gasoline passenger vehicle is highly inefficient, producing much more CO2 per person than shared transit or micromobility."
      }
    ],
    hi: [
      {
        question: "निम्नलिखित में से किस आहार का कार्बन पदचिह्न सबसे कम है?",
        options: ["शाकाहारी (100% पौधों पर आधारित)", "दुग्ध-शाकाहारी (डेयरी/अंडे शामिल हैं)", "मिश्रित (पोल्ट्री/मछली शामिल हैं)", "भारी मांस-आधारित"],
        answer: 0,
        explanation: "शाकाहारी (Vegan) आहार में सबसे कम उत्सर्जन होता है क्योंकि पौधों की फसलों को पशुओं को पालने की तुलना में बहुत कम भूमि, पानी और ऊर्जा की आवश्यकता होती है।"
      },
      {
        question: "कपड़े धोने का सबसे ऊर्जा-कुशल तरीका क्या है?",
        options: ["गर्म पानी से धोना और ड्रायर", "ठंडे पानी से धोना और हवा में सुखाना", "बहुत गर्म पानी से धोना और हवा में सुखाना", "गुनगुने पानी से धोना और हवा में सुखाना"],
        answer: 1,
        explanation: "वाशिंग मशीन की 90% ऊर्जा पानी को गर्म करने में खर्च होती है। हवा में सुखाने से ड्रायर की भारी बिजली खपत से भी बचा जाता है।"
      },
      {
        question: "प्रति यात्री-किलोमीटर पर कौन सा परिवहन सबसे अधिक कार्बन उत्सर्जन उत्पन्न करता है?",
        options: ["सार्वजनिक बस", "मेट्रो ट्रेन", "पेट्रोल कार (एकल चालक)", "इलेक्ट्रिक साइकिल"],
        answer: 2,
        explanation: "अकेले पेट्रोल कार चलाना अत्यधिक अक्षम है, जो साझा परिवहन या इलेक्ट्रिक साइकिल की तुलना में प्रति व्यक्ति बहुत अधिक CO2 उत्पन्न करता है।"
      }
    ],
    te: [
      {
        question: "ಕಿంది వాటిలో ఏ ఆహార అలవాటు అతి తక్కువ కార్బన్ ఉద్గారాలను కలిగిస్తుంది?",
        options: ["శాకాహారం (100% ప్లాంట్ బేస్డ్)", "లాక్టో-వెజిటేరియన్ (పాలు/గుడ్లు తింటారు)", "మిశ్రమ ఆహారం (కోడి/చేపలు తింటారు)", "మాంసాహారం"],
        answer: 0,
        explanation: "మొక్కల ఆధారిత ఆహారాలకు పశువుల పెంపకం కంటే చాలా తక్కువ భూమి, నీరు మరియు శక్తి అవసరం కనుక వీగన్ ఆహారం అత్యంత పర్యావరణ అనుకూలమైనది."
      },
      {
        question: "బట్టలు ఉతకడానికి అత్యంత విద్యుత్ ఆదా చేసే పద్ధతి ఏది?",
        options: ["వేడి నీటితో ఉతికి టంబుల్ డ్రై చేయడం", "చల్లటి నీటితో ఉతికి ఆరబెట్టడం", "మరీ వేడి నీటితో ఉతికి ఆరబెట్టడం", "గోరువెచ్చని నీటితో ఉతికి ఆరబెట్టడం"],
        answer: 1,
        explanation: "వాషింగ్ మెషిన్ ఖర్చు చేసే విద్యുత్తులో 90% నీటిని వేడి చేయడానికే సరిపోతుంది. బట్టలను ఎండలో ఆరబెట్టడం వల్ల డ്രైయర్ వాడകം తప్పుతుంది."
      },
      {
        question: "ఒక ప్రయాణీకుడికి లెక్కించినప్పుడు అతి ఎక్కువ కార్బన్ ఉద్గారాలను విడుదల చేసే వాహనం ఏది?",
        options: ["ప్రజా రవాణా బస్సు", "మెట్రో రైలు", "సొంత పెట్రోల్ కార్ (ఒక్కరే ఉన్నప్పుడు)", "ఎలక్ట్రిక్ బైక్"],
        answer: 2,
        explanation: "ఒక్కరే పెట్రోల్ కారు నడపడం వల్ల ప్రయాణించే దూరాన్ని బట్టి బస్సులు లేదా మెట్రోలతో పోలిస్తే విపరీతమైన ఉద్గారాలు విడుదలవుతాయి."
      }
    ],
    ta: [
      {
        question: "பின்வரும் உணவுகளில் மிகக் குறைந்த கார்பன் தடம் கொண்டது எது?",
        options: ["சைவ உணவு (100% தாவர அடிப்படையிலானது)", "பால்/முட்டை சாப்பிடும் சைவ உணவு", "கலப்பு உணவு (கோழி/மீன் உட்பட)", "அதிக இறைச்சி அடிப்படையிலான உணவு"],
        answer: 0,
        explanation: "சைவ உணவு (Vegan) மிகக் குறைந்த உமிழ்வைக் கொண்டுள்ளது, ஏனெனில் தாவரப் பயிர்களுக்கு விலங்குகளை வளர்ப்பதை விட மிகக் குறைந்த நிலம், நீர் மற்றும் ஆற்றல் தேவைப்படுகிறது."
      },
      {
        question: "துணிகளைத் துவைக்க மிகவும் ஆற்றல் திறன் கொண்ட வழி எது?",
        options: ["வெதுவெதுப்பான நீர் துவைத்தல் & உலர்த்தி", "குளிர்ந்த நீர் துவைத்தல் & காற்றில் உலர்த்துதல்", "சுடு நீர் துவைத்தல் & காற்றில் உலர்த்துதல்", "வெதுவெதுப்பான நீர் துவைத்தல் & காற்றில் உலர்த்துதல்"],
        answer: 1,
        explanation: "சலவை இயந்திரத்தின் 90% மின் நுகர்வு தண்ணீரை சூடாக்குவதில் செலவாகிறது. காற்றில் உலர்த்துவது உலர்த்திகளின் அதிக மின் பயன்பாட்டைத் தவிர்க்கிறது."
      },
      {
        question: "ஒரு பயணிக்கு கணக்கிடும்போது மிக அதிக கார்பன் உமிழ்வை உருவாக்கும் போக்குவரத்து எது?",
        options: ["பொது பேருந்து", "மெட்ரோ ரயில்", "பெட்ரோல் கார் (ஒருவர் மட்டும்)", "மின்சார மிதிவண்டி"],
        answer: 2,
        explanation: "தனி நபர் பெட்ரோல் காரை ஓட்டுவது மிகவும் திறனற்றது, இது பகிர்வு போக்குவரத்து அல்லது மின்சார சைக்கிளை விட அதிக CO2 ஐ உருவாக்குகிறது."
      }
    ],
    kn: [
      {
        question: "ಕೆಳಗಿನ ಯಾವ ಆಹಾರ ಪದ್ಧತಿಯು ಅತ್ಯಂತ ಕಡಿಮೆ ಕಾರ್ಬನ್ ಹೆಜ್ಜೆಯನ್ನು ಹೊಂದಿದೆ?",
        options: ["ಸಸ್ಯಾಹಾರಿ (100% ಸಸ್ಯ ಆಧಾರಿತ)", "ಹಾಲಿನ ಉತ್ಪನ್ನಗಳಿರುವ ಸಸ್ಯಾಹಾರಿ", "ಮಿಶ್ರ ಆಹಾರ (ಕೋಳಿ/ಮೀನು ಒಳಗೊಂಡಂತೆ)", "ಹೆಚ್ಚು ಮಾಂಸಾಹಾರಿ"],
        answer: 0,
        explanation: "ಸಸ್ಯ ಆಧಾರಿತ ಬೆಳೆಗಳಿಗೆ ಪ್ರಾಣಿ ಸಾಕಣೆಗಿಂತ ಕಡಿಮೆ ಭೂಮಿ, ನೀರು ಮತ್ತು ಶಕ್ತಿಯ ಅಗತ್ಯವಿರುವುದರಿಂದ ಸಸ್ಯಾಹಾರಿ (Vegan) ಆಹಾರವು ಕಡಿಮೆ ಉದ್ಗಾರಗಳನ್ನು ಉತ್ಪಾದಿಸುತ್ತದೆ."
      },
      {
        question: "ಬಟ್ಟೆ ಒಗೆಯಲು ಅತ್ಯಂತ ಶಕ್ತಿ-ಸಮರ್ಥ ಮಾರ್ಗ ಯಾವುದು?",
        options: ["ಬಿಸಿ ನೀರಿನ ತೊಳೆಯುವಿಕೆ ಮತ್ತು ಡ್ರೈಯರ್", "ತಣ್ಣೀರಿನ ತೊಳೆಯುವಿಕೆ ಮತ್ತು ಗಾಳಿಯಲ್ಲಿ ಒಣಗಿಸುವುದು", "ಹೆಚ್ಚು ಬಿಸಿ ನೀರಿನ ತೊಳೆಯುವಿಕೆ ಮತ್ತು ಗಾಳಿಯಲ್ಲಿ ಒಣಗಿಸುವುದು", "ಉಗುರುಬೆಚ್ಚಗಿನ ನೀರಿನ ತೊಳೆಯುವಿಕೆ ಮತ್ತು ಒಣಗಿಸುವುದು"],
        answer: 1,
        explanation: "ವಾಷಿಂಗ್ ಮೆಷಿನ್‌ನ ಶೇ. 90 ರಷ್ಟು ವಿದ್ಯುತ್ ಬಳಕೆಯು ನೀರನ್ನು ಕಾಯಿಸಲು ವ್ಯಯವಾಗುತ್ತದೆ. ಬಟ್ಟೆಯನ್ನು ಗಾಳಿಯಲ್ಲಿ ಒಣಗಿಸುವುದರಿಂದ ಡ್ರೈಯರ್ ವಿದ್ಯುತ್ ಉಳಿತಾಯವಾಗುತ್ತದೆ."
      },
      {
        question: "ಪ್ರತಿ ಪ್ರಯಾಣಿಕನಿಗೆ ಅತಿ ಹೆಚ್ಚು ಕಾರ್ಬನ್ ಹೊರಸೂಸುವಿಕೆಯನ್ನು ಉಂಟುಮಾಡುವ ವಾಹನ ಯಾವುದು?",
        options: ["ಸಾರ್ವಜನಿಕ ಬಸ್", "ಮೆಟ್ರೋ ರೈಲು", "ಪೆಟ್ರೋಲ್ ಕಾರ್ (ಒಬ್ಬರೇ ಇರುವಾಗ)", "ಎಲೆಕ್ಟ್ರಿಕ್ ಸೈಕಲ್"],
        answer: 2,
        explanation: "ಒಬ್ಬರೇ ಪೆಟ್ರೋಲ್ ಕಾರು ಚಲಾಯಿಸುವುದು ಅತ್ಯಂತ ಅಸಮರ್ಥವಾಗಿದೆ, ಇದು ಬಸ್ ಅಥವಾ ಎಲೆಕ್ಟ್ರಿಕ್ ಸೈಕಲ್‌ಗಿಂತ ವ್ಯಕ್ತಿಗೆ ಅತಿ ಹೆಚ್ಚು CO2 ಬಿಡುಗಡೆ ಮಾಡುತ್ತದೆ."
      }
    ],
    ml: [
      {
        question: "താഴെ പറയുന്നവയിൽ ഏറ്റവും കുറഞ്ഞ കാർബൺ കാൽപ്പാടുള്ള ഭക്ഷണം ഏതാണ്?",
        options: ["സസ്യാഹാരം (100% പ്ലാന്റ് ബേസ്ഡ്)", "പാൽ/മുട്ട ഉൾപ്പെടുന്ന സസ്യാഹാരം", "മിക്സഡ് ഭക്ഷണം (കോഴി/മീൻ ഉൾപ്പെടെ)", "കൂടുതൽ മാംസാഹാരം ഉൾപ്പെട്ടത്"],
        answer: 0,
        explanation: "മൃഗസംരക്ഷണത്തേക്കാൾ വളരെ കുറഞ്ഞ ഭൂമിയും വെള്ളവും ഊർജ്ജവും സസ്യവിളകൾക്ക് ആവശ്യമുള്ളതിനാൽ സസ്യാഹാരം (Vegan) ഏറ്റവും കുറഞ്ഞ ഉmissions ഉണ്ടാക്കുന്നു."
      },
      {
        question: "തുണികൾ കഴുകാൻ ഏറ്റവും കൂടുതൽ ഊർജ്ജക്ഷമതയുള്ള മാർഗ്ഗം ഏതാണ്?",
        options: ["ചൂടുവെള്ളത്തിൽ കഴുകി ഡ്രയറിൽ ഉണക്കുക", "തണുത്ത വെള്ളത്തിൽ കഴുകി കാറ്റിൽ ഉണക്കുക", "അധികം ചൂടുവെള്ളത്തിൽ കഴുകി കാറ്റിൽ ഉണക്കുക", "ചെറിയ ചൂടുവെള്ളത്തിൽ കഴുകി ഉണക്കുക"],
        answer: 1,
        explanation: "വാഷിംഗ് മെഷീന്റെ 90% ഊർജ്ജ ഉപയോഗവും വെള്ളം ചൂടാക്കാനാണ് പോകുന്നത്. കാറ്റിൽ ഉണക്കുന്നത് ഡ്രയറുകളുടെ ഉയർന്ന ഊർജ്ജ ഉപയോഗം ഒഴിവാക്കുന്നു."
      },
      {
        question: "യാത്രാ ദൂരമനുസരിച്ച് ഏറ്റവും കൂടുതൽ കാർബൺ പുറന്തള്ളുന്ന വാഹനം ഏതാണ്?",
        options: ["പൊതു ബസ്", "മെട്രോ ട്രെയിൻ", "പെട്രോൾ കാർ (ഒരാൾ മാത്രം യാത്ര ചെയ്യുന്നത്)", "ഇലക്ട്രിക് സൈക്കിൾ"],
        answer: 2,
        explanation: "ഒരാൾ മാത്രം പെട്രോൾ കാറിൽ യാത്ര ചെയ്യുന്നത് വളരെ ദോഷകരമാണ്, ഇത് പൊതു ബസുകളേക്കാളും ഇലക്ട്രിക് സൈക്കിളുകളേക്കാളും കൂടുതൽ CO2 ഉണ്ടാക്കുന്നു."
      }
    ]
  };

  const activeLabels = labels[lang] || labels.en;
  const questions = quizPool[lang] || quizPool.en;

  // Pick a semi-random question based on current date, so it updates daily
  useEffect(() => {
    const day = new Date().getDate();
    setQuestionIndex(day % questions.length);
  }, [questions.length]);

  const currentQuiz = questions[questionIndex];

  const todayStr = new Date().toISOString().split('T')[0];
  const isAlreadyCompleted = quizCompletedDate === todayStr;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedOption === null) return;

    const correct = Number(selectedOption) === currentQuiz.answer;
    setIsCorrect(correct);
    setSubmitted(true);

    if (onComplete) {
      onComplete(correct ? 10 : 0);
    }
  };

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl shadow-slate-950/25">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-emerald-300">{activeLabels.title}</h2>
          <p className="text-sm text-slate-400">{activeLabels.subtitle}</p>
        </div>
        <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs text-emerald-200">
          {challengePoints} {activeLabels.pts}
        </span>
      </div>

      {isAlreadyCompleted ? (
        <div className="rounded-3xl border border-emerald-500/20 bg-emerald-950/10 p-5 text-center">
          <p className="text-emerald-300 text-sm font-medium">{activeLabels.completed}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
            <h3 className="text-md font-semibold text-slate-100 mb-4">{currentQuiz.question}</h3>
            <div className="space-y-3">
              {currentQuiz.options.map((option, idx) => (
                <label
                  key={idx}
                  className={`flex items-center gap-3 rounded-2xl border px-4 py-3 cursor-pointer transition-all ${
                    submitted
                      ? idx === currentQuiz.answer
                        ? 'border-emerald-500/50 bg-emerald-950/20 text-emerald-300'
                        : selectedOption === idx
                        ? 'border-rose-500/50 bg-rose-950/20 text-rose-300'
                        : 'border-slate-800 bg-slate-950/40 text-slate-500'
                      : selectedOption === idx
                      ? 'border-emerald-500 bg-emerald-500/5 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.05)]'
                      : 'border-slate-800 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-950/80 text-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="quiz-option"
                    value={idx}
                    disabled={submitted}
                    checked={selectedOption === idx}
                    onChange={() => setSelectedOption(idx)}
                    className="hidden"
                  />
                  <span className={`flex h-5 w-5 items-center justify-center rounded-full border text-xs font-semibold ${
                    selectedOption === idx ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10' : 'border-slate-700 text-slate-500'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>

          {submitted && (
            <div className={`rounded-3xl border p-5 space-y-2 ${
              isCorrect ? 'border-emerald-500/30 bg-emerald-950/10' : 'border-rose-500/30 bg-rose-950/10'
            }`}>
              <p className={`text-md font-bold ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isCorrect ? activeLabels.correct : activeLabels.incorrect}
              </p>
              <p className="text-sm text-slate-400 leading-relaxed">
                {currentQuiz.explanation}
              </p>
            </div>
          )}

          {!submitted && (
            <button
              type="submit"
              disabled={selectedOption === null}
              className={`w-full rounded-3xl py-3 text-sm font-semibold transition ${
                selectedOption === null
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
              }`}
            >
              {activeLabels.submit}
            </button>
          )}
        </form>
      )}
    </section>
  );
}

export default Quiz;
