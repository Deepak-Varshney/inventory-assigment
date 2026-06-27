"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import api from "@/lib/axios";
import { toast } from "sonner";
import { AxiosError } from "axios";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [form, setForm] = useState<any>({
    sku: "",
    name: "",
    description: "",
    price: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await api.get(`/products/${productId}`);
        const product = response.data?.data;

        setForm({
          sku: product.sku || "",
          name: product.name || "",
          description: product.description || "",
          price: product.price ? Number(product.price) : "",
        });
      } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        const msg =
          error.response?.data?.message || "Unable to load product";

        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setSaving(true);
    setError("");
    const price = Number(form.price);

    if (price <= 0) {
      setError("Price must be greater than 0");
      toast.error("Price must be greater than 0");
      setLoading(false);
      return;
    }


    try {
      await api.put(`/products/${productId}`, {
        ...form,
        price
      });

      toast.success("Product updated");
      router.push("/products");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;

      const msg =
        error.response?.data?.message || "Unable to update product";

      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <p className="text-sm text-muted-foreground">
        Loading product...
      </p>
    );
  }

  console.log("RENDER");

  return (
    <div className="space-y-6">
      <Link
        href="/products"
        className="inline-flex items-center text-sm text-muted-foreground"
      >
        <ArrowLeft size={16} className="mr-2" />
        Back to products
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Edit product</CardTitle>
          <CardDescription>
            Update the selected product details.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-accent-foreground">
                  SKU
                </label>

                <Input
                  value={form.sku}
                  onChange={(event) =>
                    setForm({ ...form, sku: event.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-accent-foreground">
                  Name
                </label>

                <Input
                  value={form.name}
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-accent-foreground">
                Description
              </label>

              <textarea
                value={form.description}
                onChange={(event) =>
                  setForm({
                    ...form,
                    description: event.target.value,
                  })
                }
                className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-accent-foreground">
                Price
              </label>

              <Input
                type="number"
                step="0.01"
                min={0.01}
                value={form.price}
                onChange={(event) =>
                  setForm({ ...form, price: event.target.value })
                }
                required
              />
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}