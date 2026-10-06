function AudioPlayer({ audioUrl }) {
  if (!audioUrl) return null;

  return (
    <audio controls src={audioUrl}>
      Your browser does not support the audio element.
    </audio>
  );
}

export default AudioPlayer;
