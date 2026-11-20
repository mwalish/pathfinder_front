import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import RequireAuth from './components/RequireAuth';
import Home from './components/Home';
import Auth from './components/Auth';
import Catalog from './components/Catalog';
import Details from './components/Details';
import TravelPlan from './components/TravelPlan';
import AddProduct from './components/AddProduct';
import ChatBot from './components/ChatBot';
import Dashboard from './components/Dashboard';
import Records from './components/Records';
import AdminUsers from './components/AdminUsers';
import AdminProducts from './components/AdminProducts';

// `key` makes each section start fresh (own search box and page number)
const catalog = (kind) => <Catalog key={kind} kind={kind} />;
const details = (kind) => <Details key={kind} kind={kind} />;

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="signin" element={<Auth mode="signin" />} />
        <Route path="signup" element={<Auth mode="signup" />} />
        <Route path="auth" element={<Navigate to="/signin" replace />} />

        <Route path="booktrip" element={catalog('trip')} />
        <Route path="touractivity" element={catalog('activity')} />
        <Route path="bookcar" element={catalog('car')} />
        <Route path="hotelbooking" element={catalog('hotel')} />
        <Route path="travelstyle" element={catalog('style')} />

        <Route path="trip-details" element={details('trip')} />
        <Route path="activity-details" element={details('activity')} />
        <Route path="car-details" element={details('car')} />
        <Route path="hotel-details" element={details('hotel')} />
        <Route path="style-details" element={details('style')} />

        <Route path="travelplan" element={<RequireAuth><TravelPlan /></RequireAuth>} />
        <Route path="dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="records" element={<RequireAuth><Records /></RequireAuth>} />
        <Route path="addproduct" element={<RequireAuth role="admin"><AddProduct /></RequireAuth>} />
        <Route path="admin/users" element={<RequireAuth role="admin"><AdminUsers /></RequireAuth>} />
        <Route path="admin/products" element={<RequireAuth role="admin"><AdminProducts /></RequireAuth>} />
        <Route path="chatbot" element={<ChatBot />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
