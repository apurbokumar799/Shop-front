"use client";
import Link from "next/link";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useApp } from "@/app/providers";
import { formatBDT } from "@/lib/utils";
import { Button, EmptyState } from "@/components/ui";

export default function CartPage() {
  const { cart, updateQty, removeFromCart, cartTotals, clearCart } = useApp();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Shopping Cart</h1>
        <p className="mt-1 text-sm text-slate-500">
          {cart.length} {cart.length === 1 ? "item" : "items"} in your cart
        </p>
      </div>

      {cart.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white">
          <EmptyState
            icon={<ShoppingBag className="h-6 w-6" />}
            title="Your cart is empty"
            description="Browse our products and add items you love."
            action={
              <Link href="/products">
                <Button>Start shopping</Button>
              </Link>
            }
          />
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-4">
            {cart.map((line) => (
              <div
                key={line.id}
                className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-soft"
              >
                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:h-28 sm:w-28">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={line.image} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="line-clamp-2 text-sm font-semibold text-slate-900 sm:text-base">
                        {line.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">{formatBDT(line.price)} each</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(line.id)}
                      className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-auto flex items-end justify-between pt-3">
                    <div className="flex items-center rounded-xl border border-slate-200">
                      <button
                        onClick={() => updateQty(line.id, line.qty - 1)}
                        className="grid h-9 w-9 place-items-center hover:bg-slate-50"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-9 text-center text-sm font-medium tabular-nums">
                        {line.qty}
                      </span>
                      <button
                        onClick={() => updateQty(line.id, line.qty + 1)}
                        className="grid h-9 w-9 place-items-center hover:bg-slate-50"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-bold text-slate-900">
                        {formatBDT(line.price * line.qty)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between">
              <button
                onClick={clearCart}
                className="text-sm text-rose-600 hover:text-rose-700 hover:underline"
              >
                Clear cart
              </button>
              <Link
                href="/products"
                className="text-sm font-medium text-brand-600 hover:text-brand-700"
              >
                Continue shopping →
              </Link>
            </div>
          </div>

          <aside className="lg:sticky lg:top-32 lg:self-start">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
              <h2 className="text-base font-semibold">Order Summary</h2>
              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between text-slate-600">
                  <dt>Subtotal</dt>
                  <dd className="font-medium text-slate-900">{formatBDT(cartTotals.subtotal)}</dd>
                </div>
                <div className="flex justify-between text-emerald-600">
                  <dt>Discount (5%)</dt>
                  <dd className="font-medium">−{formatBDT(cartTotals.discount)}</dd>
                </div>
                <div className="flex justify-between text-slate-600">
                  <dt>Delivery</dt>
                  <dd className="font-medium text-slate-900">
                    {cartTotals.delivery === 0 ? "Free" : formatBDT(cartTotals.delivery)}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-dashed border-slate-200 pt-4 text-base">
                  <dt className="font-semibold">Grand Total</dt>
                  <dd className="font-bold">{formatBDT(cartTotals.total)}</dd>
                </div>
              </dl>
              <Link href="/checkout">
                <Button className="mt-6 w-full" size="lg">
                  Proceed to Checkout <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <p className="mt-4 text-center text-xs text-slate-500">
                Secure checkout · 30-day returns
              </p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}