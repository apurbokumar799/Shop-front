"use client";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useApp } from "@/app/providers";
import { formatBDT } from "@/lib/utils";
import { Button, EmptyState } from "./ui";

export function CartDrawer() {
  const { cartOpen, setCartOpen, cart, updateQty, removeFromCart, cartTotals } = useApp();

  if (!cartOpen) return null;

  return (
    <div className="fixed inset-0 z-[90]">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] animate-fade-in"
        onClick={() => setCartOpen(false)}
      />
      <div className="absolute inset-y-0 right-0 flex w-full max-w-md animate-slide-in flex-col bg-white shadow-pop">
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-slate-700" />
            <h2 className="text-base font-semibold">Your Cart</h2>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
              {cart.length}
            </span>
          </div>
          <button
            onClick={() => setCartOpen(false)}
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="flex-1">
            <EmptyState
              icon={<ShoppingBag className="h-6 w-6" />}
              title="Your cart is empty"
              description="Looks like you haven't added anything yet."
              action={<Button onClick={() => setCartOpen(false)}>Continue shopping</Button>}
            />
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-5">
              <ul className="space-y-4">
                {cart.map((line) => (
                  <li key={line.id} className="flex gap-4 rounded-2xl border border-slate-100 p-3">
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={line.image} alt="" className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="line-clamp-2 text-sm font-medium text-slate-900">
                          {line.name}
                        </p>
                        <button
                          onClick={() => removeFromCart(line.id)}
                          className="rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {formatBDT(line.price)} each
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center rounded-xl border border-slate-200">
                          <button
                            onClick={() => updateQty(line.id, line.qty - 1)}
                            className="grid h-8 w-8 place-items-center text-slate-600 hover:bg-slate-50"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">
                            {line.qty}
                          </span>
                          <button
                            onClick={() => updateQty(line.id, line.qty + 1)}
                            className="grid h-8 w-8 place-items-center text-slate-600 hover:bg-slate-50"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <span className="text-sm font-semibold">
                          {formatBDT(line.price * line.qty)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-slate-100 p-5">
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between text-slate-600">
                  <dt>Subtotal</dt>
                  <dd>{formatBDT(cartTotals.subtotal)}</dd>
                </div>
                <div className="flex justify-between text-emerald-600">
                  <dt>Discount</dt>
                  <dd>−{formatBDT(cartTotals.discount)}</dd>
                </div>
                <div className="flex justify-between text-slate-600">
                  <dt>Delivery</dt>
                  <dd>{cartTotals.delivery === 0 ? "Free" : formatBDT(cartTotals.delivery)}</dd>
                </div>
                <div className="flex justify-between border-t border-dashed border-slate-200 pt-3 text-base font-bold text-slate-900">
                  <dt>Total</dt>
                  <dd>{formatBDT(cartTotals.total)}</dd>
                </div>
              </dl>
              <div className="mt-4 space-y-2">
                <Link href="/checkout" onClick={() => setCartOpen(false)}>
                  <Button className="w-full" size="lg">
                    Proceed to Checkout
                  </Button>
                </Link>
                <Link href="/cart" onClick={() => setCartOpen(false)}>
                  <Button variant="outline" className="w-full">
                    View Cart
                  </Button>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}