import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { SkillStoreProvider } from './hooks/useSkillStore';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SkillStoreProvider>
      <App />
    </SkillStoreProvider>
  </StrictMode>,
);
