import { useTranslation } from 'react-i18next';

function LanguageSelector() {
  const { i18n, t } = useTranslation();

  const languages = [
    { code: 'en', name: t('english') },
    { code: 'te', name: t('telugu') },
    { code: 'hi', name: t('hindi') },
    { code: 'ta', name: t('tamil') },
    { code: 'kn', name: t('kannada') },
    { code: 'ml', name: t('malayalam') }
  ];

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="language-select" className="text-sm text-slate-300">
        {t('language')}:
      </label>
      <select
        id="language-select"
        value={i18n.language}
        onChange={(e) => i18n.changeLanguage(e.target.value)}
        className="rounded-full border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 transition hover:bg-slate-700"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default LanguageSelector;
