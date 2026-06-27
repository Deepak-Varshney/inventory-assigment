"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Boxes, Package, ShoppingCart, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/axios";
import { AxiosError } from "axios";

interface Product {
  id: string;
  name: string;
  sku: string;
  stockQuantity: number;
}

interface Movement {
  id: string;
  movementType: string;
  quantityChange: number;
  notes: string | null;
  product?: {
    name: string;
  };
}

interface DashboardStats {
  totalProducts: number;
  pendingOrders: number;
}

interface DashboardData {
  stats: DashboardStats;
  recentMovements: Movement[];
  lowStockProducts: Product[];
}

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [productsResponse, dashboardResponse] = await Promise.all([
          api.get("/products"),
          api.get("/dashboard"),
        ]);

        setProducts(productsResponse.data?.data || []);
        setDashboard(dashboardResponse.data?.data || null);
      } catch (err) {
        const error = err as AxiosError<{ message: string }>;

        setError(
          error.response?.data?.message || "Unable to load dashboard data"
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading dashboard...</p>;
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
        <div className="flex items-center gap-2">
          <AlertCircle size={16} />
          {error}
        </div>
      </div>
    );
  }

  const totalStock = products.reduce(
    (sum, product) => sum + product.stockQuantity,
    0
  );

  const stats = dashboard?.stats;
  const recentMovements = dashboard?.recentMovements ?? [];
  const lowStockProducts = dashboard?.lowStockProducts ?? [];

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <p className="text-sm text-muted-foreground">Overview</p>
        <h3 className="mt-1 text-2xl text-accent-foreground font-semibold">
          Inventory Dashboard
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          A simple view of inventory health and recent activity.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total products
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {stats?.totalProducts ?? 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total stock
            </CardTitle>
            <Boxes className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{totalStock}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Pending orders
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {stats?.pendingOrders ?? 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Low stock items
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {lowStockProducts.length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Recent stock movements</CardTitle>
            <CardDescription>
              The latest stock updates from the system.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3">
            {recentMovements.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No movements yet.
              </p>
            ) : (
              recentMovements.map((movement) => (
                <div
                  key={movement.id}
                  className="flex items-center justify-between rounded-lg border bg-card p-3"
                >
                  <div>
                    <p className="font-medium">
                      {movement.product?.name || "Product"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {movement.notes || movement.movementType}
                    </p>
                  </div>

                  <Badge
                    variant={
                      movement.quantityChange > 0 ? "default" : "ghost"
                    }
                  >
                    {movement.quantityChange > 0 ? "+" : ""}
                    {movement.quantityChange}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Low stock products</CardTitle>
            <CardDescription>
              Products that need attention soon.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3">
            {lowStockProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Everything looks stocked well.
              </p>
            ) : (
              lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between rounded-lg border bg-card p-3"
                >
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {product.sku}
                    </p>
                  </div>

                  <Badge variant="outline">
                    {product.stockQuantity} left
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}