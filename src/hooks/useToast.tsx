import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';

export interface ToastState {
  message: string;
  onUndo?: () => void;
}

const FADE_DURATION_MS = 200;

type ToastContextValue = {
  toast: ToastState | null;
  isExiting: boolean;
  showToast: (message: string, options?: { onUndo?: () => void; duration?: number }) => void;
  clearToast: () => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const DEFAULT_DURATION = 4500;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const [duration, setDuration] = useState(DEFAULT_DURATION);
  const [isExiting, setIsExiting] = useState(false);

  const clearToast = useCallback(() => {
    setIsExiting(true);
  }, []);

  const showToast = useCallback((message: string, options?: { onUndo?: () => void; duration?: number }) => {
    setIsExiting(false);
    setToast({ message, onUndo: options?.onUndo });
    setDuration(options?.duration ?? DEFAULT_DURATION);
  }, []);

  useEffect(() => {
    if (!toast || isExiting) return;
    const id = setTimeout(clearToast, duration);
    return () => clearTimeout(id);
  }, [toast, duration, isExiting, clearToast]);

  useEffect(() => {
    if (!isExiting || !toast) return;
    const id = setTimeout(() => {
      setToast(null);
      setIsExiting(false);
    }, FADE_DURATION_MS);
    return () => clearTimeout(id);
  }, [isExiting, toast]);

  return (
    <ToastContext.Provider value={{ toast, isExiting, showToast, clearToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return ctx;
}
