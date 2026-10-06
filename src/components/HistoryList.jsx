import { useState, useEffect } from 'react';
import { getHistory, getAudioUrl } from '../services/ttsService';
import AudioPlayer from './AudioPlayer';
import ErrorMessage from './ErrorMessage';

function HistoryList({ accessToken }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeAudio, setActiveAudio] = useState(null);

  useEffect(() => {
    if (!accessToken) return;
    fetchHistory();
  }, [accessToken]);

  const fetchHistory = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getHistory(accessToken);
      setHistory(res.data.history || []);
    } catch (err) {
      setError('Could not load speech history.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="field__meta">Loading history…</p>;
  }

  return (
    <div className="history-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontSize: '1.1rem', color: 'var(--paper-text)' }}>Your Speech History</h3>
        <button type="button" className="btn-icon" onClick={fetchHistory} title="Refresh history">
          🔄 Refresh
        </button>
      </div>

      <ErrorMessage message={error} />

      {history.length === 0 ? (
        <p className="field__meta">No past audio generations yet. Try converting some text!</p>
      ) : (
        <div className="history-list">
          {history.map((item) => (
            <div key={item.id} className="history-card">
              <div className="history-card__header">
                <span className="badge">{item.language}</span>
                <span className="history-card__voice">{item.voice}</span>
                <span className="history-card__date">
                  {new Date(item.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="history-card__text">{item.text_content}</p>
              {item.audio_path && (
                <div style={{ marginTop: 10 }}>
                  <button
                    type="button"
                    className="btn btn--secondary"
                    style={{ padding: '6px 12px', fontSize: 13, width: 'auto' }}
                    onClick={() =>
                      setActiveAudio(activeAudio === item.audio_path ? null : item.audio_path)
                    }
                  >
                    {activeAudio === item.audio_path ? 'Hide Player' : '▶ Play Audio'}
                  </button>
                  {activeAudio === item.audio_path && (
                    <div style={{ marginTop: 8 }}>
                      <AudioPlayer audioUrl={getAudioUrl(`/audio/${item.audio_path}`)} />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HistoryList;
