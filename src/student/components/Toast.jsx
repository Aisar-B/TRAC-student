import React, { useEffect } from 'react';
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimes } from 'react-icons/fa';

const TOAST_STYLES = {
  success: {
    icon: FaCheckCircle,
    iconClass: 'text-emerald-700 bg-emerald-50',
    borderClass: 'border-l-emerald-600',
    label: 'Success'
  },
  error: {
    icon: FaExclamationTriangle,
    iconClass: 'text-red-700 bg-red-50',
    borderClass: 'border-l-red-600',
    label: 'Error'
  },
  info: {
    icon: FaInfoCircle,
    iconClass: 'text-blue-700 bg-blue-50',
    borderClass: 'border-l-blue-600',
    label: 'Notice'
  }
};

export default function Toast({ type = 'success', message, onDismiss, duration = 4000 }) {
  useEffect(() => {
    if (!message || !duration) return undefined;
    const timer = window.setTimeout(onDismiss, duration);
    return () => window.clearTimeout(timer);
  }, [message, duration, onDismiss]);

  if (!message) return null;

  const style = TOAST_STYLES[type] || TOAST_STYLES.info;
  const Icon = style.icon;

  return (
    <div className="pointer-events-none fixed inset-x-3 top-3 z-100 flex justify-center sm:inset-x-auto sm:right-5 sm:top-5 sm:justify-end">
      <div
        role={type === 'error' ? 'alert' : 'status'}
        aria-live={type === 'error' ? 'assertive' : 'polite'}
        className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg border border-gray-200 border-l-4 ${style.borderClass} bg-white p-3.5 text-gray-800 shadow-[0_8px_28px_rgba(15,23,42,0.16)] sm:w-[min(24rem,calc(100vw-2.5rem))]`}
      >
        <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${style.iconClass}`}>
          <Icon aria-hidden="true" className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1 pt-0.5">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{style.label}</p>
          <p className="mt-0.5 wrap-break-word text-sm leading-5">{message}</p>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss notification"
          title="Dismiss notification"
          className="-mr-1 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B5E20]"
        >
          <FaTimes aria-hidden="true" className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}