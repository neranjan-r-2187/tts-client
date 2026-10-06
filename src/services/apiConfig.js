// Helper to normalize VITE_API_URL and prevent duplicate /api or trailing slash issues
const rawUrl = (import.meta.env.VITE_API_URL || 'http://localhost:4000').trim().replace(/\/+$/, '');

// Root server URL without trailing slash or /api (e.g. "https://my-backend.onrender.com")
export const BASE_URL = rawUrl.endsWith('/api') ? rawUrl.slice(0, -4) : rawUrl;

// API endpoint base URL (e.g. "https://my-backend.onrender.com/api")
export const API_BASE = `${BASE_URL}/api`;
