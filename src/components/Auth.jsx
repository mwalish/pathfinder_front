import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../auth';
import { isStrongPassword, passwordStrength } from '../utils';

const BG = {
  signin: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=1920&q=80',
  signup: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80',
};
const EMPTY = { username: '', email: '', phone: '', password: '', confirmPassword: '', agreeTerms: false };

export default function Auth({ mode }) {
  const signup = mode === 'signup';
  const navigate = useNavigate();
  const { state } = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState(EMPTY);
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const strength = passwordStrength(form.password);

  const set = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const validate = () => {
    if (!signup) return '';
    if (form.password !== form.confirmPassword) return 'Passwords do not match.';
    if (!isStrongPassword(form.password)) return 'Password must be 8+ characters with letters, numbers & symbols.';
    if (!form.agreeTerms) return 'You must agree to the Terms & Conditions.';
    return '';
  };

  const submit = async (e) => {
    e.preventDefault();
    const problem = validate();
    setError(problem);
    setSuccess('');
    if (problem) return;
    setBusy(true);
    try {
      if (signup) {
        await api.signup({ username: form.username, email: form.email, phone: form.phone, password: form.password });
        setSuccess('Account created successfully! Redirecting...');
        setTimeout(() => navigate('/signin'), 1500);
      } else {
        const { user, token } = await api.signin({ email: form.email, password: form.password });
        login(user, token);
        // send people back to the page that asked them to sign in (keeping the item they were viewing)
        navigate(state?.from || '/dashboard', { replace: true, state: state?.item ? { item: state.item } : undefined });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="hero-container" style={{ '--bg': `url(${BG[mode]})` }}>
      <div className="vignette" />
      <div className="glass-card narrow">
        <h2 className="brand">Pathfinder</h2>
        <h1 className="title small">{signup ? 'Join the Journey' : 'Welcome Back'}</h1>
        <p className="subtitle">{signup ? 'Create your explorer account' : 'Continue your journey'}</p>

        <form onSubmit={submit} className="left">
          {error && <p className="message error" role="alert">{error}</p>}
          {success && <p className="message success" role="status">{success}</p>}

          {signup && (
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input id="username" name="username" value={form.username} onChange={set} maxLength={50} autoComplete="username" required />
            </div>
          )}
          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input id="email" type="email" name="email" value={form.email} onChange={set} autoComplete="email" required />
          </div>
          {signup && (
            <div className="input-group">
              <label htmlFor="phone">Phone (M-Pesa)</label>
              <input id="phone" type="tel" name="phone" placeholder="0712345678" value={form.phone} onChange={set} autoComplete="tel" required />
            </div>
          )}
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="with-toggle">
              <input id="password" type={show ? 'text' : 'password'} name="password" value={form.password} onChange={set}
                autoComplete={signup ? 'new-password' : 'current-password'} required />
              <button type="button" className="toggle" onClick={() => setShow(!show)} aria-label={show ? 'Hide password' : 'Show password'}>{show ? '🙈' : '👁️'}</button>
            </div>
            {signup && form.password && (
              <div className="strength" aria-live="polite">
                <span style={{ width: `${strength.score}%`, background: strength.color }} />
                <small>{strength.label}</small>
              </div>
            )}
          </div>
          {signup && (
            <>
              <div className="input-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input id="confirmPassword" type={show ? 'text' : 'password'} name="confirmPassword" value={form.confirmPassword} onChange={set} autoComplete="new-password" required />
              </div>
              <label className="check">
                <input type="checkbox" name="agreeTerms" checked={form.agreeTerms} onChange={set} /> I agree to the Terms &amp; Conditions
              </label>
            </>
          )}

          <button type="submit" className="confirm-btn" disabled={busy}>
            {busy ? 'Please wait...' : signup ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <p className="foot">
          {signup ? <>Already have an account? <Link to="/signin" className="gold-link">Sign in</Link></>
                  : <>Don't have an account? <Link to="/signup" className="gold-link">Create one</Link></>}
        </p>
      </div>
    </div>
  );
}
