import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../auth';

// <RequireAuth>            any signed-in user
// <RequireAuth role="admin">  admins only (the server enforces this too; this just hides the page)
export default function RequireAuth({ role, children }) {
  const { user } = useAuth();
  const { pathname } = useLocation();
  if (user && (!role || user.role === role)) return children;
  return (
    <div className="hero-container">
      <div className="vignette" />
      <div className="glass-card narrow">
        {user ? (
          <>
            <h1 className="title small">No access</h1>
            <p className="subtitle">This page is for administrators.</p>
            <Link to="/dashboard" className="confirm-btn link-btn">Go to my dashboard</Link>
          </>
        ) : (
          <>
            <h1 className="title small">Sign in to continue</h1>
            <p className="subtitle">You need an account to use this page.</p>
            <Link to="/signin" state={{ from: pathname }} className="confirm-btn link-btn">Sign in</Link>
            <p className="foot">New here? <Link to="/signup" className="gold-link">Create an account</Link></p>
          </>
        )}
      </div>
    </div>
  );
}
