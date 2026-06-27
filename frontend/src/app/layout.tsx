import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import AuthGuard from "@/components/AuthGuard";
import AppShell from "@/components/AppShell";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Inventory Dashboard",
  description: "A simple inventory management frontend",
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-background text-accent-foreground">
        <AuthProvider>
          <AuthGuard>
            <AppShell>{children}</AppShell>
            <Toaster />
          </AuthGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
