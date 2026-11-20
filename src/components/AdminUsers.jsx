import React, { useState } from 'react';
import { api } from '../api';
import { useAuth } from '../auth';
import { useApi, useDebounce } from '../hooks';
import { formatDate, pageCount } from '../utils';
import Pager from './Pager';

const PAGE_SIZE = 10;

export default function AdminUsers() {
  const { user: me } = useAuth();
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [page, setPage] = useState(1);
  const [version, setVersion] = useState(0);
  const [message, setMessage] = useState({ type: '', text: '' });
  const q = useDebounce(search);

  const { data, loading, error } = useApi((s) => api.getUsers({ search: q, role, page, page_size: PAGE_SIZE }, s), [q, role, page, version]);

  const change = async (u, newRole) => {
    if (!window.confirm(`Make ${u.username} ${newRole === 'admin' ? 'an admin' : 'a traveler'}?`)) return;
    try {
      await api.setUserRole(u.id, newRole);
      setMessage({ type: 'success', text: `${u.username} is now ${newRole}.` });
      setVersion((v) => v + 1);
    } catch (e) {
      setMessage({ type: 'error', text: e.message });
    }
  };

  const rows = data?.results || [];
  return (
    <div className="page-bg" style={{ '--bg': 'url(https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1920&q=80)' }}>
      <div className="page-head"><h2>Users</h2></div>
      <div className="dash">
        <div className="toolbar">
          <input type="search" className="search" placeholder="Search name or email" aria-label="Search users"
            value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
          <select aria-label="Filter by role" value={role} onChange={(e) => { setRole(e.target.value); setPage(1); }}>
            <option value="">All roles</option><option value="traveler">Travelers</option><option value="admin">Admins</option>
          </select>
        </div>
        {message.text && <p className={`message ${message.type}`} role="status">{message.text}</p>}
        {error && <p className="message error" role="alert">{error}</p>}
        <div className="table-wrap glass-card left" aria-busy={loading}>
          <table>
            <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Joined</th><th>Role</th></tr></thead>
            <tbody>
              {rows.map((u) => (
                <tr key={u.id}>
                  <td data-label="Name">{u.username}</td>
                  <td data-label="Email">{u.email}</td>
                  <td data-label="Phone">{u.phone}</td>
                  <td data-label="Joined">{formatDate(u.created_at)}</td>
                  <td data-label="Role">
                    <select aria-label={`Role for ${u.username}`} value={u.role} disabled={u.id === me.id} onChange={(e) => change(u, e.target.value)}>
                      <option value="traveler">Traveler</option><option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {loading && <p className="hint">Loading...</p>}
          {!loading && !error && !rows.length && <p className="hint">No users match.</p>}
        </div>
        <Pager page={page} pages={pageCount(data?.count, PAGE_SIZE)} onChange={setPage} />
      </div>
    </div>
  );
}
