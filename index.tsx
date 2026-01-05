import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './src/i18n';

// Force dark-only theme and clear any legacy theme preference.
document.documentElement.classList.add('dark');
document.documentElement.classList.remove('light');
try {
  localStorage.removeItem('theme');
} catch {
  // Ignore storage access issues.
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
