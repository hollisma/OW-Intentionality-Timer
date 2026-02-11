import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { SkillStoreProvider } from './hooks/useSkillStore';
import { ToastProvider } from './hooks/useToast';
import { Toast } from './components/Toast';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SkillStoreProvider>
      <ToastProvider>
        <App />
        <Toast />
      </ToastProvider>
    </SkillStoreProvider>
  </StrictMode>,
);
