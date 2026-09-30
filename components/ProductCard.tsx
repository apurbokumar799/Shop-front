"use client";
import Link from "next/link";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import type { Product } from "@/lib/mock-data";
import { formatBDT, cn } from "@/lib/utils";
import { useApp } from "@/app/providers";
import { Badge, Stars } from "./ui";

export function ProductCard({ product, onQuickView }: { product: Product; onQuickView?: (p: Product) => void }) {
  const { addToCart, wishlist, toggleWishlist } = useApp();
  const wished = wishlist.includes(product.id);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;
  const out = product.stock === 0;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
      <Link href={`/products/${product.slug}`} className="relative block aspect-square overflow-hidden bg-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {discount > 0 && <Badge tone="rose">-{discount}%</Badge>}
          {product.badge && (
            <Badge tone={product.badge === "New" ? "brand" : product.badge === "Best Seller" ? "amber" : "violet"}>
              {product.badge}
            </Badge>
          )}
        </div>
        {out && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[2px]">
            <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">Out of Stock</span>
          </div>
        )}
      </Link>

      <button
        onClick={() => toggleWishlist(product.id)}
        aria-label="Wishlist"
        className={cn(
          "absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-soft backdrop-blur transition-all",
          wished ? "text-rose-500" : "text-slate-500 hover:text-rose-500"
        )}
      >
        <Heart className={cn("h-4 w-4", wished && "fill-current")} />
      </button>

      {!out && onQuickView && (
        <button
          onClick={() => onQuickView(product)}
          className="absolute right-3 top-14 flex h-9 w-9 translate-x-2 items-center justify-center rounded-full bg-white/95 text-slate-500 opacity-0 shadow-soft backdrop-blur transition-all duration-300 hover:text-brand-600 group-hover:translate-x-0 group-hover:opacity-100"
          aria-label="Quick view"
        >
          <Eye className="h-4 w-4" />
        </button>
      )}

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] font-medium uppercase tracking-wider text-brand-600">{product.brand}</p>
        <Link href={`/products/${product.slug}`} className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-slate-900 hover:text-brand-600">
          {product.name}
        </Link>
        <div className="mt-2 flex items-center gap-2">
          <Stars rating={product.rating} />
          <span className="text-xs text-slate-400">({product.reviews})</span>
        </div>
        <div className="mt-auto pt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-slate-900">{formatBDT(product.price)}</span>
            {product.originalPrice && (
              <span className="text-xs text-slate-400 line-through">{formatBDT(product.originalPrice)}</span>
            )}
          </div>
          <div className="mt-1 flex items-center justify-between">
            <span className={cn(
              "text-[11px] font-medium",
              product.stock === 0 ? "text-rose-600" : product.stock <= 10 ? "text-amber-600" : "text-emerald-600"
            )}>
              {product.stock === 0 ? "Out of stock" : product.stock <= 10 ? `Only ${product.stock} left` : "In stock"}
            </span>
            <span className="text-[11px] text-slate-400">{product.sold.toLocaleString()} sold</span>
          </div>
          <button
            disabled={out}
            onClick={() => addToCart(product)}
            className={cn(
              "mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-xl text-sm font-medium transition-all",
              out
                ? "cursor-not-allowed bg-slate-100 text-slate-400"
                : "bg-slate-900 text-white hover:bg-brand-600 active:scale-[.98]"
            )}
          >
            <ShoppingBag className="h-4 w-4" />
            {out ? "Unavailable" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}