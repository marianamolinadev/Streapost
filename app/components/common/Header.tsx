'use client';

import { useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { useLanguage } from '@/app/hooks/useLanguage';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

export default function Header() {
  const { t, lang, changeLang } = useLanguage();
  const { setTheme } = useTheme();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (pathname?.startsWith('/writers/')) {
      const from = searchParams.get('from');
      return from === 'posts' ? href === '/posts' : href === '/writers';
    }
    if (pathname?.match(/^\/posts\/\d+$/)) {
      const from = searchParams.get('from');
      return from === 'home' ? href === '/' : href === '/posts';
    }
    return pathname === href;
  };

  const navLinks = [
    { href: '/', label: t.home },
    { href: '/posts', label: t.posts },
    { href: '/writers', label: t.writers },
  ];

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image src="/streapost-logo.svg" alt="Streapost" width={28} height={28} />
          <span className="text-xl font-bold text-brand-500 dark:text-brand-400">
            {t.appTitle}
          </span>
        </Link>

        <nav className="hidden sm:flex items-center gap-6">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm font-medium transition-colors ${
                isActive(href)
                  ? 'text-brand-500 dark:text-brand-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-slate-100'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setMenuOpen(true)}
            className="sm:hidden p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <button
            onClick={() => setTheme(document.documentElement.classList.contains('dark') ? 'light' : 'dark')}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle theme"
          >
            <Sun size={18} className="hidden dark:block" />
            <Moon size={18} className="block dark:hidden" />
          </button>

          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
            <button
              type="button"
              onClick={() => changeLang('en')}
              className={`cursor-pointer font-medium transition-colors hover:text-slate-800 dark:hover:text-slate-100 ${
                lang === 'en' ? 'text-brand-500 dark:text-brand-400' : ''
              }`}
            >
              EN
            </button>
            <span className="select-none">|</span>
            <button
              type="button"
              onClick={() => changeLang('es')}
              className={`cursor-pointer font-medium transition-colors hover:text-slate-800 dark:hover:text-slate-100 ${
                lang === 'es' ? 'text-brand-500 dark:text-brand-400' : ''
              }`}
            >
              ES
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 sm:hidden"
            onClick={closeMenu}
            aria-hidden="true"
          />
          <div
            className="fixed top-0 right-0 bottom-0 z-50 w-64 max-w-[85vw] bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 shadow-xl sm:hidden animate-slide-in-right"
            role="dialog"
            aria-label="Navigation menu"
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-800">
              <span className="font-semibold text-slate-800 dark:text-slate-100">Menu</span>
              <button
                onClick={closeMenu}
                className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>
            <nav className="flex flex-col p-4 gap-1">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={closeMenu}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive(href)
                      ? 'text-brand-500 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </>
      )}
    </header>
  );
}