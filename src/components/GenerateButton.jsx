function GenerateButton({ onClick, loading, disabled }) {
  return (
    <button
      className="btn btn--primary"
      onClick={onClick}
      disabled={loading || disabled}
    >
      {loading ? 'Generating…' : 'Generate speech'}
    </button>
  );
}

export default GenerateButton;
