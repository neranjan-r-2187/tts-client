import { useState, useEffect } from 'react';
import TextInput from './components/TextInput';
import LanguageSelector from './components/LanguageSelector';
import VoiceSelector from './components/VoiceSelector';
import GenerateButton from './components/GenerateButton';
import AudioPlayer from './components/AudioPlayer';
import DownloadButton from './components/DownloadButton';
import ErrorMessage from './components/ErrorMessage';
import AuthForm from './components/AuthForm';
import HistoryList from './components/HistoryList';
import FavouritesList from './components/FavouritesList';
import LandingPage from './components/LandingPage';
import { useAuth } from './context/AuthContext';
import {
  convertToSpeech,
  getVoices,
  getAudioUrl,
  getDownloadUrl,
  getFavourites,
  addFavourite,
  removeFavourite,
} from './services/ttsService';
import { DEFAULT_VOICES } from './services/defaultVoices';
import './App.css';

const MAX_LENGTH = 500;
const BAR_COUNT = 14;

function Waveform({ active }) {
  return (
    <div className={`waveform${active ? ' waveform--active' : ''}`} aria-hidden="true">
      {Array.from({ length: BAR_COUNT }).map((_, i) => (
        <div
          key={i}
          className="waveform__bar"
          style={{ '--d': `${(i % 5) * 0.15}s` }}
        />
      ))}
    </div>
  );
}

