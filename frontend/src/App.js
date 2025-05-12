import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import './index.css';  // This should import the compiled Tailwind CSS file

// Layout
import MainLayout from './components/layout/MainLayout';

// Pages
import AlertFeedPage from './pages/CitizenDashboard/AlertFeedPage';
import AlertDetailPage from './pages/CitizenDashboard/AlertDetailPage'; // Correct import
import AlertMapPage from './pages/CitizenDashboard/AlertMapPage';
import QRScannerPage from './pages/CitizenDashboard/QRScannerPage';
import Dashboard from './pages/CitizenDashboard/Dashboard1';
import Dashboard2 from './pages/GovnDashboard/Dashboard2';
import Givealert from './pages/GovnDashboard/Givealert';
import ResourceRequests from './pages/CitizenDashboard/ResourceRequests';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="AlertFeedPage" element={<AlertFeedPage />} />
            {/* Updated Route for AlertDetailsPage */}
            <Route path="alert/:id" element={<AlertDetailPage />} />
            <Route path="AlertMapPage" element={<AlertMapPage />} />
            <Route path="QRScannerPage" element={<QRScannerPage />} />
            <Route path="GovernmentDashboard" element={<Dashboard2 />} />
            <Route path="Givealert" element={<Givealert />} />
            <Route path="ResourceRequests" element={<ResourceRequests />} />
            {/* <Route path="*" element={<NotFoundPage />} /> */}
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer position="bottom-right" />
    </>
  );
}

export default App;
