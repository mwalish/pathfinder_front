import React, { useMemo, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../auth';
import { useApi } from '../hooks';
import { pageCount } from '../utils';
import Pager from './Pager';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const PAGE_SIZE = 5;

export default function TravelPlan() {
  const { user } = useAuth();
  const [form, setForm] = useState({ place: '', period_type: 'days', duration: 5 });
  const [days, setDays] = useState([]);
  const [page, setPage] = useState(1);
  const [version, setVersion] = useState(0);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const plans = useApi(
    (signal) => api.getPlans({ ordering: '-id', page, page_size: PAGE_SIZE }, signal),
    [user.id, page, version]
  );

  // Which chips to show depends on the period: weekdays, dates 1-31, or "Day 1…Day N"
  const options = useMemo(() => {
    if (form.period_type === 'weeks') return WEEKDAYS;
    if (form.period_type === 'months') return Array.from({ length: 31 }, (_, i) => String(i + 1));
    return Array.from({ length: Math.min(Number(form.duration) || 1, 60) }, (_, i) => `Day ${i + 1}`);
  }, [form.period_type, form.duration]);

  const set = (e) => { setForm((f) => ({ ...f, [e.target.name]: e.target.value })); setDays([]); };
  const toggle = (d) => setDays((cur) => (cur.includes(d) ? cur.filter((x) => x !== d) : [...cur, d]));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMessage({ type: '', text: '' });
    try {
      const data = await api.addPlan({ place: form.place, period_type: form.period_type, day: days });
      setMessage({ type: 'success', text: data.message });
      setForm((f) => ({ ...f, place: '' }));
      setDays([]);
      setPage(1);
      setVersion((v) => v + 1);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setBusy(false);
    }
  };

  const items = plans.data?.results || [];
  return (
    <div className="page-bg" style={{ '--bg': 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1920&q=80)' }}>
      <div className="page-head"><h2>Travel Plan</h2></div>
      <div className="two-col">
        <form className="glass-card left" onSubmit={submit}>
          <h3 className="section-title">New plan</h3>
          <div className="input-group">
            <label htmlFor="place">Where do you want to go?</label>
            <input id="place" name="place" value={form.place} onChange={set} maxLength={100} placeholder="Maasai Mara" required />
          </div>
          <div className="input-row">
            <div className="input-group">
              <label htmlFor="duration">Length</label>
              <input id="duration" type="number" name="duration" min="1" max="60" value={form.duration} onChange={set} />
            </div>
            <div className="input-group">
              <label htmlFor="period_type">Time period</label>
              <select id="period_type" name="period_type" value={form.period_type} onChange={set}>
                <option value="days">Days</option>
                <option value="weeks">Weeks</option>
                <option value="months">Months</option>
              </select>
            </div>
          </div>
          <p className="hint">{form.period_type === 'weeks' ? 'Which days of the week?' : form.period_type === 'months' ? 'Which dates of the month?' : 'Which days do you want to plan?'}</p>
          <div className="chips">
            {options.map((d) => (
              <button key={d} type="button" className={`chip ${days.includes(d) ? 'on' : ''}`} aria-pressed={days.includes(d)} onClick={() => toggle(d)}>{d}</button>
            ))}
          </div>
          {message.text && <p className={`message ${message.type}`} role="status">{message.text}</p>}
          <button type="submit" className="confirm-btn" disabled={busy}>{busy ? 'Saving...' : 'Save travel plan'}</button>
        </form>

        <section className="glass-card left">
          <h3 className="section-title">Your plans</h3>
          {plans.error && <p className="message error" role="alert">{plans.error}</p>}
          {plans.loading && <p className="hint">Loading your plans...</p>}
          {!plans.loading && !plans.error && !items.length && <p className="hint">No plans yet. Your first one will show up here.</p>}
          <ul className="plan-list">
            {items.map((p) => (
              <li key={p.id}>
                <strong>{p.place}</strong> <span className="hint">per {p.period_type.replace(/s$/, '')}</span>
                <div className="hint">{p.days.length ? p.days.join(', ') : 'No days selected'}</div>
              </li>
            ))}
          </ul>
          <Pager page={page} pages={pageCount(plans.data?.count, PAGE_SIZE)} onChange={setPage} />
        </section>
      </div>
    </div>
  );
}
