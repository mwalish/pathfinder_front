import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import FloatingChatBot from './FloatingChatBot';

export default function Layout() {
  const { pathname } = useLocation();
  return (
    <div className="App">
      <Navbar />
      <Outlet />
      {pathname !== '/chatbot' && <FloatingChatBot />}
    </div>
  );
}
