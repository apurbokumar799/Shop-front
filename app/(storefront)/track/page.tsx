"use client";
import { useEffect, useState } from "react";
import { Check, Circle, Package, Search, Truck } from "lucide-react";
import { Button, Card, Input } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";
import { cn, formatBDT } from "@/lib/utils";

const stages = ["Order Placed", "Confirmed", "Processing", "Out for Delivery", "Delivered"];

export default function TrackPage() {
  const [query, setQuery] = useState("");
  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const search = async (id: string) => {
    setLoading(true);
    setNotFound(false);
    const supabase = createClient();

    // Try by id first, then order_number
    let { data: o } = await supabase.from("orders").select("*").eq("id", id).maybeSingle();
    if (!o) {
      const res = await supabase.from("orders").select("*").eq("order_number", id).maybeSingle();
      o = res.data;
    }
    if (!o) {
      setLoading(false);
      setNotFound(true);
      setOrder(null);
      return;
    }

    const [{ data: itemRows }, { data: eventRows }] = await Promise.all([
      supabase.from("order_items").select("*").eq("order_id", o.id),
      supabase.from("order_events").select("*").eq("order_id", o.id).order("created_at", { ascending: true }),
    ]);

    setOrder(o);
    setItems(itemRows ?? []);
    setEvents(eventRows ?? []);
    setLoading(false);

    // Real-time updates
    supabase
      .channel(`order-${o.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "order_events",
          filter: `order_id=eq.${o.id}`,
        },
        (payload) => {
          setEvents((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();
  };

  // Auto-search if ?id= present
  useEffect(() => {
    const url = new URL(window.location.href);
    const id = url.searchParams.get("id");
    if (id) {
      setQuery(id);
      search(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentIdx = order
    ? stages.indexOf(
        events[events.length - 1]?.status ?? order.status
      )
    : -1;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600">
          <Truck className="h-6 w-6" />
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight">Track your order</h1>
        <p className="mt-2 text-sm text-slate-500">
          Enter your order ID or order number to see live tracking updates.
        </p>
      </div>

      <div className="mt-8 flex gap-3">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Order ID or ORD-XXXXXX"
          className="h-12"
        />
        <Button size="lg" onClick={() => search(query)} disabled={loading || !query}>
          <Search className="h-4 w-4" /> Track
        </Button>
      </div>

      {notFound && (
        <Card className="mt-8 p-10 text-center">
          <Package className="mx-auto h-8 w-8 text-slate-300" />
          <p className="mt-3 font-semibold">No order found</p>
          <p className="mt-1 text-sm text-slate-500">Double-check your order number.</p>
        </Card>
      )}

      {order && (
        <Card className="mt-8 overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/60 px-6 py-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">Order</p>
              <p className="text-lg font-bold">{order.order_number}</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wider text-slate-500">Total</p>
              <p className="text-lg font-bold">{formatBDT(order.total)}</p>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <ol className="relative space-y-8 pl-10">
              <span className="absolute left-[13px] top-2 bottom-2 w-0.5 bg-slate-200" />
              <span
                className="absolute left-[13px] top-2 w-0.5 bg-emerald-500"
                style={{
                  height: `${(Math.max(0, currentIdx) / (stages.length - 1)) * 100}%`,
                }}
              />
              {stages.map((s, i) => {
                const done = i <= currentIdx;
                const current = i === currentIdx;
                const ev = events.find((e) => e.status === s);
                return (
                  <li key={s} className="relative">
                    <span
                      className={cn(
                        "absolute -left-10 grid h-7 w-7 place-items-center rounded-full ring-4 ring-white",
                        done ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-400",
                        current && "animate-pulse ring-emerald-100"
                      )}
                    >
                      {done ? <Check className="h-3.5 w-3.5" /> : <Circle className="h-2 w-2" />}
                    </span>
                    <div>
                      <p className={cn("text-sm font-semibold", done ? "text-slate-900" : "text-slate-400")}>
                        {s}
                      </p>
                      {ev && (
                        <p className="text-xs text-slate-500">
                          {new Date(ev.created_at).toLocaleString(undefined, {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>

            <div className="mt-8 grid gap-4 border-t border-slate-100 pt-6 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Shipping to</p>
                <p className="mt-1.5 text-sm font-medium text-slate-900">{order.customer_name}</p>
                <p className="text-sm text-slate-600">
                  {order.shipping_address?.line1}, {order.shipping_address?.city}
                </p>
                <p className="text-sm text-slate-500">{order.customer_phone}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Payment</p>
                <p className="mt-1.5 text-sm font-medium text-slate-900">{order.payment_method}</p>
                <p className="text-sm text-slate-600">{order.payment_status}</p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Items</p>
                <ul className="mt-1.5 space-y-1 text-sm text-slate-600">
                  {items.map((i) => (
                    <li key={i.id}>
                      {i.product_name} × {i.quantity}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}