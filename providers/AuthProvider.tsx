'use client'

import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect } from "react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { initializeAuthListener, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
    const unsubscribe = initializeAuthListener();
    return unsubscribe;
  }, [initializeAuthListener, checkAuth]);

  return <>{children}</>
}