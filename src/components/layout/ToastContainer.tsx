import React from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { CheckCircle2, AlertTriangle, AlertOctagon, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useDashboard();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-2xl glass-panel border backdrop-blur-xl shadow-2xl flex items-start gap-3 animate-fadeIn ${
              isError
                ? 'border-red-500/50 bg-red-950/80 text-red-100 shadow-red-500/20'
                : isWarning
                ? 'border-amber-500/50 bg-amber-950/80 text-amber-100 shadow-amber-500/20'
                : isSuccess
                ? 'border-emerald-500/50 bg-emerald-950/80 text-emerald-100 shadow-emerald-500/20'
                : 'border-cyan-500/40 bg-slate-900/90 text-cyan-100 shadow-cyan-500/10'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {isError && <AlertOctagon className="w-5 h-5 text-red-400" />}
              {isWarning && <AlertTriangle className="w-5 h-5 text-amber-400" />}
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {!isError && !isWarning && !isSuccess && <Info className="w-5 h-5 text-cyan-400" />}
            </div>

            <div className="flex-1">
              <div className="text-xs font-bold font-mono text-white">{toast.title}</div>
              <div className="text-[11px] opacity-90 mt-0.5 leading-relaxed">{toast.message}</div>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 p-1 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
