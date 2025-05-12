// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
<<<<<<< HEAD
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom'; // 🧠 import BrowserRouter
=======
>>>>>>> f89a8e7447686554cf7682c6bde524b5ab1c06e3

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter> {/* ✅ wrap App in BrowserRouter */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
<<<<<<< HEAD

reportWebVitals();
=======
>>>>>>> f89a8e7447686554cf7682c6bde524b5ab1c06e3
