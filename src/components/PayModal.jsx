import React, { useState } from 'react';
import { api } from '../api';
import { useAuth } from '../auth';
import { formatKsh } from '../utils';

// Sends the M-Pesa prompt to the customer's phone (STK push).
export default function PayModal({ amount, onClose }) {
  const { user } = useAuth();
  const [phone, setPhone] = useState(user?.phone || '');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState({ type: '', text: '' });

  const pay = async (e) => {
    e.preventDefault();
    setBusy(true);
    setResult({ type: '', text: '' });
    try {
      const data = await api.payMpesa({ phone, amount });
      setResult({ type: 'success', text: data.message });
    } catch (err) {
      setResult({ type: 'error', text: err.message });
    } finally {
      setBusy(false);
    }
  };

  const sent = result.type === 'success';
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Pay with M-Pesa">
      <form className="modal glass-card" onSubmit={pay}>
        <h2 className="title small">Pay with M-Pesa</h2>
        <p className="subtitle">Amount: <strong>{formatKsh(amount)}</strong></p>
        <div className="input-group left">
          <label htmlFor="mpesa-phone">M-Pesa phone number</label>
          <input id="mpesa-phone" type="tel" placeholder="0712345678" value={phone} onChange={(e) => setPhone(e.target.value)} required disabled={sent} />
        </div>
        {result.text && <p className={`message ${result.type}`} role="status">{result.text}</p>}
        {sent ? (
          <button type="button" className="confirm-btn" onClick={onClose}>Done</button>
        ) : (
          <>
            <button type="submit" className="confirm-btn" disabled={busy}>{busy ? 'Sending prompt...' : 'Send payment prompt'}</button>
            <button type="button" className="pill ghost" onClick={onClose}>Pay later</button>
          </>
        )}
      </form>
    </div>
  );
}
