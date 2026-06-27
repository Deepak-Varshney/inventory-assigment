"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";

export default function HistoryPage() {
  const user = useAuthStore((state) => state.user);
  const [products, setProducts] = useState<any[]>([]);
  const [movements, setMovements] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const productsResponse = await api.get("/products");
      setProducts(productsResponse.data?.data || []);

      if (selectedProduct !== "all") {
        const historyResponse = await api.get(
          `/stock/${selectedProduct}/history`
        );
        setMovements(historyResponse.data?.data?.movements || []);
      } else {
        const historyResponse = await api.get("/stock/history");
        setMovements(historyResponse.data?.data || []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    loadData();
  }, [selectedProduct]);

  const filteredMovements = useMemo(() => {
    const query = search.toLowerCase();
    return movements.filter((movement) => {
      const productName = movement.product?.name || "";
      const notes = movement.notes || "";
      return productName.toLowerCase().includes(query) || notes.toLowerCase().includes(query) || movement.movementType.toLowerCase().includes(query);
    });
  }, [movements, search]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Stock history</CardTitle>
          <CardDescription>Review movement history and apply a quick filter.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <label className="mb-1.5 block text-sm font-medium text-accent-foreground">Product</label>
              <select value={selectedProduct} onChange={(event) => setSelectedProduct(event.target.value)} className="flex h-10 w-full rounded-md border border-slate-200  px-3 py-2 text-sm outline-none">
                <option value="all" className="bg-transparent">All products</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="mb-1.5 block text-sm font-medium text-accent-foreground">Search</label>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search history" className="pl-9" />
              </div>
            </div>
          </div>

          {loading ? (
            <p className="text-sm text-accent-foreground">Loading history...</p>
          ) : filteredMovements.length === 0 ? (
            <p className="text-sm text-accent-foreground">No records found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Change</TableHead>
                  <TableHead>Before</TableHead>
                  <TableHead>After</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMovements.map((movement) => (
                  <TableRow key={movement.id}>
                    <TableCell>{movement.product?.name || "Product"}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{movement.movementType}</Badge>
                    </TableCell>
                    <TableCell>{movement.quantityChange}</TableCell>
                    <TableCell>{movement.beforeQuantity}</TableCell>
                    <TableCell>{movement.afterQuantity}</TableCell>
                    <TableCell>{movement.notes || "—"}</TableCell>
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
