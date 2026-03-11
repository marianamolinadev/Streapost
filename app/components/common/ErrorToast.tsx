'use client';

import { createPortal } from 'react-dom';
import { AlertCircle } from 'lucide-react';

interface ErrorToastProps {
  show: boolean;
  message: string;
}

export function ErrorToast({ show, message }: ErrorToastProps) {
  if (!show) return null;

  const toast = (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 px-4 py-2.5 text-white text-sm font-medium rounded-full shadow-lg bg-red-600 dark:bg-red-500">
      <AlertCircle size={15} className="shrink-0" />
      <span>{message}</span>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(toast, document.body) : null;
}
