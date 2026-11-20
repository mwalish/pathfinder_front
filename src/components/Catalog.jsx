import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { KINDS } from '../catalog';
import { useApi, useDebounce } from '../hooks';
import { formatKsh, pageCount, photoUrl } from '../utils';
import Pager from './Pager';

const PAGE_SIZE = 6;
const SORTS = [['-id', 'Newest first'], ['product_cost', 'Price: low to high'], ['-product_cost', 'Price: high to low']];

// One browse page for trips, activities, cars, hotels and styles (server-side filter, search, sort, paging).
export default function Catalog({ kind }) {
  const cfg = KINDS[kind];
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [ordering, setOrdering] = useState('-id');
  const [page, setPage] = useState(1);
  const q = useDebounce(search);

  // category + search + sort + page travel in ONE request
  const { data, loading, error } = useApi(
    (signal) => api.getProducts({ category: kind, search: q, ordering, page, page_size: PAGE_SIZE }, signal),
    [kind, q, ordering, page]
  );
  const items = data?.results || [];

  return (
    <div className="page-bg" style={{ '--bg': `url(${cfg.bg})` }}>
      <div className="page-head">
        <h2>{cfg.title}</h2>
        <button className="pill" onClick={() => navigate(-1)}>← Back</button>
      </div>

      <div className="toolbar">
        <input type="search" className="search" placeholder={cfg.search} aria-label="Search"
          value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        <select aria-label="Sort" value={ordering} onChange={(e) => { setOrdering(e.target.value); setPage(1); }}>
          {SORTS.map(([v, label]) => <option key={v} value={v}>{label}</option>)}
        </select>
      </div>

      {error && <p className="message error" role="alert">{error}</p>}

      <div className="catalog-grid" aria-busy={loading}>
        {loading
          ? Array.from({ length: PAGE_SIZE }, (_, i) => <div key={i} className="item-card skeleton" aria-hidden="true" />)
          : items.map((item) => (
              <Link key={item.id} to={cfg.detail} state={{ item }} className="item-card">
                <img src={photoUrl(item)} alt={item.product_name} loading="lazy" width="500" height="300"
                  onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }} />
                <div className="item-body">
                  <h3>{item.product_name}</h3>
                  <p>{item.product_description}</p>
                  <div className="item-foot">
                    {cfg.unit && item.product_cost > 0 ? <span className="price">{formatKsh(item.product_cost)} <small>{cfg.unit}</small></span> : <span />}
                    <span className="more">View details →</span>
                  </div>
                </div>
              </Link>
            ))}
      </div>

      {!loading && !error && !items.length && (
        <p className="empty">{q ? `${cfg.empty} Nothing matches “${q}”.` : cfg.empty}</p>
      )}
      <Pager page={page} pages={pageCount(data?.count, PAGE_SIZE)} onChange={setPage} />
    </div>
  );
}
