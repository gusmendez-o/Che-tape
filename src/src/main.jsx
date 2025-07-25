import React from 'react';
import ReactDOM from 'react-dom/client';
import CheTapeApp from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CheTapeApp />
  </React.StrictMode>
);

// Registrar Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/che-tape/service-worker.js')
    .catch(console.error);
}
