"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Package, Heart, MapPin, ShoppingBag } from "lucide-react";
import { Card } from "@/components/ui";
import { formatBDT } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useApp } from "@/app/providers";

export default function AccountOverview() {
  const { user, wishlist } = useApp();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(4)
      .then(({ data }) => {
        setOrders(data ?? []);
        setLoading(false);
      });
  }, [user]);

  const stats = [
    { label: "Total Orders", value: orders.length, icon: Package, href: "/account/orders", color: "bg-brand-50 text-brand-600" },
    { label: "Wishlist Items", value: wishlist.length, icon: Heart, href: "/account/wishlist", color: "bg-rose-50 text-rose-600" },
    { label: "Saved Addresses", value: 0, icon: MapPin, href: "/account/addresses", color: "bg-emerald-50 text-emerald-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card className="p-5 transition-all hover:-translate-y-0.5 hover:shadow-card">
              <div className={`grid h-10 w-10 place-items-center rounded-xl ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <p className="mt-3 text-2xl font-bold">{s.value}</p>
              <p className="text-sm text-slate-500">{s.label}</p>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">Recent Orders</h2>
          <Link href="/account/orders" className="text-sm font-medium text-brand-600 hover:text-brand-700">
            View all
          </Link>
        </div>
        {loading ? (
          <p className="py-6 text-center text-sm text-slate-500">Loading…</p>
        ) : orders.length === 0 ? (
          <div className="py-10 text-center">
            <ShoppingBag className="mx-auto h-8 w-8 text-slate-300" />
            <p className="mt-3 text-sm text-slate-500">No orders yet</p>
            <Link href="/products" className="mt-2 inline-block text-sm font-medium text-brand-600">
              Start shopping →
            </Link>
          </div>
        ) : (
          <ul className="mt-4 divide-y divide-slate-100">
            {orders.map((o) => (
              <li key={o.id} className="flex items-center gap-4 py-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-500">
                  <ShoppingBag className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900">{o.order_number}</p>
                  <p className="text-xs text-slate-500">
                    {new Date(o.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{formatBDT(o.total)}</p>
                  <span className="text-xs text-slate-500">{o.status}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}