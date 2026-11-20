import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../auth';
import { KINDS } from '../catalog';
import { daysBetween, formatKsh, photoUrl, todayISO, truncate } from '../utils';
import PayModal from './PayModal';

const LABELS = {
  trip: { cta: 'Book this trip', start: 'Departure date' },
  activity: { cta: 'Book this activity', start: 'Date' },
  car: { cta: 'Rent this car', start: 'Pick-up date', end: 'Return date', unitName: 'day' },
  hotel: { cta: 'Book this room', start: 'Check-in', end: 'Check-out', unitName: 'night' },
  style: { cta: 'Choose this style' },
};
const ROOMS = [['single', 'Single Room'], ['double', 'Double Room'], ['suite', 'Luxury Suite']];

// Detail + booking page for every section. The price (product_cost) is per person / day / night.
export default function Details({ kind }) {
  const cfg = KINDS[kind];
  const text = LABELS[kind];
  const navigate = useNavigate();
  const { state, pathname } = useLocation();
  const { user } = useAuth();
  const item = state?.item;
  const [f, setF] = useState({ start: '', end: '', people: 1, room: 'single', note: '' });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [payAmount, setPayAmount] = useState(null);
  const set = (e) => setF((v) => ({ ...v, [e.target.name]: e.target.value }));

  if (!item) {
    return (
      <div className="hero-container">
        <div className="vignette" />
        <div className="glass-card narrow">
          <h1 className="title small">Nothing selected</h1>
          <p className="subtitle">Pick an item from the list to see its details.</p>
          <Link to={cfg.route} className="confirm-btn link-btn">Browse {cfg.title.toLowerCase()}</Link>
        </div>
      </div>
    );
  }

  const unitPrice = Number(item.product_cost) || 0;
  const hasRange = Boolean(text.end);
  const quantity = hasRange ? daysBetween(f.start, f.end) : Number(f.people) || 1;
  const total = kind === 'style' ? 0 : unitPrice * quantity;
  const rangeInvalid = hasRange && f.start && f.end && quantity === 0;

  const bookings = {
    trip: () => api.bookTrip({ place_to_visit: truncate(item.product_name, 100), departure_date: f.start, number_of_people: quantity }),
    activity: () => api.bookTrip({ place_to_visit: truncate(item.product_name, 100), departure_date: f.start, number_of_people: quantity }),
    car: () => api.bookCar({ car_model: truncate(item.product_name, 50), pickup_date: f.start, return_date: f.end, total_cost: total }),
    hotel: () => api.bookHotel({ hotel_name: truncate(item.product_name, 100), room_type: f.room, check_in: f.start, check_out: f.end, total_price: total }),
    style: () => api.addStyle({ style_name: truncate(item.product_name, 50), preference_details: f.note || item.product_description }),
  };

  const submit = async (e) => {
    e.preventDefault();
    if (rangeInvalid) return setMessage({ type: 'error', text: `${text.end} must not be before ${text.start.toLowerCase()}.` });
    setBusy(true);
    setMessage({ type: '', text: '' });
    try {
      const data = await bookings[kind]();
      setMessage({ type: 'success', text: data.message });
      if (total > 0) setPayAmount(total);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="page-bg" style={{ '--bg': `url(${cfg.bg})` }}>
      <div className="page-head">
        <h2>{item.product_name}</h2>
        <button className="pill" onClick={() => navigate(-1)}>← Back</button>
      </div>

      <div className="details">
        <img src={photoUrl(item)} alt={item.product_name} onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }} />
        <div className="glass-card left">
          <p className="desc">{item.product_description}</p>
          {cfg.unit && unitPrice > 0 && <p className="price big">{formatKsh(unitPrice)} <small>{cfg.unit}</small></p>}

          {!user ? (
            <>
              <p className="subtitle">Sign in to {text.cta.toLowerCase()}.</p>
              <Link to="/signin" state={{ from: pathname, item }} className="confirm-btn link-btn">Sign in</Link>
            </>
          ) : (
            <form onSubmit={submit}>
              {kind !== 'style' && (
                <div className={hasRange ? 'input-row' : ''}>
                  <div className="input-group">
                    <label htmlFor="start">{text.start}</label>
                    <input id="start" type="date" name="start" min={todayISO()} value={f.start} onChange={set} required />
                  </div>
                  {hasRange && (
                    <div className="input-group">
                      <label htmlFor="end">{text.end}</label>
                      <input id="end" type="date" name="end" min={f.start || todayISO()} value={f.end} onChange={set} required />
                    </div>
                  )}
                </div>
              )}
              {!hasRange && kind !== 'style' && (
                <div className="input-group">
                  <label htmlFor="people">Number of people</label>
                  <input id="people" type="number" name="people" min="1" max="100" value={f.people} onChange={set} required />
                </div>
              )}
              {kind === 'hotel' && (
                <div className="input-group">
                  <label htmlFor="room">Room type</label>
                  <select id="room" name="room" value={f.room} onChange={set}>
                    {ROOMS.map(([v, label]) => <option key={v} value={v}>{label}</option>)}
                  </select>
                </div>
              )}
              {kind === 'style' && (
                <div className="input-group">
                  <label htmlFor="note">Anything we should know? (optional)</label>
                  <textarea id="note" name="note" rows="3" value={f.note} onChange={set} placeholder="Early game drives, vegetarian meals…" />
                </div>
              )}

              {total > 0 && (
                <p className="summary">
                  {hasRange ? `${quantity} ${text.unitName}${quantity > 1 ? 's' : ''}` : `${quantity} ${quantity > 1 ? 'people' : 'person'}`} × {formatKsh(unitPrice)} = <strong>{formatKsh(total)}</strong>
                </p>
              )}
              {rangeInvalid && <p className="message error">{text.end} must not be before {text.start.toLowerCase()}.</p>}
              {message.text && <p className={`message ${message.type}`} role="status">{message.text}</p>}

              <button type="submit" className="confirm-btn" disabled={busy}>{busy ? 'Saving...' : text.cta}</button>
              {message.type === 'success' && total > 0 && (
                <button type="button" className="pill ghost" onClick={() => setPayAmount(total)}>Pay with M-Pesa</button>
              )}
            </form>
          )}
        </div>
      </div>
      {payAmount != null && <PayModal amount={payAmount} onClose={() => setPayAmount(null)} />}
    </div>
  );
}
