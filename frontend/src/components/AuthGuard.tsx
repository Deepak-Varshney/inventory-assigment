"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

const publicPaths = ["/login", "/register"];

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();

  const hydrated = useAuthStore((state) => state.hydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (!hydrated) return;

    if (!isAuthenticated && !publicPaths.includes(pathname)) {
      router.replace("/login");
      return;
    }

    if (isAuthenticated && publicPaths.includes(pathname)) {
      router.replace("/dashboard");
    }
  }, [hydrated, isAuthenticated, pathname, router]);

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">
          Loading your workspace...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}