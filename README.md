# Text-to-Speech — Backend (Server)

Node.js + Express backend for the Text-to-Speech web application. Converts text into speech, supports multiple languages/voices, stores generation history, and serves generated audio files.

This is the backend half of a two-repo project. Frontend repo: [text-to-speech-client](https://github.com/dharshinikalaiselvi1979-eng/text-to-speech-client)

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** Supabase (Postgres) — stores speech generation history
- **Text-to-Speech:** `msedge-tts` (see note below)
- **Translation:** `google-translate-api-x` — translates input text before speech generation so non-English voices speak genuine target-language audio, not English text read in a foreign accent
- **Security:** `cors`, `express-rate-limit`, `dotenv`

## Note on Text-to-Speech Provider

The project spec suggests Google Cloud TTS, Azure Speech, Amazon Polly, ElevenLabs, or the browser's Web Speech API. This project uses **`msedge-tts`** instead — an unofficial wrapper around Microsoft Edge's neural TTS voices.

**Reason:** all five suggested providers require a paid account and/or API key (Web Speech API also runs client-side only, which doesn't fit a backend-driven architecture). `msedge-tts` needs no API key, no billing account, and no rate-limited free tier, making it a practical substitute for a student project with the same functional outcome — natural-sounding neural voices across multiple languages and genders.

## Project Structure

server/
├── controllers/ # Request handlers
├── routes/ # Express route definitions
├── services/ # TTS generation + Supabase client
├── middleware/ # Request validation
├── utils/ # Voice/language definitions
├── temp_audio/ # Generated audio (auto-deleted after 10 min)
├── server.js # App entry point
└── package.json


## Setup

1. Clone this repo and install dependencies:
```bash
   npm install
```

2. Create a `.env` file in this folder with:

SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
PORT=4000
MAX_TEXT_LENGTH=500
FRONTEND_URL=http://localhost:5173

   `.env` is gitignored and must never be committed.

3. Start the server:
```bash
   npm start
```
   Server runs on `http://localhost:4000` by default.

## API Endpoints

### `POST /api/tts`
Converts text to speech.

**Request:**
```json
{
  "text": "Hello, welcome to the app.",
  "language": "en",
  "voice": "English Voice 1"
}
```

**Response (200):**
```json
{
  "success": true,
  "audioUrl": "/audio/speech-1234567890.mp3",
  "filename": "speech-1234567890.mp3"
}
```

**Error responses:** `400` (empty/oversized text, invalid language/voice, wrong Content-Type), `503` (TTS service failure).

### `GET /api/voices`
Returns all available voices with name, language, and gender.

### `GET /api/download/:filename`
Downloads a previously generated audio file. Returns `404` if the file has expired or doesn't exist.

### `GET /api/health`
Basic health check, returns `{ "status": "ok" }`.

## Validation Rules

- Text must not be empty, max length set by `MAX_TEXT_LENGTH` (default 500 chars)
- Language must be one of the supported codes (see `utils/voices.js`)
- Voice must exist and must belong to the selected language
- Content-Type must be `application/json`

## Security

- API keys and Supabase credentials kept server-side only, via `.env` (never committed)
- CORS restricted to the configured `FRONTEND_URL`
- Rate limiting: 20 requests/minute per client on all `/api` routes
- Generated audio files auto-delete after 10 minutes
- All user input sanitized (HTML/script tags stripped) before processing

## Speech History

Every successful generation is logged to a Supabase table (`speech_history`) with the original text, translated/spoken text, language, voice, and audio URL.

Client README — save as ~/text-to-speech/client/README.md:

markdown
# Text-to-Speech — Frontend (Client)

React + Vite frontend for the Text-to-Speech web application. Provides text input, language/voice selection, audio playback, and download.

This is the frontend half of a two-repo project. Backend repo: [text-to-speech-server](https://github.com/dharshinikalaiselvi1979-eng/text-to-speech-server)

## Tech Stack

- **Library:** React (v19)
- **Build tool:** Vite
- **HTTP client:** Axios
- **Styling:** CSS

## Setup

1. Clone this repo and install dependencies:
```bash
   npm install
```

2. Create a `.env` file in this folder with:

VITE_API_URL=http://localhost:4000

   Point this at wherever the backend is running (local for development, the deployed backend URL in production). `.env` is gitignored and must never be committed.

3. Start the dev server:
```bash
   npm run dev
```
   App runs at `http://localhost:5173` by default.

## Project Structure

client/
├── src/
│ ├── components/
│ │ ├── TextInput.jsx # Text area + char count + validation
│ │ ├── LanguageSelector.jsx # Language dropdown
│ │ ├── VoiceSelector.jsx # Voice dropdown (filtered by language)
│ │ ├── GenerateButton.jsx # Submit + loading state
│ │ ├── AudioPlayer.jsx # Native <audio> playback
│ │ ├── DownloadButton.jsx # Download generated audio
│ │ └── ErrorMessage.jsx # Displays validation/API errors
│ ├── services/
│ │ └── ttsService.js # Axios calls to the backend API
│ └── App.jsx # Main app logic + state
└── package.json


## Features

- Character count and max-length validation before submitting
- Language selection filters available voices to that language
- Loading state shown while speech is generating
- Errors from the backend (invalid input, TTS failure, etc.) are displayed inline
- Generated audio plays directly in-browser and can be downloaded as MP3

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend API (e.g. `http://localhost:4000` locally, or the deployed backend URL in production) |

## Build for Production

```bash
npm run build
```
Output goes to `dist/`, ready to deploy to Vercel, Netlify, or any static host.