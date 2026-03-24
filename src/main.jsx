import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

const theme = {
  token: {
    colorPrimary: '#667eea',
    borderRadius: 8,
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
  },
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ConfigProvider theme={theme}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ConfigProvider>
    </BrowserRouter>
  </StrictMode>,
);
