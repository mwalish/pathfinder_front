import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { answer } from '../chatbot';

const GREETING = { id: 1, text: 'Hello! How can I help you today?', isUser: false };
const QUICK = ['Book a trip', 'Rent a car', 'How do I pay?'];

// Shared chat window used by the floating widget and the /chatbot page.
export default function ChatPanel({ onClose, onBack }) {
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const box = useRef(null);
  const timer = useRef(null);

  useEffect(() => { if (box.current) box.current.scrollTop = box.current.scrollHeight; }, [messages, typing]);
  useEffect(() => () => clearTimeout(timer.current), []);

  const send = (raw) => {
    const text = raw.trim();
    if (!text) return;
    setMessages((m) => [...m, { id: Date.now(), text, isUser: true }]);
    setInput('');
    setTyping(true);
    timer.current = setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, { id: Date.now() + 1, isUser: false, ...answer(text) }]);
    }, 600);
  };

  return (
    <section className="chat-panel" aria-label="Chat assistant">
      <header>
        {onBack && <button onClick={onBack} aria-label="Back to home">←</button>}
        <div><strong>Pathfinder Assistant</strong><small>Online</small></div>
        <button onClick={() => setMessages([GREETING])} aria-label="Clear chat">🗑️</button>
        {onClose && <button onClick={onClose} aria-label="Close chat">✕</button>}
      </header>
      <div className="chat-body" ref={box} aria-live="polite">
        {messages.map((m) => (
          <div key={m.id} className={`chat-msg ${m.isUser ? 'user' : 'bot'}`}>
            {m.text}
            {m.to && <Link to={m.to} className="chat-link" onClick={onClose}>{m.label} →</Link>}
          </div>
        ))}
        {typing && <div className="chat-msg bot"><span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" /></div>}
      </div>
      <div className="chat-quick">
        {QUICK.map((q) => <button key={q} onClick={() => send(q)}>{q}</button>)}
      </div>
      <form className="chat-input" onSubmit={(e) => { e.preventDefault(); send(input); }}>
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your message..." aria-label="Message" />
        <button type="submit" aria-label="Send">➤</button>
      </form>
    </section>
  );
}
