import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../auth';

const LINKS = [
  ['/booktrip', 'Trips'],
  ['/hotelbooking', 'Hotels'],
  ['/bookcar', 'Cars'],
  ['/touractivity', 'Activities'],
  ['/travelstyle', 'Styles'],
  ['/travelplan', 'Plan'],
];

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo" onClick={close}>PATHFINDER</Link>
      <button className="nav-toggle" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>☰</button>
      <div className={`nav-links ${open ? 'open' : ''}`}>
        {LINKS.map(([to, label]) => (
          <NavLink key={to} to={to} onClick={close}>{label}</NavLink>
        ))}
        {user && <NavLink to="/dashboard" onClick={close}>Dashboard</NavLink>}
        {isAdmin && <NavLink to="/admin/users" onClick={close}>Users</NavLink>}
        {isAdmin && <NavLink to="/admin/products" onClick={close}>Products</NavLink>}
        {user ? (
          <>
            <span className="nav-user">Hi, {user.username}{isAdmin && <small className="role-tag">admin</small>}</span>
            <button className="nav-auth-btn" onClick={() => { logout(); close(); }}>Sign out</button>
          </>
        ) : (
          <Link to="/signin" className="nav-auth-btn" onClick={close}>Sign in</Link>
        )}
      </div>
    </nav>
  );
}
