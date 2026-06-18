import { useTranslation } from 'react-i18next';

function LanguageSelector() {
  const { i18n, t } = useTranslation();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'te', name: 'Telugu' },
    { code: 'hi', name: 'Hindi' },
    { code: 'ta', name: 'Tamil' },
    { code: 'kn', name: 'Kannada' },
    { code: 'ml', name: 'Malayalam' }
  ];

  return (
    <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800/80 rounded-full px-3 py-1.5 focus-within:border-emerald-500/40 focus-within:ring-2 focus-within:ring-emerald-500/10 transition-all duration-300">
      <svg 
        className="h-4 w-4 text-slate-400" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        strokeWidth="2"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" 
        />
      </svg>
      <label htmlFor="language-select" className="sr-only">
        {t('language')}
      </label>
      <select
        id="language-select"
        value={i18n.language}
        onChange={(e) => i18n.changeLanguage(e.target.value)}
        className="bg-transparent border-none text-xs text-slate-300 font-medium cursor-pointer focus:ring-0 focus:outline-none pr-1 py-0"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code} className="bg-slate-900 text-slate-200 text-sm">
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default LanguageSelector;
