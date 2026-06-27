"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Package,
  Boxes,
  ClipboardList,
  History,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/products", label: "Products", icon: Package },
  { href: "/stock", label: "Stock", icon: Boxes },
  { href: "/orders", label: "Orders", icon: ClipboardList },
  { href: "/history", label: "History", icon: History },
];

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const stored = localStorage.getItem("theme") as "light" | "dark" | null;

    if (stored) {
      setTheme(stored);
      document.documentElement.classList.toggle("dark", stored === "dark");
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";

    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    localStorage.setItem("theme", next);
  };

  if (pathname === "/login" || pathname === "/register") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-7xl flex-col lg:flex-row">
        <aside className="w-full border-b border-border bg-card p-4 lg:min-h-screen lg:w-64 lg:border-r lg:border-b-0">
          <div className="mb-8">
            <h1 className="mt-2 text-xl text-foreground font-semibold">
              NexaInventory
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Clean stock and order management
            </p>
          </div>

          <nav className="space-y-2">
            {links.map(({ href, label, icon: Icon }) => {
              const active =
                pathname === href || pathname.startsWith(`${href}/`);

              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 text-muted-foreground rounded-lg border border-border bg-muted p-4">
            <p className="text-sm font-semibold">Signed in</p>
            <p className="mt-1 text-sm">{user?.name || "User"}</p>
          </div>
        </aside>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mb-6 flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm dark:text-muted-foreground">
                Welcome back
              </p>
              <h2 className="text-xl font-semibold dark:text-muted-foreground">
                {user?.name || "Inventory manager"}
              </h2>
            </div>

            <div className="flex items-center gap-2 text-accent-foreground">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
              >
                {theme === "dark" ? (
                  <Sun size={16} />
                ) : (
                  <Moon size={16} />
                )}
              </Button>

              <Button variant="outline" onClick={logout} >
                <LogOut size={16} className="mr-2" />
                Logout
              </Button>
            </div>
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}