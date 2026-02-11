import { useEffect, useState } from 'react';
import { useToast } from '../hooks/useToast';

export function Toast() {
  const { toast, isExiting, clearToast } = useToast();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!toast) return;
    setIsVisible(false);
    const id = requestAnimationFrame(() => {
      setIsVisible(true);
    });
    return () => cancelAnimationFrame(id);
  }, [toast]);

  if (!toast) return null;

  const handleUndo = () => {
    toast.onUndo?.();
    clearToast();
  };

  const opacity = isExiting || !isVisible ? 'opacity-0' : 'opacity-100';

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-4 left-4 right-4 z-50 flex items-center justify-between gap-3 rounded-xl border-2 border-orange-500/60 bg-slate-700/98 px-4 py-3 text-white shadow-xl shadow-orange-950/30 ring-2 ring-orange-400/20 transition-opacity duration-200 md:left-1/2 md:right-auto md:max-w-md md:-translate-x-1/2 ${opacity}`}
    >
      <span className="text-sm font-medium">{toast.message}</span>
      {toast.onUndo && (
        <button
          type="button"
          onClick={handleUndo}
          className="shrink-0 font-bold text-orange-300 transition-colors hover:text-orange-200 uppercase text-xs"
        >
          Undo
        </button>
      )}
    </div>
  );
}
