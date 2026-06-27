"use client";

import { useEffect, type ReactNode } from "react";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const hydrate = useAuthStore((state) => state.hydrate);
  const setSession = useAuthStore((state) => state.setSession);
  const logout = useAuthStore((state) => state.logout);
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!token || user) return;

    api
      .get("/auth/me")
      .then((response) => {
        if (response.data?.success) {
          setSession(response.data.data, token);
        }
      })
      .catch(() => {
        logout();
      });
  }, [token, user, setSession, logout]);

  return <>{children}</>;
}