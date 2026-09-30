"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronRight, CreditCard, Lock, Truck } from "lucide-react";
import { useApp } from "@/app/providers";
import { formatBDT } from "@/lib/utils";
import { Button, Card, Input } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const steps = ["Information", "Shipping", "Payment"];

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotals, clearCart, toast, authUser } = useApp();
  const [step, setStep] = useState(0);
  const [payment, setPayment] = useState<"cod" | "online">("cod");
  const [placing, setPlacing] = useState(false);

  const [info, setInfo] = useState({ email: "", phone: "", name: "" });
  const [addr, setAddr] = useState({
    line1: "",
    city: "",
    area: "",
    postal: "",
  });

  const canNext =
    step === 0
      ? info.email && info.phone && info.name
      : step === 1
      ? addr.line1 && addr.city
      : true;

  const placeOrder = async () => {
    if (!authUser) {
      toast({ title: "Please login to place order", variant: "error" });
      router.push("/login?next=/checkout");
      return;
    }
    if (cart.length === 0) {
      toast({ title: "Cart is empty", variant: "error" });
      return;
    }

    setPlacing(true);
    const supabase = createClient();
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;

    // 1. Insert order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        user_id: authUser.id,
        customer_name: info.name,
        customer_phone: info.phone,
        customer_email: info.email,
        shipping_address: {
          line1: addr.line1,
          city: addr.city,
          area: addr.area,
          postal: addr.postal,
        },
        subtotal: cartTotals.subtotal,
        discount: cartTotals.discount,
        delivery_fee: cartTotals.delivery,
        total: cartTotals.total,
        payment_method: payment === "cod" ? "Cash on Delivery" : "Online Payment",
        payment_status: payment === "cod" ? "Unpaid" : "Pending",
        status: "Pending",
      })
      .select()
      .single();

    if (orderError || !order) {
      setPlacing(false);
      toast({
        title: "Order failed",
        description: orderError?.message ?? "Unknown error",
        variant: "error",
      });
      return;
    }

    // 2. Insert order items
    const items = cart.map((line) => ({
      order_id: order.id,
      product_name: line.name,
      product_image: line.image,
      unit_price: line.price,
      quantity: line.qty,
    }));

    const { error: itemsError } = await supabase.from("order_items").insert(items);

    if (itemsError) {
      setPlacing(false);
      toast({
        title: "Items failed",
        description: itemsError.message,
        variant: "error",
      });
      return;
    }

    // 3. Initial order event
    await supabase.from("order_events").insert({
      order_id: order.id,
      status: "Order Placed",
    });

    clearCart();
    setPlacing(false);
    toast({
      title: "Order placed!",
      description: `Order ${orderNumber}`,
      variant: "success",
    });
    router.push(`/track?id=${order.id}`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
      <nav className="mb-6 flex items-center gap-1 text-xs text-slate-500">
        <Link href="/cart" className="hover:text-brand-600">
          Cart
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-slate-700">Checkout</span>
      </nav>

      <div className="mb-8 flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                i < step
                  ? "bg-emerald-500 text-white"
                  : i === step
                  ? "bg-slate-900 text-white"
                  : "bg-slate-200 text-slate-500"
              )}
            >
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span
              className={cn(
                "text-sm font-medium",
                i === step ? "text-slate-900" : "text-slate-500"
              )}
            >
              {s}
            </span>
            {i < steps.length - 1 && <ChevronRight className="h-4 w-4 text-slate-300" />}
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="space-y-6">
          {step === 0 && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold">Customer Information</h2>
              <p className="mt-1 text-sm text-slate-500">
                We&apos;ll use this to send your order updates.
              </p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-medium text-slate-600">Full name</label>
                  <Input
                    value={info.name}
                    onChange={(e) => setInfo({ ...info, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-600">Email</label>
                  <Input
                    type="email"
                    value={info.email}
                    onChange={(e) => setInfo({ ...info, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-600">Phone</label>
                  <Input
                    value={info.phone}
                    onChange={(e) => setInfo({ ...info, phone: e.target.value })}
                  />
                </div>
              </div>
            </Card>
          )}

          {step === 1 && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold">Shipping Address</h2>
              <p className="mt-1 text-sm text-slate-500">Where should we deliver your order?</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-medium text-slate-600">Street address</label>
                  <Input
                    value={addr.line1}
                    onChange={(e) => setAddr({ ...addr, line1: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-600">City</label>
                  <Input
                    value={addr.city}
                    onChange={(e) => setAddr({ ...addr, city: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-600">Area</label>
                  <Input
                    value={addr.area}
                    onChange={(e) => setAddr({ ...addr, area: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-600">Postal code</label>
                  <Input
                    value={addr.postal}
                    onChange={(e) => setAddr({ ...addr, postal: e.target.value })}
                  />
                </div>
              </div>
            </Card>
          )}

          {step === 2 && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold">Payment Method</h2>
              <p className="mt-1 text-sm text-slate-500">Choose how you&apos;d like to pay.</p>
              <div className="mt-5 space-y-3">
                <button
                  onClick={() => setPayment("cod")}
                  className={cn(
                    "flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all",
                    payment === "cod"
                      ? "border-brand-500 bg-brand-50/50 ring-2 ring-brand-500/20"
                      : "border-slate-200 hover:border-slate-300"
                  )}
                >
                  <div
                    className={cn(
                      "grid h-5 w-5 shrink-0 place-items-center rounded-full border-2",
                      payment === "cod" ? "border-brand-600" : "border-slate-300"
                    )}
                  >
                    {payment === "cod" && (
                      <div className="h-2.5 w-2.5 rounded-full bg-brand-600" />
                    )}
                  </div>
                  <Truck className="h-5 w-5 text-slate-600" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold">Cash on Delivery</p>
                    <p className="text-xs text-slate-500">Pay when your order arrives</p>
                  </div>
                </button>
                <button
                  onClick={() => setPayment("online")}
                  className={cn(
                    "flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all",
                    payment === "online"
                      ? "border-brand-500 bg-brand-50/50 ring-2 ring-brand-500/20"
                      : "border-slate-200 hover:border-slate-300"
                  )}
                >
                  <div
                    className={cn(
                      "grid h-5 w-5 shrink-0 place-items-center rounded-full border-2",
                      payment === "online" ? "border-brand-600" : "border-slate-300"
                    )}
                  >
                    {payment === "online" && (
                      <div className="h-2.5 w-2.5 rounded-full bg-brand-600" />
                    )}
                  </div>
                  <CreditCard className="h-5 w-5 text-slate-600" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold">Online Payment</p>
                    <p className="text-xs text-slate-500">bKash, Nagad, Card (demo)</p>
                  </div>
                </button>
              </div>
            </Card>
          )}

          <div className="flex justify-between">
            {step > 0 ? (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            ) : (
              <Link href="/cart">
                <Button variant="outline">Back to cart</Button>
              </Link>
            )}
            {step < 2 ? (
              <Button disabled={!canNext} onClick={() => setStep(step + 1)}>
                Continue
              </Button>
            ) : (
              <Button size="lg" onClick={placeOrder} disabled={placing || cart.length === 0}>
                <Lock className="h-4 w-4" />
                {placing ? "Placing…" : `Place Order · ${formatBDT(cartTotals.total)}`}
              </Button>
            )}
          </div>
        </div>

        <aside className="lg:sticky lg:top-32 lg:self-start">
          <Card className="p-6">
            <h2 className="text-base font-semibold">Order Summary</h2>
            <ul className="mt-4 max-h-72 space-y-3 overflow-y-auto pr-1">
              {cart.map((line) => (
                <li key={line.id} className="flex gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={line.image} alt="" className="h-full w-full object-cover" />
                    <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-slate-900 px-1 text-[10px] font-semibold text-white">
                      {line.qty}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-xs font-medium text-slate-900">{line.name}</p>
                    <p className="text-[11px] text-slate-500">{formatBDT(line.price)}</p>
                  </div>
                  <p className="text-xs font-semibold">{formatBDT(line.price * line.qty)}</p>
                </li>
              ))}
            </ul>
            <dl className="mt-5 space-y-3 border-t border-slate-100 pt-5 text-sm">
              <div className="flex justify-between text-slate-600">
                <dt>Subtotal</dt>
                <dd className="font-medium text-slate-900">{formatBDT(cartTotals.subtotal)}</dd>
              </div>
              <div className="flex justify-between text-emerald-600">
                <dt>Discount</dt>
                <dd className="font-medium">−{formatBDT(cartTotals.discount)}</dd>
              </div>
              <div className="flex justify-between text-slate-600">
                <dt>Delivery</dt>
                <dd className="font-medium text-slate-900">
                  {cartTotals.delivery === 0 ? "Free" : formatBDT(cartTotals.delivery)}
                </dd>
              </div>
              <div className="flex justify-between border-t border-dashed border-slate-200 pt-4 text-base">
                <dt className="font-semibold">Total</dt>
                <dd className="font-bold">{formatBDT(cartTotals.total)}</dd>
              </div>
            </dl>
            <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
              <Lock className="h-3 w-3" /> Secured by 256-bit SSL
            </p>
          </Card>
        </aside>
      </div>
    </div>
  );
}