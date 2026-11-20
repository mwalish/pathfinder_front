import React from 'react';

// 1 … 4 5 [6] 7 8 … 20
export default function Pager({ page, pages, onChange }) {
  if (!pages || pages <= 1) return null;
  const shown = [...new Set([1, pages, ...Array.from({ length: 5 }, (_, i) => page - 2 + i)])]
    .filter((n) => n >= 1 && n <= pages)
    .sort((a, b) => a - b);
  const go = (n) => { onChange(n); window.scrollTo({ top: 0 }); };
  return (
    <nav className="pager" aria-label="Pages">
      <button disabled={page === 1} onClick={() => go(page - 1)}>Prev</button>
      {shown.map((n, i) => (
        <React.Fragment key={n}>
          {i > 0 && n - shown[i - 1] > 1 && <span className="dots">…</span>}
          <button className={n === page ? 'active' : ''} aria-current={n === page ? 'page' : undefined} onClick={() => go(n)}>{n}</button>
        </React.Fragment>
      ))}
      <button disabled={page === pages} onClick={() => go(page + 1)}>Next</button>
    </nav>
  );
}
