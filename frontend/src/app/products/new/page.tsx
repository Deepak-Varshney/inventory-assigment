"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import api from "@/lib/axios";
import { toast } from "sonner";
import { AxiosError } from "axios";

export default function NewProductPage() {
  const router = useRouter();
  const [form, setForm] = useState<any>({ sku: "", name: "", description: "", price: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    const price = Number(form.price);

    if (price <= 0) {
      const msg = "Price must be greater than 0";
      setError(msg);
      toast.error(msg);
      setLoading(false);
      return;
    }

    try {
      await api.post("/products", { ...form, price });
      router.push("/products");
      toast.success("Product created");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;

      const msg =
        error.response?.data?.message || "Unable to create product";

      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Link href="/products" className="inline-flex items-center text-sm text-slate-500">
        <ArrowLeft size={16} className="mr-2" />
        Back to products
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Create product</CardTitle>
          <CardDescription>Add a new item to the catalog.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-accent-foreground">SKU</label>
                <Input value={form.sku} onChange={(event) => setForm({ ...form, sku: event.target.value })} required />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-accent-foreground">Name</label>
                <Input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-accent-foreground">Description</label>
              <textarea
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
                className="min-h-24 w-full rounded-md border  px-3 py-2 text-sm outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-accent-foreground">Price</label>
              <Input
                type="number"
                min="0.01"
                step="0.01"
                value={form.price}
                onChange={(event) =>
                  setForm({ ...form, price: event.target.value })
                }
                required
              />
            </div>

            {error ? <p className="text-sm text-rose-600">{error}</p> : null}

            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create product"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
