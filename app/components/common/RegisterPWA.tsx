"use client";

import { useEffect } from "react";

export function RegisterPWA() {
  useEffect(() => {
    if (typeof navigator !== "undefined" && "serviceWorker" in navigator && window.serwist) {
      window.serwist.register();
    }
  }, []);
  return null;
}
