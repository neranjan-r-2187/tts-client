function VoiceSelector({ voice, setVoice, voices, language, isFav, onToggleFav, isLoggedIn }) {
  const filteredVoices = voices.filter((v) => v.language === language);

  return (
    <div className="field">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <label className="field__label" htmlFor="tts-voice" style={{ marginBottom: 0 }}>
          Voice
        </label>
        {isLoggedIn && voice && onToggleFav && (
          <button
            type="button"
            className="btn-fav"
            onClick={() => onToggleFav(voice)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '13px',
              color: isFav ? 'var(--accent)' : 'var(--paper-text-dim)',
              fontWeight: 600,
            }}
            title={isFav ? 'Remove from favourites' : 'Save to favourites'}
          >
            {isFav ? '⭐ Favourite' : '☆ Add to Favourites'}
          </button>
        )}
      </div>
      <select
        id="tts-voice"
        className="select"
        value={voice}
        onChange={(e) => setVoice(e.target.value)}
        disabled={!language}
      >
        <option value="">
          {language ? 'Select a voice' : 'Select a language first'}
        </option>
        {filteredVoices.map((v) => (
          <option key={v.name} value={v.name}>
            {v.name} ({v.gender})
          </option>
        ))}
      </select>
    </div>
  );
}

export default VoiceSelector;
