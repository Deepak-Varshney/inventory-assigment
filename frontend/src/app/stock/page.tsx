"use client";

import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { AlertCircle, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import api from "@/lib/axios";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  sku: string;
  stockQuantity: number;
}

export default function StockPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [mode, setMode] = useState<"add" | "decrease">("add");
  const [quantity, setQuantity] = useState("10");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadProducts = async () => {
    try {
      const response = await api.get("/products");
      const productList = response.data?.data || [];

      setProducts(productList);

      if (!selectedProduct && productList.length) {
        setSelectedProduct(productList[0].id);
      }
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setError(error.response?.data?.message || "Unable to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        quantity:
          mode === "decrease"
            ? -Number(quantity)
            : Number(quantity),
        notes,
      };
      const url =
        mode === "add"
          ? `/stock/${selectedProduct}/add`
          : `/stock/${selectedProduct}/adjust`;

      const response = await api.post(url, payload);

      const msg = response.data?.message || "Stock updated";

      setSuccess(msg);
      toast.success(msg);

      await loadProducts();
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const msg =
        error.response?.data?.message || "Unable to update stock";

      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Current stock</CardTitle>
          <CardDescription>
            See existing quantities before making updates.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">
              Loading stock...
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell className="text-right">
                      {product.stockQuantity}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Stock adjustment</CardTitle>
          <CardDescription>
            Choose add or manual adjustment for the selected product.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Action
                </label>

                <select
                  value={mode}
                  onChange={(e) =>
                    setMode(e.target.value as "add" | "decrease")
                  }
                  className="flex h-10 w-full rounded-lg border border-input dark:text-accent-foreground px-3 py-2 text-sm"
                >
                  <option value="add">Add stock</option>
                  <option value="decrease">Decrease stock</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Product
                </label>

                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-input  px-3 py-2 text-sm dark:text-accent-foreground"
                >
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Quantity
              </label>

              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Notes
              </label>

              <Input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add a short note"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            {success && (
              <p className="text-sm text-primary">{success}</p>
            )}

            <Button type="submit" disabled={submitting}>
              <PlusCircle className="mr-2 h-4 w-4" />
              {submitting
                ? "Updating..."
                : mode === "add"
                  ? "Add stock"
                  : "Decrease stock"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}