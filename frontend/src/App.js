import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
<<<<<<< HEAD
import { useLocation } from 'react-router-dom';

=======
import './index.css';  // This should import the compiled Tailwind CSS file
>>>>>>> f89a8e7447686554cf7682c6bde524b5ab1c06e3

// Layout
import MainLayout from './components/layout/MainLayout';
import Navbar from './pages/NavBar'

// Pages
<<<<<<< HEAD
import HomePage from './pages/HomePage';
import AlertFeedPage from './pages/AlertFeedPage';
import AlertDetailPage from './pages/AlertDetailPage';
import AlertMapPage from './pages/AlertMapPage';
import QRScannerPage from './pages/QRScannerPage';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';
import SignupUser from './components/login/SignupUser';
import SignupOfficial from './components/login/SignupOfficial';
import Signin from './components/login/Signin'
=======
import AlertFeedPage from './pages/CitizenDashboard/AlertFeedPage';
import AlertDetailPage from './pages/CitizenDashboard/AlertDetailPage'; // Correct import
import AlertMapPage from './pages/CitizenDashboard/AlertMapPage';
import QRScannerPage from './pages/CitizenDashboard/QRScannerPage';
import Dashboard from './pages/CitizenDashboard/Dashboard1';
import Dashboard2 from './pages/GovnDashboard/Dashboard2';
import Givealert from './pages/GovnDashboard/Givealert';
import ResourceRequests from './pages/CitizenDashboard/ResourceRequests';
>>>>>>> f89a8e7447686554cf7682c6bde524b5ab1c06e3

function App() {
  const location = useLocation();  // **Access current route**

  // **Condition to hide navbar on signin/signup pages**
  const hideNavbar = location.pathname === '/signin' || location.pathname === '/signupofficial' || location.pathname === '/signup';

  return (
    <>
        {/* **Render Navbar conditionally based on the route** */}
        {!hideNavbar && <Navbar />} {/* Only show Navbar when not on login/signup pages */}

        <Routes>
          <Route path="/" element={<MainLayout />}>
<<<<<<< HEAD
            <Route index element={<HomePage />} />
            <Route path="signin" element={<Signin />} />
            <Route path="signupofficial" element={<SignupOfficial />} />
            <Route path="signup" element={<SignupUser />} />
            <Route path="alerts" element={<AlertFeedPage />} />
            <Route path="alerts/:id" element={<AlertDetailPage />} />
            <Route path="map" element={<AlertMapPage />} />
            <Route path="scanner" element={<QRScannerPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="*" element={<NotFoundPage />} />
=======
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
>>>>>>> f89a8e7447686554cf7682c6bde524b5ab1c06e3
          </Route>
        </Routes>
      <ToastContainer position="bottom-right" />
    </>
  );
}

export default App;
// function App() {
//   return (
//     <>
//       <BrowserRouter>
//         <Routes>
//           <Route path="/" element={<MainLayout />}>
//             <Route index element={<HomePage />} />
//             <Route path="signin" element={<Signin />} />
//             <Route path="signupofficial" element={<SignupOfficial />} />
//             <Route path="signup" element={<SignupUser />} />
//             <Route path="alerts" element={<AlertFeedPage />} />
//             <Route path="alerts/:id" element={<AlertDetailPage />} />
//             <Route path="map" element={<AlertMapPage />} />
//             <Route path="scanner" element={<QRScannerPage />} />
//             <Route path="dashboard" element={<DashboardPage />} />
//             <Route path="*" element={<NotFoundPage />} />
//           </Route>
//         </Routes>
//       </BrowserRouter>
//       <ToastContainer position="bottom-right" />
//     </>
//   );
// }

// export default App;
