import React, { useState } from 'react';
import { api } from '../api';
import { useAuth } from '../auth';
import { useApi, useDebounce } from '../hooks';
import { formatDate, formatKsh, pageCount } from '../utils';
import { StatusBadge } from './Dashboard';
import Pager from './Pager';

const PAGE_SIZE = 10;
// Each tab: how to fetch it and which columns to show
const TABS = {
  trip: { label: 'Trips', fetch: (p, s) => api.getRecords({ ...p, kind: 'trip' }, s), cols: [
    ['Destination', (r) => r.place_to_visit], ['Departure', (r) => formatDate(r.departure_date)], ['People', (r) => r.number_of_people]] },
  car: { label: 'Cars', fetch: (p, s) => api.getRecords({ ...p, kind: 'car' }, s), cols: [
    ['Car', (r) => r.car_model], ['Pick-up', (r) => formatDate(r.pickup_date)], ['Return', (r) => formatDate(r.return_date)],
    ['Total', (r) => formatKsh(r.total_cost)], ['Status', (r) => r.status]] },
  hotel: { label: 'Hotels', fetch: (p, s) => api.getRecords({ ...p, kind: 'hotel' }, s), cols: [
    ['Hotel', (r) => r.hotel_name], ['Room', (r) => r.room_type], ['Check-in', (r) => formatDate(r.check_in)],
    ['Check-out', (r) => formatDate(r.check_out)], ['Total', (r) => formatKsh(r.total_price)]] },
  payments: { label: 'Payments', fetch: (p, s) => api.getPayments(p, s), noFilter: true, cols: [
    ['Amount', (r) => formatKsh(r.amount)], ['Phone', (r) => r.phone], ['Status', (r) => <StatusBadge status={r.status} />],
    ['Receipt', (r) => r.mpesa_receipt || '—']] },
};

export default function Records() {
  const { isAdmin } = useAuth();
  const [tab, setTab] = useState('trip');
  const [page, setPage] = useState(1);
  const [who, setWho] = useState('');
  const username = useDebounce(who);
  const cfg = TABS[tab];

  const { data, loading, error } = useApi(
    (s) => cfg.fetch({ page, page_size: PAGE_SIZE, username: isAdmin && !cfg.noFilter ? username : '' }, s),
    [tab, page, username]
  );
  const rows = data?.results || [];
  const cols = [...cfg.cols, ...(isAdmin ? [['Traveler', (r) => r.username]] : []), ['Date', (r) => formatDate(r.created_at)]];

  return (
    <div className="page-bg" style={{ '--bg': 'url(https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&w=1920&q=80)' }}>
      <div className="page-head"><h2>{isAdmin ? 'All bookings & payments' : 'My bookings & payments'}</h2></div>
      <div className="dash">
        <div className="toolbar">
          <div className="tab-row" role="tablist">
            {Object.entries(TABS).map(([key, t]) => (
              <button key={key} role="tab" aria-selected={tab === key} className={`chip ${tab === key ? 'on' : ''}`}
                onClick={() => { setTab(key); setPage(1); }}>{t.label}</button>
            ))}
          </div>
          {isAdmin && !cfg.noFilter && (
            <input type="search" className="search" placeholder="Filter by username" aria-label="Filter by username"
              value={who} onChange={(e) => { setWho(e.target.value); setPage(1); }} />
          )}
        </div>

        {error && <p className="message error" role="alert">{error}</p>}
        <div className="table-wrap glass-card left" aria-busy={loading}>
          <table>
            <thead><tr>{cols.map(([h]) => <th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {rows.map((r) => <tr key={r.id}>{cols.map(([h, fn]) => <td key={h} data-label={h}>{fn(r)}</td>)}</tr>)}
            </tbody>
          </table>
          {loading && <p className="hint">Loading...</p>}
          {!loading && !error && !rows.length && <p className="hint">Nothing here yet.</p>}
        </div>
        <Pager page={page} pages={pageCount(data?.count, PAGE_SIZE)} onChange={setPage} />
      </div>
    </div>
  );
}
