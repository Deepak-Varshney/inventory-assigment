"use client";

import { useEffect, useState } from "react";
import { AlertCircle, PlusCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import api from "@/lib/axios";
import { toast } from "sonner";
import { AxiosError } from "axios";

export default function OrdersPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadData = async () => {
    try {
      const [productsResponse, ordersResponse] = await Promise.all([api.get("/products"), api.get("/orders")]);
      const productList = productsResponse.data?.data || [];
      setProducts(productList);
      setOrders(ordersResponse.data?.data || []);
      if (!selectedProduct && productList[0]) {
        setSelectedProduct(productList[0].id);
      }
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const msg = error.response?.data?.message || "Unable to load orders";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateOrder = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!quantity || Number(quantity) < 1) {
      toast.error("Quantity must be at least 1");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const response = await api.post("/orders", {
        items: [
          {
            productId: selectedProduct,
            quantity: Number(quantity),
          },
        ],
      });

      const msg = response.data?.message || "Order created";
      setSuccess(msg);
      toast.success(msg);
      setQuantity("1");
      await loadData();
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const msg = error.response?.data?.message || "Unable to place order";
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (orderId: string) => {
    try {
      await api.post(`/orders/${orderId}/cancel`);
      await loadData();
      toast.success("Order cancelled");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const msg = error.response?.data?.message || "Unable to cancel order";
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create order</CardTitle>
          <CardDescription>Place a new order for a product in stock.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateOrder} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-accent-foreground">Product</label>
              <select value={selectedProduct} onChange={(event) => setSelectedProduct(event.target.value)} className="flex h-10 w-full rounded-md border  px-3 py-2 text-sm outline-none">
                {products.map((product) => (
                  <option key={product.id} value={product.id} className="bg-transparent">
                    {product.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-accent-foreground">Quantity</label>
              <Input type="number" min="1" value={quantity}
                onChange={(event) => setQuantity(event.target.value)} required />
            </div>

            {error ? (
              <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                <AlertCircle size={16} />
                {error}
              </div>
            ) : null}

            {success ? <p className="text-sm text-emerald-600">{success}</p> : null}

            <Button type="submit" disabled={submitting}>
              <PlusCircle size={16} className="mr-2" />
              {submitting ? "Placing order..." : "Create order"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Order list</CardTitle>
          <CardDescription>Review your recent orders and cancel pending ones.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-slate-500">Loading orders...</p>
          ) : orders.length === 0 ? (
            <p className="text-sm text-slate-500">No orders yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>
                      <Badge variant={order.status === "PENDING" ? "default" : "outline"}>{order.status}</Badge>
                    </TableCell>
                    <TableCell>${Number(order.totalAmount).toFixed(2)}</TableCell>
                    <TableCell>{order.items?.length || 0}</TableCell>
                    <TableCell className="text-right">
                      {order.status === "PENDING" ? (
                        <Button variant="outline" size="sm" onClick={() => handleCancel(order.id)}>
                          <XCircle size={14} className="mr-2" />
                          Cancel
                        </Button>
                      ) : null}
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
