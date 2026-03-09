'use client';

import { useSyncExternalStore } from 'react';

function getInitialTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  
  const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
  if (saved) return saved;
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

let currentTheme = getInitialTheme();
let listeners: Array<() => void> = [];

function subscribe(listener: () => void) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter(l => l !== listener);
  };
}

function getSnapshot() {
  return currentTheme;
}

function getServerSnapshot() {
  return 'light';
}

function toggleTheme() {
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  currentTheme = newTheme;
  
  if (typeof window !== 'undefined') {
    localStorage.setItem('theme', newTheme);
  }
  
  listeners.forEach(listener => listener());
}

export function useTheme() {
  const theme = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
  
  return { theme, toggleTheme };
}