function TextInput({ text, setText, maxLength }) {
  const charCount = text.length;
  const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  const overLimit = charCount > maxLength;

  return (
    <div className="field">
      <label className="field__label" htmlFor="tts-text">
        Text
      </label>
      <textarea
        id="tts-text"
        className="textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={6}
        placeholder="Type or paste text here…"
      />
      <div className={`field__meta${overLimit ? ' field__meta--over' : ''}`}>
        {charCount} / {maxLength} characters · {wordCount} words
      </div>
    </div>
  );
}

export default TextInput;
