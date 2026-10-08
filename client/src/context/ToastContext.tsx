import React, { createContext, useContext, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { toast as sonnerToast, Toaster } from 'sonner';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  actionText?: string;
  onAction?: () => void;
  duration?: number;
}

interface ToastContextType {
  showToast: (toast: Omit<ToastItem, 'id'>) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dismissToast = useCallback((id: string) => {
    sonnerToast.dismiss(id);
  }, []);

  const showToast = useCallback((toast: Omit<ToastItem, 'id'>) => {
    const icon =
      toast.type === 'success' ? (
        <CheckCircle2 className="w-4 h-4 text-ok shrink-0" />
      ) : toast.type === 'error' ? (
        <AlertCircle className="w-4 h-4 text-bad shrink-0" />
      ) : (
        <Info className="w-4 h-4 text-info shrink-0" />
      );

    sonnerToast(toast.message, {
      duration: toast.duration || 4000,
      icon,
      action:
        toast.actionText && toast.onAction
          ? {
              label: toast.actionText,
              onClick: () => {
                toast.onAction?.();
              },
            }
          : undefined,
    });
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          className:
            'bg-surface text-ink border border-line rounded-lg shadow-pop text-sm font-medium',
        }}
      />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
