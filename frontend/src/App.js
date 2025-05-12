import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import { useLocation } from 'react-router-dom';


// Layout
import MainLayout from './components/layout/MainLayout';
import Navbar from './pages/NavBar'

// Pages
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
