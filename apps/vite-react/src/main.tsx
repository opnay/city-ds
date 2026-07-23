import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@city-ds/react/styles.css';

import { App } from './app';
import './smoke.css';

const root = document.querySelector('#root');

if (!root) {
  throw new Error('Missing #root element');
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
