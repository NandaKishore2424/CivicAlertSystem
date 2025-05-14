import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom'; // Remove BrowserRouter import
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import './index.css';
import { Web3Provider } from './context/Web3Context';
import { AuthProvider } from './context/AuthContext';
import { AlertsProvider } from './context/AlertsContext';

// Layout
import MainLayout from './components/layout/MainLayout';
import Navbar from './components/layout/Navbar';

// Pages - Public
import LandingPage from './components/homepage/LandingPage';
import AlertFeedPage from './pages/AlertFeedPage';
import NotFoundPage from './pages/NotFoundPage';

// Pages - Citizen Dashboard
import Dashboard1 from './pages/CitizenDashboard/Dashboard1';
import AlertDetailPage from './pages/CitizenDashboard/AlertDetailPage';
import AlertMapPage from './pages/CitizenDashboard/AlertMapPage';
import QRScannerPage from './pages/CitizenDashboard/QRScannerPage';
import ResourceRequests from './pages/CitizenDashboard/ResourceRequests';
import SettingsPage from './pages/CitizenDashboard/SettingsPage';

// Pages - Government Dashboard
import Dashboard2 from './pages/GovnDashboard/Dashboard2';
import Givealert from './pages/GovnDashboard/Givealert';
import GovernmentSettings from './pages/GovnDashboard/GovernmentSettings'; // Add this line

// Auth Components
import Signup from './components/login/Signup';
import Signin from './components/login/Signin';
import SignupOfficial from './components/login/SignupOfficial';

// Demo Alert Components
import FloodWarning from './pages/DemoAlerts/FloodWarning';
import WeatherAdvisory from './pages/DemoAlerts/WeatherAdvisory';
import RoadClosure from './pages/DemoAlerts/RoadClosure';
import EvacuationLifted from './pages/DemoAlerts/EvacuationLifted';

// Update NavbarWrapper to hide navbar on resource-requests page

const NavbarWrapper = () => {
  const location = useLocation();
  const hideNavbar = location.pathname === '/' || 
                    location.pathname === '/signin' || 
                    location.pathname === '/signup' || 
                    location.pathname === '/signupofficial' ||
                    location.pathname === '/citizen/dashboard' ||
                    location.pathname === '/alerts' ||
                    location.pathname === '/settings' || 
                    location.pathname === '/scanner' ||
                    location.pathname === '/map' ||
                    location.pathname === '/government/dashboard' ||
                    location.pathname === '/government/create-alert' ||
                    location.pathname === '/government/settings' ||
                    location.pathname === '/resource-requests' || // Add this line
                    location.pathname.startsWith('/alerts/') ||
                    location.pathname.startsWith('/demo/');
  
  return !hideNavbar ? <Navbar /> : null;
};

// Main Routes Component
const AppRoutes = () => {
  return (
    <>
      <NavbarWrapper />
      <Routes>
        {/* Public pages */}
        <Route index element={<LandingPage />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signupofficial" element={<SignupOfficial />} />
        
        {/* Dashboard & Alerts */}
        <Route path="/alerts" element={<Dashboard1 />} />
        <Route path="/alerts/:id" element={<AlertDetailPage />} />
        <Route path="/citizen/dashboard" element={<Dashboard1 />} />
        <Route path="/settings" element={<SettingsPage />} />
        
        {/* Government Dashboard Routes - OUTSIDE MainLayout */}
        <Route path="/government/dashboard" element={<Dashboard2 />} />
        <Route path="/government/create-alert" element={<Givealert />} />
        <Route path="/government/settings" element={<GovernmentSettings />} /> {/* Add this new line */}
        <Route path="/GovernmentDashboard" element={<Dashboard2 />} />
        <Route path="/Givealert" element={<Givealert />} />
        
        {/* Static Demo Alert Pages */}
        <Route path="/demo/flood-warning" element={<FloodWarning />} />
        <Route path="/demo/weather-advisory" element={<WeatherAdvisory />} />
        <Route path="/demo/road-closure" element={<RoadClosure />} />
        <Route path="/demo/evacuation-lifted" element={<EvacuationLifted />} />
        
        {/* All other routes within MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/map" element={<AlertMapPage />} />
          <Route path="/scanner" element={<QRScannerPage />} />
          <Route path="/resource-requests" element={<ResourceRequests />} />
          <Route path="/AlertMapPage" element={<AlertMapPage />} />
          <Route path="/QRScannerPage" element={<QRScannerPage />} />
          <Route path="/AlertFeedPage" element={<AlertFeedPage />} />
          
          {/* 404 Page */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
};

function App() {
  return (
    <Web3Provider>
      <AuthProvider>
        <AlertsProvider>
          <ToastContainer position="top-right" autoClose={5000} />
          <AppRoutes />
        </AlertsProvider>
      </AuthProvider>
    </Web3Provider>
  );
}

export default App;
