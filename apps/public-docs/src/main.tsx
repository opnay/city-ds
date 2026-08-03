import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';
import '@opnay/city-ds-react/styles.css';

import { router } from './router';
import './styles.css';

const root = document.querySelector('#root');

if (!root) throw new Error('Missing #root element');

createRoot(root).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
