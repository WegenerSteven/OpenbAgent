import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Safety shim for environments where window.fetch is a read-only getter
// but some libraries might attempt to overwrite it (e.g. polyfills)
if (typeof window !== 'undefined') {
  try {
    const originalFetch = window.fetch;
    if (originalFetch) {
      Object.defineProperty(window, 'fetch', {
        get: () => originalFetch,
        set: () => {
          console.warn('Budget Watchdog: A library attempt to overwrite window.fetch was blocked to prevent crash.');
        },
        configurable: true,
        enumerable: true
      });
    }
  } catch (e) {
    // If it's already non-configurable, we can't do anything, 
    // but at least we tried to prevent the TypeError.
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
