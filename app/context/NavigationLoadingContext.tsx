'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import { usePathname } from 'next/navigation';
import LoadingOverlay from '@/app/components/common/LoadingOverlay';

type NavigationLoadingContextValue = {
  setNavigating: (value: boolean) => void;
};

const NavigationLoadingContext = createContext<NavigationLoadingContextValue | null>(null);

export function useNavigationLoading() {
  const ctx = useContext(NavigationLoadingContext);
  if (!ctx) return { setNavigating: () => {} };
  return ctx;
}

export function NavigationLoadingProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);

  const setNavigating = useCallback((value: boolean) => {
    setIsNavigating(value);
  }, []);

  useEffect(() => {
    setIsNavigating(false);
  }, [pathname]);

  return (
    <NavigationLoadingContext.Provider value={{ setNavigating }}>
      {children}
      {isNavigating && <LoadingOverlay />}
    </NavigationLoadingContext.Provider>
  );
}
