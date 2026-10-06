import axios from 'axios';
import { BASE_URL, API_BASE } from './apiConfig';

// TTS
export const convertToSpeech = (text, language, voice, accessToken) =>
  axios.post(
    `${API_BASE}/tts`,
    { text, language, voice },
    accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : {}
  );

export const getVoices = () => axios.get(`${API_BASE}/voices`);

export const getAudioUrl = (path) => `${BASE_URL}${path}`;
export const getDownloadUrl = (filename) => `${API_BASE}/download/${filename}`;

// History
export const getHistory = (accessToken) =>
  axios.get(`${API_BASE}/history`, { headers: { Authorization: `Bearer ${accessToken}` } });

// Favourites
export const getFavourites = (accessToken) =>
  axios.get(`${API_BASE}/favourites`, { headers: { Authorization: `Bearer ${accessToken}` } });

export const addFavourite = (voice_name, languageOrToken, maybeToken) => {
  const language = typeof languageOrToken === 'string' && languageOrToken.length < 15 ? languageOrToken : 'en';
  const token = typeof languageOrToken === 'string' && languageOrToken.length >= 15 ? languageOrToken : maybeToken;
  return axios.post(
    `${API_BASE}/favourites`,
    { voice_name, language },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const removeFavourite = (idOrVoiceName, accessToken) =>
  axios.delete(`${API_BASE}/favourites/${encodeURIComponent(idOrVoiceName)}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });