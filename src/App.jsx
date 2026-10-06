import { useState, useEffect } from 'react';
import TextInput from './components/TextInput';
import LanguageSelector from './components/LanguageSelector';
import VoiceSelector from './components/VoiceSelector';
import GenerateButton from './components/GenerateButton';
import AudioPlayer from './components/AudioPlayer';
import DownloadButton from './components/DownloadButton';
import ErrorMessage from './components/ErrorMessage';





import {
  convertToSpeech,
  getVoices,
  getAudioUrl,
  getDownloadUrl,
  
  
  
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
  const [view, setView] = useState('dashboard');
  
  

  // Dashboard Tabs: 'generate' | 'history' | 'favourites'
  const [activeTab, setActiveTab] = useState('generate');
  

  

  

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
      const res = await convertToSpeech(text, language, voice);
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

  const isFav = () => false;

  const handleToggleFav = () => {};

  // ================= Application Dashboard =================
  return (
    <div className="app-shell">
      <aside className="ink-panel">
        <div className="ink-panel__mark">Sonic Speak</div>
        <h1 className="ink-panel__title">Transform Words into Audio.</h1>
        <p className="ink-panel__tagline">
          Simply type your text, select your preferred language and voice, and seamlessly convert it into high-quality speech.
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
          



          {/* Main Tab Content */}
          {activeTab === 'generate' && (
            <>
              <div className="form-sheet__eyebrow">Speech Generator</div>
              <h2 className="form-sheet__heading">Enter text to convert</h2>

              <TextInput text={text} setText={setText} maxLength={MAX_LENGTH} />
              <LanguageSelector language={language} setLanguage={setLanguage} voices={voices} />
              <VoiceSelector
                voice={voice}
                setVoice={setVoice}
                voices={voices}
                language={language}
                isFav={isFav(voice)}
                onToggleFav={handleToggleFav}
                
              />
              <GenerateButton onClick={handleGenerate} loading={loading} disabled={!text.trim()} />

              <ErrorMessage message={error} />

              {audioUrl && (
                <div className="audio-block">
                  <div className="audio-block__title">Generated Audio Result</div>
                  <AudioPlayer audioUrl={audioUrl} />
                  <DownloadButton downloadUrl={getDownloadUrl(filename)} filename={filename} />
                </div>
              )}
            </>
          )}

        </div>
      </main>
    </div>
  );
}

export default App;