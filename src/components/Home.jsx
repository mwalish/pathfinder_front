import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth';

const SERVICES = [
  { to: '/booktrip', icon: '✈️', title: 'Book Trip', desc: 'Plan your next destination' },
  { to: '/bookcar', icon: '🚗', title: 'Rent Car', desc: 'Luxury & off-road vehicles' },
  { to: '/hotelbooking', icon: '🏨', title: 'Book Hotel', desc: 'Luxury accommodations' },
  { to: '/touractivity', icon: '⛺', title: 'Activities', desc: 'Things to do on your trip' },
  { to: '/travelstyle', icon: '✨', title: 'Travel Style', desc: 'Personalize your experience' },
  { to: '/travelplan', icon: '🗺️', title: 'Travel Plan', desc: 'Choose the days you travel' },
];
const DASHBOARD = { to: '/dashboard', icon: '📊', title: 'My Dashboard', desc: 'Bookings, payments and plans' };
const ADMIN = [
  { to: '/admin/products', icon: '📦', title: 'Manage Products', desc: 'Add, edit and remove listings' },
  { to: '/admin/users', icon: '👥', title: 'Manage Users', desc: 'See users and set roles' },
];

export default function Home() {
  const { user, isAdmin } = useAuth();
  const services = [...(user ? [{ ...DASHBOARD, title: isAdmin ? 'Admin Dashboard' : DASHBOARD.title }] : []), ...SERVICES, ...(isAdmin ? ADMIN : [])];
  return (
    <div className="hero-container">
      <div className="vignette" />
      <main className="glass-card wide">
        <h1 className="title">{user ? `Welcome, ${user.username}` : 'Our Services'}</h1>
        <p className="subtitle">Select a service to manage your next adventure.</p>
        <div className="services-grid">
          {services.map((s) => (
            <Link key={s.to} to={s.to} className="service-card">
              <div className="icon" aria-hidden="true">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
