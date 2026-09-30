"use client";
import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Check,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Truck,
  Zap,
} from "lucide-react";
import { products } from "@/lib/mock-data";
import { formatBDT } from "@/lib/utils";
import { useApp } from "@/app/providers";
import { Button, Card, Stars, StatusBadge } from "@/components/ui";
import { ProductCardGrid } from "@/components/ProductCardGrid";
import { cn } from "@/lib/utils";

const tabs = ["Description", "Specifications", "Reviews"] as const;

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const product = products.find((p) => p.slug === slug);

  const { addToCart, wishlist, toggleWishlist } = useApp();
  const [img, setImg] = useState(product?.images[0] ?? "");
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<(typeof tabs)[number]>("Description");

  if (!product) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <Link href="/products" className="mt-4 inline-block text-brand-600 hover:underline">
          Back to products
        </Link>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;
  const wished = wishlist.includes(product.id);
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const reviews = [
    { name: "Sadia R.", rating: 5, date: "2 days ago", text: "Excellent quality, exactly as described. Fast delivery too!" },
    { name: "Imran C.", rating: 4, date: "1 week ago", text: "Good value for money. Packaging was sturdy." },
    { name: "Nusrat J.", rating: 5, date: "2 weeks ago", text: "Absolutely love it. Will buy again from this brand." },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
      <nav className="mb-6 flex items-center gap-1 text-xs text-slate-500">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/products" className="hover:text-brand-600">Products</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="truncate text-slate-700">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img} alt={product.name} className="aspect-square w-full object-cover" />
          </div>
          <div className="mt-3 grid grid-cols-4 gap-3">
            {product.images.map((src) => (
              <button
                key={src}
                onClick={() => setImg(src)}
                className={cn(
                  "aspect-square overflow-hidden rounded-2xl border-2 transition-all",
                  img === src ? "border-brand-500 ring-2 ring-brand-500/20" : "border-transparent hover:border-slate-300"
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">{product.brand}</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{product.name}</h1>
            </div>
            <button
              onClick={() => toggleWishlist(product.id)}
              className={cn(
                "grid h-11 w-11 shrink-0 place-items-center rounded-2xl border transition-colors",
                wished
                  ? "border-rose-200 bg-rose-50 text-rose-600"
                  : "border-slate-200 text-slate-500 hover:border-rose-200 hover:text-rose-600"
              )}
            >
              <Heart className={cn("h-5 w-5", wished && "fill-current")} />
            </button>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Stars rating={product.rating} size={16} />
            <span className="text-sm text-slate-500">{product.rating} · {product.reviews} reviews</span>
            <span className="text-slate-300">|</span>
            <span className="text-sm text-emerald-600">{product.sold.toLocaleString()} sold</span>
            <StatusBadge status={product.stock === 0 ? "Out of Stock" : product.stock <= 10 ? "Low Stock" : "In Stock"} />
          </div>

          <div className="mt-6 rounded-2xl bg-slate-50 p-5">
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="text-3xl font-bold text-slate-900">{formatBDT(product.price)}</span>
              {product.originalPrice && (
                <span className="text-base text-slate-400 line-through">{formatBDT(product.originalPrice)}</span>
              )}
              {discount > 0 && (
                <span className="rounded-lg bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-700">
                  Save {discount}%
                </span>
              )}
            </div>
            <p className="mt-2 text-xs text-slate-500">Inclusive of all taxes</p>
          </div>

          <p className="mt-6 text-sm leading-relaxed text-slate-600">{product.description}</p>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center rounded-2xl border border-slate-200">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="grid h-12 w-12 place-items-center text-slate-600 hover:bg-slate-50">
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-12 text-center text-base font-semibold tabular-nums">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="grid h-12 w-12 place-items-center text-slate-600 hover:bg-slate-50">
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <span className="text-xs text-slate-500">{product.stock} available</span>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Button size="lg" variant="outline" disabled={product.stock === 0} onClick={() => addToCart(product, qty)}>
              <ShoppingBag className="h-4 w-4" /> Add to Cart
            </Button>
            <Button size="lg" variant="secondary" disabled={product.stock === 0} onClick={() => addToCart(product, qty)}>
              <Zap className="h-4 w-4" /> Buy Now
            </Button>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 p-4 sm:grid-cols-3">
            {[
              { icon: Truck, t: "Free delivery", s: "Orders ৳5,000+" },
              { icon: RotateCcw, t: "30-day returns", s: "No questions" },
              { icon: ShieldCheck, t: "Secure payment", s: "100% protected" },
            ].map((b) => (
              <div key={b.t} className="flex items-center gap-2.5">
                <b.icon className="h-4 w-4 shrink-0 text-brand-600" />
                <div>
                  <p className="text-xs font-semibold text-slate-900">{b.t}</p>
                  <p className="text-[11px] text-slate-500">{b.s}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-14">
        <div className="flex gap-1 border-b border-slate-200">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "relative px-4 py-3 text-sm font-medium transition-colors",
                tab === t ? "text-brand-600" : "text-slate-500 hover:text-slate-900"
              )}
            >
              {t}
              {tab === t && <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-brand-600" />}
            </button>
          ))}
        </div>

        <div className="py-6">
          {tab === "Description" && (
            <div className="max-w-3xl space-y-4 text-sm leading-relaxed text-slate-600">
              <p>{product.description}</p>
              <p>Every Shopfront order is quality-checked before dispatch. Items are carefully wrapped and shipped within 24 hours to ensure they arrive in pristine condition.</p>
              <ul className="space-y-2 pt-2">
                {["Premium build quality", "Manufacturer warranty included", "Tested for durability", "Ships from Dhaka warehouse"].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500" /> {f}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {tab === "Specifications" && (
            <div className="max-w-2xl overflow-hidden rounded-2xl border border-slate-200">
              <table className="w-full text-sm">
                <tbody>
                  {product.specs.map((s, i) => (
                    <tr key={s.key} className={i % 2 ? "bg-slate-50" : "bg-white"}>
                      <td className="w-40 px-4 py-3 font-medium text-slate-600">{s.key}</td>
                      <td className="px-4 py-3 text-slate-900">{s.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {tab === "Reviews" && (
            <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
              <Card className="h-fit p-5">
                <p className="text-4xl font-bold">{product.rating.toFixed(1)}</p>
                <Stars rating={product.rating} size={18} />
                <p className="mt-1 text-sm text-slate-500">{product.reviews} reviews</p>
                <div className="mt-4 space-y-2">
                  {[5, 4, 3, 2, 1].map((r) => {
                    const pct = r === 5 ? 72 : r === 4 ? 18 : r === 3 ? 6 : r === 2 ? 3 : 1;
                    return (
                      <div key={r} className="flex items-center gap-2 text-xs">
                        <span className="w-8 text-slate-500">{r}★</span>
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                          <div className="h-full rounded-full bg-amber-400" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="w-8 text-right text-slate-500">{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </Card>
              <div className="space-y-4">
                {reviews.map((r, i) => (
                  <Card key={i} className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-full bg-brand-100 font-semibold text-brand-700">
                        {r.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{r.name}</p>
                        <div className="mt-0.5 flex items-center gap-2">
                          <Stars rating={r.rating} size={12} />
                          <span className="text-xs text-slate-400">{r.date}</span>
                        </div>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-slate-600">{r.text}</p>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-6 text-2xl font-bold tracking-tight">You may also like</h2>
          <ProductCardGrid products={related} />
        </div>
      )}
    </div>
  );
}