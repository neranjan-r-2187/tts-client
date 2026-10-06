import { useState, useEffect } from 'react';
import { getFavourites, addFavourite, removeFavourite } from '../services/ttsService';
import ErrorMessage from './ErrorMessage';

function FavouritesList({ accessToken, voices, onSelectVoice }) {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!accessToken) return;
    loadFavourites();
  }, [accessToken]);

  const loadFavourites = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getFavourites(accessToken);
      setFavourites(res.data.favourites || []);
    } catch (err) {
      setError('Could not load favourites.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (favItem) => {
    const voiceName = typeof favItem === 'string' ? favItem : favItem.voice_name;
    const id = typeof favItem === 'object' && favItem.id ? favItem.id : voiceName;
    try {
      await removeFavourite(id, accessToken);
      setFavourites((prev) => prev.filter((f) => f.voice_name !== voiceName));
    } catch (err) {
      setError('Failed to remove favourite.');
    }
  };

  if (loading) return <p className="field__meta">Loading favourites…</p>;

  return (
    <div className="favourites-section" style={{ marginTop: 24 }}>
      <h3 style={{ fontSize: '1.1rem', color: 'var(--paper-text)', marginBottom: 16 }}>
        ⭐ Favourite Voices
      </h3>

      <ErrorMessage message={error} />

      {favourites.length === 0 ? (
        <p className="field__meta">No favourite voices added yet. Star voices below to save them here!</p>
      ) : (
        <div className="favourites-list">
          {favourites.map((fav) => {
            const vObj = voices.find((v) => v.name === fav.voice_name);
            return (
              <div key={fav.id || fav.voice_name} className="favourite-card">
                <div>
                  <strong>{fav.voice_name}</strong>
                  {vObj && <span className="field__meta" style={{ display: 'block' }}>{vObj.language} • {vObj.gender}</span>}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {vObj && onSelectVoice && (
                    <button
                      type="button"
                      className="btn btn--secondary"
                      style={{ width: 'auto', padding: '4px 10px', fontSize: 13 }}
                      onClick={() => onSelectVoice(vObj)}
                    >
                      Use Voice
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn-icon"
                    style={{ color: 'var(--accent)' }}
                    onClick={() => handleRemove(fav)}
                    title="Remove from favourites"
                  >
                    ★ Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default FavouritesList;
