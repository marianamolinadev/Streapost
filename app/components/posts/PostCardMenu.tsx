'use client';

import { useState } from 'react';
import { MoreVertical } from 'lucide-react';
import { useLanguage } from '@/app/hooks/useLanguage';

interface PostCardMenuProps {
  onDeleteClick: () => void;
}

export default function PostCardMenu({ onDeleteClick }: PostCardMenuProps) {
  const { t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setMenuOpen(prev => !prev)}
        className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer"
        aria-label="Post options"
      >
        <MoreVertical size={16} />
      </button>

      {menuOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
          <div className="absolute right-0 top-6 z-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg min-w-[120px] animate-dropdown-in">
            <button
              onClick={() => { onDeleteClick(); setMenuOpen(false); }}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer"
            >
              {t.delete}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
