import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css'; // your global styles
import { Analytics } from "@vercel/analytics/react"
import { ApiStatusProvider } from './utils/apiStatus';


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <ApiStatusProvider>
        <App />
        <Analytics />
      </ApiStatusProvider>
    </BrowserRouter>
  </React.StrictMode>
);