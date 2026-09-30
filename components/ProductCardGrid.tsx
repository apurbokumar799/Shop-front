"use client";
import { useState } from "react";
import type { Product } from "@/lib/mock-data";
import { ProductCard } from "./ProductCard";
import { QuickViewModal } from "./QuickViewModal";
import { cn } from "@/lib/utils";

export function ProductCardGrid({
  products, cols = 4, className,
}: { products: Product[]; cols?: 2 | 3 | 4; className?: string }) {
  const [quick, setQuick] = useState<Product | null>(null);
  const gridCls = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  }[cols];

  return (
    <>
      <div className={cn("grid gap-4 sm:gap-5", gridCls, className)}>
        {products.map((p) => (
          <ProductCard key={p.id} product={p} onQuickView={setQuick} />
        ))}
      </div>
      <QuickViewModal product={quick} onClose={() => setQuick(null)} />
    </>
  );
}