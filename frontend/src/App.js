import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

// Layout
import MainLayout from './components/layout/MainLayout';

// Pages
import HomePage from './pages/HomePage';
import AlertFeedPage from './pages/AlertFeedPage';
import AlertDetailPage from './pages/AlertDetailPage';
import AlertMapPage from './pages/AlertMapPage';
import QRScannerPage from './pages/QRScannerPage';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="alerts" element={<AlertFeedPage />} />
            <Route path="alerts/:id" element={<AlertDetailPage />} />
            <Route path="map" element={<AlertMapPage />} />
            <Route path="scanner" element={<QRScannerPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer position="bottom-right" />
    </>
  );
}

export default App;
