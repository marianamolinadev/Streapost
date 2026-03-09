'use client';

import { useState, useCallback } from 'react';
import { useLanguage } from '@/app/hooks/useLanguage';

interface DeleteModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteModal({ onConfirm, onCancel }: DeleteModalProps) {
  const { t } = useLanguage();
  const [isClosing, setIsClosing] = useState(false);
  const [pendingAction, setPendingAction] = useState<'confirm' | 'cancel' | null>(null);

  const handleClose = useCallback((action: 'confirm' | 'cancel') => {
    if (isClosing) return;
    setIsClosing(true);
    setPendingAction(action);
  }, [isClosing]);

  const handleAnimationEnd = useCallback(() => {
    if (pendingAction === 'confirm') onConfirm();
    else if (pendingAction === 'cancel') onCancel();
    setPendingAction(null);
  }, [pendingAction, onConfirm, onCancel]);

  const handleBackdropClick = () => handleClose('cancel');

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 ${
        isClosing ? 'animate-modal-backdrop-out' : 'animate-modal-backdrop-in'
      }`}
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={handleBackdropClick}
    >
      <div
        className={`bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl ${
          isClosing ? 'animate-modal-dialog-out' : 'animate-modal-dialog-in'
        }`}
        onClick={(e) => e.stopPropagation()}
        onAnimationEnd={isClosing ? handleAnimationEnd : undefined}
      >
        <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100">
          {t.confirmDelete}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {t.confirmDeleteMessage}
        </p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={() => handleClose('cancel')}
            disabled={isClosing}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-slate-700 dark:text-slate-300 disabled:opacity-70 cursor-pointer"
          >
            {t.cancel}
          </button>
          <button
            onClick={() => handleClose('confirm')}
            disabled={isClosing}
            className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors disabled:opacity-70 cursor-pointer"
          >
            {t.delete}
          </button>
        </div>
      </div>
    </div>
  );
}