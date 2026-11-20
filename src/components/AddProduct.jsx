import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { applyCategory } from '../utils';

const MAX_BYTES = 5 * 1024 * 1024;
const CATEGORIES = [['trip', 'Trip'], ['activity', 'Activity'], ['car', 'Car'], ['hotel', 'Hotel'], ['style', 'Travel style'], ['other', 'Other']];

export default function AddProduct() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', category: 'trip', description: '', cost: '' });
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const set = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  useEffect(() => {
    if (!photo) { setPreview(''); return undefined; }
    const url = URL.createObjectURL(photo);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [photo]);

  const pick = (e) => {
    const file = e.target.files[0];
    if (file && file.size > MAX_BYTES) {
      setMessage({ type: 'error', text: 'Photo must be 5 MB or smaller.' });
      e.target.value = '';
      return;
    }
    setMessage({ type: '', text: '' });
    setPhoto(file || null);
  };

  // The name decides which section the item appears in, so the chosen category is added to it.
  const finalName = applyCategory(form.name, form.category);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMessage({ type: '', text: '' });
    try {
      const data = new FormData();
      data.append('product_name', finalName);
      data.append('product_description', form.description);
      data.append('product_cost', form.cost);
      data.append('product_photo', photo);
      const res = await api.addProduct(data);
      setMessage({ type: 'success', text: res.message });
      setTimeout(() => navigate('/admin/products'), 1200);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="hero-container">
      <div className="vignette" />
      <form className="glass-card narrow left" onSubmit={submit}>
        <h1 className="title small">Add a product</h1>
        <div className="input-group">
          <label htmlFor="category">Category</label>
          <select id="category" name="category" value={form.category} onChange={set}>
            {CATEGORIES.map(([v, label]) => <option key={v} value={v}>{label}</option>)}
          </select>
        </div>
        <div className="input-group">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" value={form.name} onChange={set} maxLength={80} required />
          {form.name && finalName !== form.name.trim() && <small className="hint">Will be saved as “{finalName}” so it shows in the right section.</small>}
        </div>
        <div className="input-group">
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" rows="3" value={form.description} onChange={set} required />
        </div>
        <div className="input-group">
          <label htmlFor="cost">Price (KSh) — per person, day or night</label>
          <input id="cost" type="number" name="cost" min="0" value={form.cost} onChange={set} required />
        </div>
        <div className="input-group">
          <label htmlFor="photo">Photo (max 5 MB)</label>
          <input id="photo" type="file" accept="image/*" onChange={pick} required />
        </div>
        {preview && <img className="preview" src={preview} alt="Selected product" />}
        {message.text && <p className={`message ${message.type}`} role="status">{message.text}</p>}
        <button type="submit" className="confirm-btn" disabled={busy || !photo}>{busy ? 'Uploading...' : 'Add product'}</button>
      </form>
    </div>
  );
}
