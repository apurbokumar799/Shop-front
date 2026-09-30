"use client";
import { useState } from "react";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import type { Product } from "@/lib/mock-data";
import { formatBDT } from "@/lib/utils";
import { useApp } from "@/app/providers";
import { Button, Stars } from "./ui";

export function QuickViewModal({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const { addToCart } = useApp();
  const [qty, setQty] = useState(1);
  if (!product) return null;
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px] animate-fade-in" onClick={onClose} />
      <div className="relative grid w-full max-w-3xl animate-scale-in grid-cols-1 overflow-hidden rounded-3xl bg-white shadow-pop md:grid-cols-2">
        <button onClick={onClose} className="absolute right-3 top-3 z-10 rounded-full bg-white/90 p-2 text-slate-600 shadow-soft hover:bg-white">
          <X className="h-4 w-4" />
        </button>
        <div className="aspect-square bg-slate-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
        </div>
        <div className="flex flex-col p-6">
          <p className="text-xs font-medium uppercase tracking-wider text-brand-600">{product.brand}</p>
          <h3 className="mt-1 text-xl font-semibold text-slate-900">{product.name}</h3>
          <div className="mt-2 flex items-center gap-2">
            <Stars rating={product.rating} />
            <span className="text-xs text-slate-500">{product.rating} · {product.reviews} reviews</span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-bold">{formatBDT(product.price)}</span>
            {product.originalPrice && <span className="text-sm text-slate-400 line-through">{formatBDT(product.originalPrice)}</span>}
            {discount > 0 && <span className="rounded-md bg-rose-50 px-1.5 py-0.5 text-xs font-semibold text-rose-600">-{discount}%</span>}
          </div>
          <p className="mt-4 line-clamp-3 text-sm text-slate-500">{product.description}</p>
          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center rounded-xl border border-slate-200">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="grid h-10 w-10 place-items-center hover:bg-slate-50"><Minus className="h-4 w-4" /></button>
              <span className="w-10 text-center font-medium">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="grid h-10 w-10 place-items-center hover:bg-slate-50"><Plus className="h-4 w-4" /></button>
            </div>
            <Button className="flex-1" size="lg" onClick={() => { addToCart(product, qty); onClose(); }}>
              <ShoppingBag className="h-4 w-4" /> Add to Cart
            </Button>
          </div>
          <Link href={`/products/${product.slug}`} onClick={onClose} className="mt-3 text-center text-sm font-medium text-brand-600 hover:text-brand-700">
            View full details →
          </Link>
        </div>
      </div>
    </div>
  );
}