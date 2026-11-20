import React, { useState } from 'react';
import ChatPanel from './ChatPanel';

export default function FloatingChatBot() {
  const [open, setOpen] = useState(false);
  return (
    <div className="chat-float">
      {open && <ChatPanel onClose={() => setOpen(false)} />}
      <button className="chat-fab" onClick={() => setOpen(!open)} aria-label={open ? 'Close chat' : 'Open chat'} aria-expanded={open}>
        {open ? '✕' : '💬'}
      </button>
    </div>
  );
}
