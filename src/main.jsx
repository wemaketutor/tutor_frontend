import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import axios from 'axios';

// Устанавливаем базовый URL для глобального экземпляра axios
axios.defaults.baseURL = import.meta.env.VITE_API_BACKEND_URL || 'http://localhost:8081/api';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);