"use client";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useApp } from "@/app/providers";
import { products } from "@/lib/mock-data";
import { ProductCardGrid } from "@/components/ProductCardGrid";
import { Button, EmptyState } from "@/components/ui";

export default function WishlistPage() {
  const { wishlist } = useApp();
  const list = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Wishlist</h2>
      {list.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white">
          <EmptyState
            icon={<Heart className="h-6 w-6" />}
            title="Your wishlist is empty"
            description="Save products you love for later."
            action={
              <Link href="/products">
                <Button>Discover products</Button>
              </Link>
            }
          />
        </div>
      ) : (
        <ProductCardGrid products={list} cols={3} />
      )}
    </div>
  );
}