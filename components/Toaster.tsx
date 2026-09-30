"use client";
import { useApp } from "@/app/providers";
import { CheckCircle2, Info, X, XCircle } from "lucide-react";

export function Toaster() {
  const { toasts, dismissToast } = useApp();
  const icons = {
    success: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
    error: <XCircle className="h-5 w-5 text-rose-500" />,
    info: <Info className="h-5 w-5 text-brand-500" />,
    default: <Info className="h-5 w-5 text-slate-400" />,
  };
  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-end gap-2 px-4 sm:top-6 sm:right-6 sm:left-auto sm:px-0">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto w-full max-w-sm animate-slide-up rounded-2xl border border-slate-200 bg-white/95 p-3.5 shadow-pop backdrop-blur"
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5 shrink-0">{icons[t.variant ?? "default"]}</div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-900">{t.title}</p>
              {t.description && <p className="mt-0.5 truncate text-xs text-slate-500">{t.description}</p>}
              {t.action && (
                <button
                  onClick={() => { t.action!.onClick(); dismissToast(t.id); }}
                  className="mt-2 text-xs font-semibold text-brand-600 hover:text-brand-700"
                >
                  {t.action.label}
                </button>
              )}
            </div>
            <button
              onClick={() => dismissToast(t.id)}
              className="shrink-0 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}