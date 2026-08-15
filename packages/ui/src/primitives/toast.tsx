'use client';

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import { cn } from '../lib/cn';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

type ToastItem = {
  id: string;
  message: string;
  type: ToastType;
};

type ToastApi = {
  toast: (message: string, type?: ToastType, duration?: number) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  warning: (message: string) => void;
  showToast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastApi | null>(null);

const DOT: Record<ToastType, string> = {
  success: 'bg-emerald-500',
  error: 'bg-red-500',
  warning: 'bg-amber-500',
  info: 'bg-[#665CFF]',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, type: ToastType = 'info', duration = 3600) => {
      const id = Math.random().toString(36).slice(2, 9);
      setToasts((prev) => [...prev, { id, message, type }]);
      if (duration > 0) {
        window.setTimeout(() => remove(id), duration);
      }
    },
    [remove]
  );

  const api: ToastApi = {
    toast,
    success: (message) => toast(message, 'success'),
    error: (message) => toast(message, 'error'),
    info: (message) => toast(message, 'info'),
    warning: (message) => toast(message, 'warning'),
    showToast: (message, type = 'success') => toast(message, type),
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[100] flex max-w-sm flex-col gap-2 select-none">
        {toasts.map((item) => (
          <div
            key={item.id}
            role="status"
            className="pointer-events-auto flex items-center justify-between gap-3 rounded-lg border border-[var(--line)] bg-[var(--surface-pure)] px-3.5 py-2.5 text-[12px] text-[var(--ink)] shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-150"
          >
            <div className="flex min-w-0 items-center gap-2">
              <span
                className={cn('h-2 w-2 shrink-0 rounded-full', DOT[item.type])}
              />
              <span className="font-medium">{item.message}</span>
            </div>
            <button
              type="button"
              aria-label="Dismiss"
              onClick={() => remove(item.id)}
              className="shrink-0 text-[12px] text-[var(--text-muted)] hover:text-[var(--ink)]"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    const noop = (message: string) => {
      if (typeof console !== 'undefined') console.log(message);
    };
    return {
      toast: noop,
      success: noop,
      error: noop,
      info: noop,
      warning: noop,
      showToast: noop,
    };
  }
  return ctx;
}
