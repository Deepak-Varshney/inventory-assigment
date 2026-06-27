"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Plus, Search } from "lucide-react";
import { AxiosError } from "axios";

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
  sku: string;
  name: string;
  price: number;
  stockQuantity: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data?.data || []);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const msg =
        error.response?.data?.message || "Unable to load products";

      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const query = search.toLowerCase();

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query)
    );
  }, [products, search]);

  const handleDelete = async (productId: string) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await api.delete(`/products/${productId}`);
      await loadProducts();
      toast.success("Product deleted");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const msg =
        error.response?.data?.message || "Unable to delete product";

      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl dark:text-muted-foreground font-semibold">Products</h3>
          <p className="text-sm text-muted-foreground">
            View, search, create, edit and remove products.
          </p>
        </div>

        <Link href="/products/new">
          <Button>
            <Plus size={16} className="mr-2" />
            Add product
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventory items</CardTitle>
          <CardDescription>
            Search across the product catalog.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />

            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by SKU or name"
              className="pl-9"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {loading ? (
            <p className="text-sm text-muted-foreground">
              Loading products...
            </p>
          ) : filteredProducts.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No products match your search.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>
                      ${product.price}
                    </TableCell>
                    <TableCell>{product.stockQuantity}</TableCell>

                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/products/${product.id}/edit`}>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </Link>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}