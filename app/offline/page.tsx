"use client";

import Link from "next/link";
import { WifiOff } from "lucide-react";
import { useLanguage } from "@/app/hooks/useLanguage";

export default function OfflinePage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <div className="flex flex-col items-center gap-4 max-w-md text-center">
        <div className="p-4 rounded-full bg-brand-100 dark:bg-brand-900/30">
          <WifiOff size={48} className="text-brand-500 dark:text-brand-400" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          {t.offlineTitle}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          {t.offlineMessage}
        </p>
        <Link
          href="/"
          className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors font-medium"
        >
          {t.retry}
        </Link>
      </div>
    </div>
  );
}
