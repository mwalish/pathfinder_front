import { API_BASE } from './config';

export const formatKsh = (n) => `KSh ${Number(n || 0).toLocaleString('en-KE')}`;
export const truncate = (s, n) => (s && s.length > n ? s.slice(0, n) : s || '');
export const pageCount = (count, size) => Math.ceil((count || 0) / size);
export const todayISO = () => new Date().toISOString().slice(0, 10);

// Photo URL: the API sends an absolute `product_photo_url`; fall back to the legacy /static/images/<file>.
export const photoUrl = (p) =>
  p.product_photo_url || (p.product_photo ? `${API_BASE}/static/images/${p.product_photo}` : '');

// Days (cars) or nights (hotels) between two ISO dates; 0 when incomplete or reversed, otherwise at least 1.
export const daysBetween = (start, end) => {
  if (!start || !end) return 0;
  const diff = Math.round((new Date(end) - new Date(start)) / 86400000);
  return diff < 0 ? 0 : Math.max(1, diff);
};

// The catalogue sorts items into sections by keywords in the product name, so new products must carry one.
const KEYWORDS = { trip: ['trip'], activity: ['activity'], style: ['style'], car: ['car', 'model'] };
export const applyCategory = (name, kind) => {
  const clean = (name || '').trim();
  if (kind === 'hotel') return /hotel\s*$/i.test(clean) ? clean : `${clean} Hotel`;
  const words = KEYWORDS[kind];
  if (!words || words.some((w) => clean.toLowerCase().includes(w))) return clean;
  return `${clean} ${kind[0].toUpperCase()}${kind.slice(1)}`;
};

export const passwordStrength = (pass) => {
  if (!pass) return { score: 0, label: '', color: 'transparent' };
  let score = 0;
  if (pass.length >= 8) score++;
  if (/[a-zA-Z]/.test(pass)) score++;
  if (/[0-9]/.test(pass)) score++;
  if (/[^A-Za-z0-9]/.test(pass)) score++;
  return [
    { score: 25, label: 'Weak', color: '#ff4d4d' },
    { score: 50, label: 'Fair', color: '#ffa500' },
    { score: 75, label: 'Good', color: '#2ecc71' },
    { score: 100, label: 'Strong', color: '#1db954' },
  ][Math.max(score, 1) - 1];
};
export const isStrongPassword = (p) => p.length >= 8 && /[a-zA-Z]/.test(p) && /\d/.test(p) && /[^A-Za-z0-9]/.test(p);

export const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
