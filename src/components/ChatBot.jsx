import React from 'react';
import { useNavigate } from 'react-router-dom';
import ChatPanel from './ChatPanel';

export default function ChatBot() {
  const navigate = useNavigate();
  return (
    <div className="hero-container">
      <div className="vignette" />
      <ChatPanel onBack={() => navigate('/')} />
    </div>
  );
}
