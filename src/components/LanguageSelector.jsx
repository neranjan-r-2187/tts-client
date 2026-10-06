function LanguageSelector({ language, setLanguage, voices }) {
  const languages = [...new Set(voices.map((v) => v.language))];

  return (
    <div className="field">
      <label className="field__label" htmlFor="tts-language">
        Language
      </label>
      <select
        id="tts-language"
        className="select"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
      >
        <option value="">Select a language</option>
        {languages.map((lang) => (
          <option key={lang} value={lang}>{lang}</option>
        ))}
      </select>
    </div>
  );
}

export default LanguageSelector;