function App() {
  const { user, accessToken, signOut } = useAuth();
  const [text, setText] = useState('');
  const [language, setLanguage] = useState('');
  const [voice, setVoice] = useState('');
  const [voices, setVoices] = useState(DEFAULT_VOICES);
  const [audioUrl, setAudioUrl] = useState('');
  const [filename, setFilename] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 3-Stage Page Flow State: 'landing' | 'auth' | 'dashboard'
  // ALWAYS starts at 'landing' when opening the app!
  const [view, setView] = useState('landing');
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'
  const [isGuest, setIsGuest] = useState(false);

  // Dashboard Tabs: 'generate' | 'history' | 'favourites'
  const [activeTab, setActiveTab] = useState('generate');
  const [favourites, setFavourites] = useState([]);

  useEffect(() => {
    let timer;
    const fetchServerVoices = () => {
      getVoices()
        .then((res) => {
          if (res.data?.voices?.length) {
            setVoices(res.data.voices);
          }
        })
        .catch(() => {
          // If cold starting, retry once after 5s
          timer = setTimeout(() => {
            getVoices()
              .then((res) => {
                if (res.data?.voices?.length) setVoices(res.data.voices);
              })
              .catch(() => {});
          }, 5000);
        });
    };
    fetchServerVoices();
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (accessToken) {
      loadFavourites();
    } else {
      setFavourites([]);
    }
  }, [accessToken]);

  const loadFavourites = async () => {
    try {
      const res = await getFavourites(accessToken);
      setFavourites(res.data.favourites || []);
    } catch (err) {
      // non-critical
    }
  };

  useEffect(() => {
    setVoice('');
  }, [language]);

  const handleGenerate = async () => {
    setError('');
    setAudioUrl('');

    if (!text.trim()) {
      setError('Please enter some text.');
      return;
    }
    if (text.length > MAX_LENGTH) {
      setError(`Text exceeds the ${MAX_LENGTH} character limit.`);
      return;
    }
    if (!language) {
      setError('Please select a language.');
      return;
    }
    if (!voice) {
      setError('Please select a voice.');
      return;
    }

    setLoading(true);
    try {
      const res = await convertToSpeech(text, language, voice, accessToken);
      setAudioUrl(getAudioUrl(res.data.audioUrl));
      setFilename(res.data.filename);
    } catch (err) {
      const backendMessage = err.response?.data?.error;
      const isNetworkErr = err.code === 'ERR_NETWORK' || err.message === 'Network Error';
      setError(
        backendMessage ||
        (isNetworkErr
          ? 'Unable to connect to backend server. Make sure the backend server is running and VITE_API_URL is configured correctly.'
          : 'Something went wrong. Please try again.')
      );
    } finally {
      setLoading(false);
    }
  };

  const isFav = (vName) => favourites.some((f) => f.voice_name === vName);

  const handleToggleFav = async (vName) => {
    if (!accessToken) return;
    try {
      if (isFav(vName)) {
        const favObj = favourites.find((f) => f.voice_name === vName);
        await removeFavourite(favObj?.id || vName, accessToken);
        setFavourites((prev) => prev.filter((f) => f.voice_name !== vName));
      } else {
        const res = await addFavourite(vName, language || 'en', accessToken);
        const newFav = res.data?.favourite || { voice_name: vName, language: language || 'en' };
        setFavourites((prev) => [...prev, newFav]);
      }
    } catch (err) {
      console.error('Toggle favourite error:', err);
      const backendErr = err.response?.data?.error;
      setError(backendErr || 'Could not update favourite.');
    }
  };

  const handleSelectFavVoice = (vObj) => {
    setLanguage(vObj.language);
    setVoice(vObj.name);
    setActiveTab('generate');
  };

  const handleSignOut = () => {
    signOut();
    setIsGuest(false);
    setView('landing');
  };

  // ================= Stage 1: Landing Page (Always First Screen on Load) =================
  if (view === 'landing') {
    return (
      <LandingPage
        user={user}
        onGetStarted={() => {
          setAuthMode('signup');
          setView('auth');
        }}
        onLogin={() => {
          setAuthMode('login');
          setView('auth');
        }}
        onGoToDashboard={() => setView('dashboard')}
        onGuestDemo={() => {
          setIsGuest(true);
          setView('dashboard');
        }}
        onSignOut={handleSignOut}
      />
    );
  }

  // ================= Stage 2: Login / Signup Page (Second Screen) =================
  if (view === 'auth') {
    return (
      <div className="auth-page-shell">
        <AuthForm
          initialMode={authMode}
          onSuccess={() => {
            setIsGuest(false);
            setView('dashboard');
            setActiveTab('generate');
          }}
          onBack={() => setView('landing')}
          onGuest={() => {
            setIsGuest(true);
            setView('dashboard');
          }}
        />
      </div>
    );
  }

  // ================= Stage 3: Application Dashboard (Third Screen) =================
  return (
    <div className="app-shell">
      <aside className="ink-panel">
        <div className="ink-panel__mark">Vocalizer AI</div>
        <h1 className="ink-panel__title">Bring your text to life.</h1>
        <p className="ink-panel__tagline">
          Input your text, choose the perfect language and voice model, and generate stunning audio to preview or download.
        </p>

        <Waveform active={loading} />

        <p className="ink-panel__note">
          {loading
            ? 'Generating your audio…'
            : `Supports ${new Set(voices.map((v) => v.language)).size || '7'} languages.`}
        </p>
      </aside>

      <main className="paper-panel">
        <div className="form-sheet">
          {/* Top User / Auth Navigation Bar */}
          <div className="user-bar" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <button
              type="button"
              className="btn-text"
              onClick={() => setView('landing')}
              title="Go back to Landing Page"
            >
              🏠 Home
            </button>
          </div>



          {/* Main Tab Content */}
          {activeTab === 'generate' && (
            <>
              <div className="form-sheet__eyebrow">Create Audio</div>
              <h2 className="form-sheet__heading">What would you like to say?</h2>

              <TextInput text={text} setText={setText} maxLength={MAX_LENGTH} />
              <LanguageSelector language={language} setLanguage={setLanguage} voices={voices} />
              <VoiceSelector
                voice={voice}
                setVoice={setVoice}
                voices={voices}
                language={language}
                isFav={isFav(voice)}
                onToggleFav={handleToggleFav}
                isLoggedIn={!!user}
              />
              <GenerateButton onClick={handleGenerate} loading={loading} disabled={!text.trim()} />

              <ErrorMessage message={error} />

              {audioUrl && (
                <div className="audio-block">
                  <div className="audio-block__title">Your audio masterpiece</div>
                  <AudioPlayer audioUrl={audioUrl} />
                  <DownloadButton downloadUrl={getDownloadUrl(filename)} filename={filename} />
                </div>
              )}
            </>
          )}

          {activeTab === 'history' && user && (
            <HistoryList accessToken={accessToken} />
          )}

          {activeTab === 'favourites' && user && (
            <FavouritesList
              accessToken={accessToken}
              voices={voices}
              onSelectVoice={handleSelectFavVoice}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;