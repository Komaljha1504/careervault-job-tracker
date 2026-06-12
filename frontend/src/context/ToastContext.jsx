import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    
    setToasts((prevToasts) => [...prevToasts, { id, message, type }]);

    // Auto-remove toast after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Wrapper */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 w-full max-w-sm px-4 sm:px-0">
        {toasts.map((toast) => {
          // Icon configuration
          let Icon = AlertCircle;
          let toastClass = 'border-slate-800 text-slate-300';
          let iconClass = 'text-brand-400';
          let progressClass = 'bg-brand-500';

          if (toast.type === 'success') {
            Icon = CheckCircle;
            toastClass = 'border-emerald-500/20 text-emerald-400 bg-slate-950/90 shadow-[0_0_20px_-3px_rgba(16,185,129,0.1)]';
            iconClass = 'text-emerald-400';
            progressClass = 'bg-emerald-500';
          } else if (toast.type === 'error') {
            Icon = XCircle;
            toastClass = 'border-rose-500/20 text-rose-400 bg-slate-950/90 shadow-[0_0_20px_-3px_rgba(244,63,94,0.1)]';
            iconClass = 'text-rose-400';
            progressClass = 'bg-rose-500';
          }

          return (
            <div
              key={toast.id}
              className={`toast-animate relative overflow-hidden flex items-start gap-3 rounded-2xl border bg-slate-950/80 p-4 backdrop-blur-md text-sm leading-relaxed ${toastClass}`}
            >
              {/* Progress indicator animation */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-900/50">
                <div 
                  className={`h-full ${progressClass} transition-all duration-[4000ms] ease-linear`}
                  style={{ width: '100%', animation: 'shrinkWidth 4s linear forwards' }}
                />
              </div>

              <Icon className={`h-5 w-5 shrink-0 mt-0.5 ${iconClass}`} />
              
              <div className="flex-1 pr-6 font-medium text-slate-200">
                {toast.message}
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className="absolute right-3 top-3 text-slate-500 hover:text-slate-200 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Embedded style for progress bar animation */}
      <style>{`
        @keyframes shrinkWidth {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
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
