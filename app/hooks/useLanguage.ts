'use client';

import { useSyncExternalStore } from 'react';
import { messages } from '@/lib/messages';

function getInitialLang(): string {
  if (typeof window === 'undefined') return 'en';
  return localStorage.getItem('language') || 
         navigator.language.split('-')[0] || 
         'en';
}

let currentLang = getInitialLang();
let listeners: Array<() => void> = [];

function subscribe(listener: () => void) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter(l => l !== listener);
  };
}

function getSnapshot() {
  return currentLang;
}

function getServerSnapshot() {
  return 'en';
}

function changeLang(newLang: string) {
  currentLang = newLang;
  if (typeof window !== 'undefined') {
    localStorage.setItem('language', newLang);
  }
  listeners.forEach(listener => listener());
}

export function useLanguage() {
  const lang = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
  
  const t = messages[lang as keyof typeof messages] || messages.en;
  
  return { lang, changeLang, t };
}