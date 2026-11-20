import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { useApi, useDebounce } from '../hooks';
import { formatKsh, pageCount, photoUrl } from '../utils';
import Pager from './Pager';

const PAGE_SIZE = 8;

export default function AdminProducts() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [version, setVersion] = useState(0);
  const [editing, setEditing] = useState(null); // { id, product_name, product_description, product_cost }
  const [message, setMessage] = useState({ type: '', text: '' });
  const q = useDebounce(search);

  const { data, loading, error } = useApi((s) => api.getProducts({ search: q, ordering: '-id', page, page_size: PAGE_SIZE }, s), [q, page, version]);
  const rows = data?.results || [];
  const refresh = () => setVersion((v) => v + 1);

  const save = async (e) => {
    e.preventDefault();
    try {
      await api.updateProduct(editing.id, {
        product_name: editing.product_name, product_description: editing.product_description, product_cost: Number(editing.product_cost),
      });
      setMessage({ type: 'success', text: 'Product updated.' });
      setEditing(null);
      refresh();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  const remove = async (p) => {
    if (!window.confirm(`Delete “${p.product_name}”? This cannot be undone.`)) return;
    try {
      await api.deleteProduct(p.id);
      setMessage({ type: 'success', text: 'Product deleted.' });
      if (rows.length === 1 && page > 1) setPage(page - 1); else refresh();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  const set = (e) => setEditing((v) => ({ ...v, [e.target.name]: e.target.value }));

  return (
    <div className="page-bg" style={{ '--bg': 'url(https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?auto=format&fit=crop&w=1920&q=80)' }}>
      <div className="page-head"><h2>Products</h2><Link to="/addproduct" className="pill">+ Add product</Link></div>
      <div className="dash">
        <div className="toolbar">
          <input type="search" className="search" placeholder="Search products" aria-label="Search products"
            value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        </div>
        {message.text && <p className={`message ${message.type}`} role="status">{message.text}</p>}
        {error && <p className="message error" role="alert">{error}</p>}

        <div className="glass-card left" aria-busy={loading}>
          {loading && <p className="hint">Loading...</p>}
          {!loading && !error && !rows.length && <p className="hint">No products found.</p>}
          <ul className="plan-list">
            {rows.map((p) => (
              <li key={p.id} className="prod-row">
                <img src={photoUrl(p)} alt="" loading="lazy" width="72" height="54" onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }} />
                {editing?.id === p.id ? (
                  <form className="prod-edit" onSubmit={save}>
                    <input name="product_name" value={editing.product_name} onChange={set} maxLength={100} required aria-label="Name" />
                    <input name="product_cost" type="number" min="0" value={editing.product_cost} onChange={set} required aria-label="Price" />
                    <textarea name="product_description" rows="2" value={editing.product_description} onChange={set} required aria-label="Description" />
                    <div><button className="pill" type="submit">Save</button> <button className="pill ghost inline" type="button" onClick={() => setEditing(null)}>Cancel</button></div>
                  </form>
                ) : (
                  <>
                    <div className="grow"><strong>{p.product_name}</strong><div className="hint">{formatKsh(p.product_cost)}</div></div>
                    <button className="pill ghost inline" onClick={() => setEditing({ ...p })}>Edit</button>
                    <button className="pill danger" onClick={() => remove(p)}>Delete</button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
        <Pager page={page} pages={pageCount(data?.count, PAGE_SIZE)} onChange={setPage} />
      </div>
    </div>
  );
}
