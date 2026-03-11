'use client';

import { createPortal } from 'react-dom';
import { CheckCircle } from 'lucide-react';

interface SuccessToastProps {
  show: boolean;
  message: string;
}

export function SuccessToast({ show, message }: SuccessToastProps) {
  if (!show) return null;

  const toast = (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 px-4 py-2.5 text-white text-sm font-medium rounded-full shadow-lg bg-green-600 dark:bg-green-500">
      <CheckCircle size={15} className="shrink-0" />
      <span>{message}</span>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(toast, document.body) : null;
}
