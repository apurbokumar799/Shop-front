"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Package } from "lucide-react";
import { formatBDT } from "@/lib/utils";
import { Badge, Card, StatusBadge } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";
import { useApp } from "@/app/providers";

export default function OrdersList() {
  const { user } = useApp();
  const [orders, setOrders] = useState<any[]>([]);
  const [items, setItems] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();

    (async () => {
      const { data: orderRows } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!orderRows || orderRows.length === 0) {
        setLoading(false);
        return;
      }
      setOrders(orderRows);

      const ids = orderRows.map((o) => o.id);
      const { data: itemRows } = await supabase
        .from("order_items")
        .select("*")
        .in("order_id", ids);

      const grouped: Record<string, any[]> = {};
      (itemRows ?? []).forEach((i) => {
        grouped[i.order_id] = grouped[i.order_id] || [];
        grouped[i.order_id].push(i);
      });
      setItems(grouped);
      setLoading(false);
    })();
  }, [user]);

  if (loading) {
    return <p className="py-10 text-center text-sm text-slate-500">Loading orders…</p>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">My Orders</h2>

      {orders.length === 0 ? (
        <Card className="p-10 text-center">
          <Package className="mx-auto h-8 w-8 text-slate-300" />
          <p className="mt-3 font-semibold">No orders yet</p>
          <p className="mt-1 text-sm text-slate-500">Your orders will appear here once you shop.</p>
          <Link href="/products" className="mt-4 inline-block rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-medium text-white">
            Start shopping
          </Link>
        </Card>
      ) : (
        orders.map((o) => (
          <Card key={o.id} className="overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/60 px-5 py-3">
              <div className="flex items-center gap-4">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-white text-slate-500 shadow-soft">
                  <Package className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{o.order_number}</p>
                  <p className="text-xs text-slate-500">
                    {new Date(o.created_at).toLocaleDateString(undefined, { dateStyle: "medium" })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={o.status} />
                <Badge tone={o.payment_status === "Paid" ? "emerald" : "slate"}>
                  {o.payment_status}
                </Badge>
              </div>
            </div>
            <div className="p-5">
              <ul className="space-y-3">
                {(items[o.id] ?? []).map((i) => (
                  <li key={i.id} className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={i.product_image} alt="" className="h-12 w-12 rounded-xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-900">{i.product_name}</p>
                      <p className="text-xs text-slate-500">
                        Qty {i.quantity} · {formatBDT(i.unit_price)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                <p className="text-sm text-slate-500">
                  Total <span className="ml-1 text-base font-bold text-slate-900">{formatBDT(o.total)}</span>
                </p>
                <Link
                  href={`/track?id=${o.id}`}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50"
                >
                  Track order
                </Link>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );
}