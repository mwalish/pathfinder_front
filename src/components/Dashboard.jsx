import React from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../auth';
import { useApi } from '../hooks';
import { formatDate, formatKsh } from '../utils';

const ICONS = { trip: '✈️', car: '🚗', hotel: '🏨' };

// What each role sees. `key` is a field of dashboard.stats from the API.
const TILES = {
  traveler: [
    ['plans', 'Travel plans'], ['trip_bookings', 'Trips booked'], ['car_rentals', 'Cars rented'],
    ['hotel_bookings', 'Hotel stays'], ['payments_paid', 'Payments made'], ['amount_paid', 'Total paid', true],
  ],
  admin: [
    ['travelers', 'Travelers'], ['products', 'Products'], ['trip_bookings', 'Trips booked'],
    ['car_rentals', 'Cars rented'], ['hotel_bookings', 'Hotel stays'], ['amount_paid', 'Revenue (paid)', true],
    ['payments_pending', 'Payments pending'], ['payments_failed', 'Payments failed'],
  ],
};
const ACTIONS = {
  traveler: [['/booktrip', 'Book a trip'], ['/travelplan', 'Plan a trip'], ['/records', 'My bookings & payments']],
  admin: [['/admin/products', 'Manage products'], ['/admin/users', 'Manage users'], ['/records', 'All bookings & payments']],
};

export function StatusBadge({ status }) {
  return <span className={`badge ${status.toLowerCase()}`}>{status}</span>;
}

export default function Dashboard() {
  const { user } = useAuth();
  const { data, loading, error } = useApi((s) => api.getDashboard(s), []);
  const role = data?.role || user.role;
  const admin = role === 'admin';

  return (
    <div className="page-bg" style={{ '--bg': 'url(https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1920&q=80)' }}>
      <div className="page-head">
        <h2>{admin ? 'Admin dashboard' : 'My dashboard'} <span className="role-tag">{role}</span></h2>
      </div>
      <div className="dash">
        {error && <p className="message error" role="alert">{error}</p>}

        <div className="stat-grid" aria-busy={loading}>
          {(TILES[role] || TILES.traveler).map(([key, label, money]) => (
            <div key={key} className={`stat ${loading ? 'skeleton' : ''}`}>
              {!loading && data && <strong>{money ? formatKsh(data.stats[key]) : data.stats[key]}</strong>}
              <span>{label}</span>
            </div>
          ))}
        </div>

        <div className="actions">
          {(ACTIONS[role] || ACTIONS.traveler).map(([to, label]) => <Link key={to} to={to} className="pill">{label}</Link>)}
        </div>

        <div className="two-col">
          <section className="glass-card left">
            <h3 className="section-title">Recent bookings</h3>
            {!loading && !data?.recent_activity.length && <p className="hint">Nothing booked yet.</p>}
            <ul className="plan-list">
              {data?.recent_activity.map((a, i) => (
                <li key={i}>
                  <span aria-hidden="true">{ICONS[a.kind]}</span> <strong>{a.title}</strong>
                  <div className="hint">{admin && `${a.username} · `}{formatDate(a.created_at)}</div>
                </li>
              ))}
            </ul>
          </section>
          <section className="glass-card left">
            <h3 className="section-title">Recent payments</h3>
            {!loading && !data?.recent_payments.length && <p className="hint">No payments yet.</p>}
            <ul className="plan-list">
              {data?.recent_payments.map((p) => (
                <li key={p.id}>
                  <strong>{formatKsh(p.amount)}</strong> <StatusBadge status={p.status} />
                  <div className="hint">{admin && p.username && `${p.username} · `}{p.mpesa_receipt && `${p.mpesa_receipt} · `}{formatDate(p.created_at)}</div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
