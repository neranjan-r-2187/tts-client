function DownloadButton({ downloadUrl, filename }) {
  if (!downloadUrl) return null;

  return (
    <a href={downloadUrl} download={filename} className="btn btn--secondary">
      Download audio
    </a>
  );
}

export default DownloadButton;
