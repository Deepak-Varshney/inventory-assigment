"use client";

import type { FormEvent } from "react"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import api from "@/lib/axios";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import { AxiosError } from "axios";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const setSession = useAuthStore((state) => state.setSession);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/register", { name, email, password });
      if (response.data?.success) {
        setSession(response.data.data.user, response.data.data.token);
        toast.success("Account created");
        router.push("/dashboard");
        return;
      }

      const msg = response.data?.message || "Registration failed";
      setError(msg);
      toast.error(msg);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;

      const msg =
        error.response?.data?.message || "Unable to create account";

      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create account</CardTitle>
          <CardDescription>Register a new user and start working with the inventory system.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-accent-foreground">Name</label>
              <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" required />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-accent-foreground">Email</label>
              <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-accent-foreground">Password</label>
              <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Create password" required />
            </div>

            {error ? <p className="text-sm text-rose-600">{error}</p> : null}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Register"}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-slate-500">
            Already have an account? <Link href="/login" className="font-medium text-slate-900">Login</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
