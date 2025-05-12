import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import './index.css';
import { Web3Provider } from './context/Web3Context';
import AppRoutes from './routes';

function App() {
  return (
    <Web3Provider>
      <Router>
        <ToastContainer position="top-right" autoClose={5000} />
        <AppRoutes />
      </Router>
    </Web3Provider>
  );
}

export default App;
