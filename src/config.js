// Backend origin. Set VITE_API_URL in .env (see .env.example); no trailing slash.
export const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '');
export const TOKEN_KEY = 'token';
