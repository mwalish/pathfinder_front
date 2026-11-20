// The ONLY file that talks to the Django backend. Components call `api.*`.
import axios from 'axios';
import { API_BASE, TOKEN_KEY } from './config';

const http = axios.create({ baseURL: `${API_BASE}/api`, timeout: 20000 });
// Send the signed-in user's token with every request
http.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const TTL = 30000; // GET responses are reused for 30s; any successful write clears the cache
const cache = new Map();

export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.status = status;
  }
}
export const isCancel = (e) => axios.isCancel(e) || e?.code === 'ERR_CANCELED';

const toError = (e) => {
  if (isCancel(e)) return e;
  if (e.response?.status === 401 && localStorage.getItem(TOKEN_KEY)) window.dispatchEvent(new Event('auth:expired'));
  if (e.response) return new ApiError(e.response.data?.message || `Request failed (${e.response.status})`, e.response.status);
  return new ApiError('Cannot reach the server. Check your connection and try again.');
};

async function get(path, params, signal) {
  const key = `${path}?${new URLSearchParams(Object.entries(params || {}).filter(([, v]) => v !== '' && v != null))}`;
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < TTL) return hit.data;
  try {
    const { data } = await http.get(path, { params, signal });
    cache.set(key, { at: Date.now(), data });
    return data;
  } catch (e) {
    throw toError(e);
  }
}

async function send(method, path, body) {
  try {
    const { data } = await http.request({ method, url: path, data: body }); // FormData gets its multipart header automatically
    cache.clear();
    return data;
  } catch (e) {
    throw toError(e);
  }
}
const post = (path, body) => send('post', path, body);

export const api = {
  signup: (body) => post('signup', body),
  signin: async (body) => {
    const data = await post('signin', body);
    if (!data.user) throw new ApiError('Wrong email or password.', 401); // backend answers 200 "login failed"
    return data; // { user, token }
  },
  addPlan: (body) => post('add_plan', body),
  addStyle: (body) => post('add_style', body),
  bookTrip: (body) => post('book_trip', body),
  bookCar: (body) => post('book_car', body),
  bookHotel: (body) => post('book_hotel', body),
  addProduct: (formData) => post('addproducts', formData),
  payMpesa: (body) => post('mpesa_payment', body),
  // dashboards (role-aware: travelers get their own data, admins get everything)
  getDashboard: (signal) => get('dashboard', {}, signal),
  getRecords: (params, signal) => get('bookings', params, signal),
  getPayments: (params, signal) => get('payments', params, signal),
  // admin only
  getUsers: (params, signal) => get('admin/users', params, signal),
  setUserRole: (id, role) => send('patch', `admin/users/${id}`, { role }),
  updateProduct: (id, body) => send('patch', `products/${id}`, body),
  deleteProduct: (id) => send('delete', `products/${id}`),
  clearCache: () => cache.clear(),
  getPlans: (params, signal) => get('get_plans', params, signal),
  getProducts: (params, signal) => get('getproductsdetails', params, signal),
};
