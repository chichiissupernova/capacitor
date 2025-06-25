
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Preload critical resources
const preloadFont = (href: string) => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = 'font';
  link.type = 'font/woff2';
  link.crossOrigin = 'anonymous';
  document.head.appendChild(link);
};

// Preload critical fonts
preloadFont('https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJfecg.woff2');

// Add meta viewport tag for better mobile rendering
const meta = document.createElement('meta');
meta.name = 'viewport';
meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
document.getElementsByTagName('head')[0].appendChild(meta);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
