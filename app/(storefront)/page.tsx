import Link from "next/link";
import {
  ArrowRight, BadgePercent, Clock, Headphones, ShieldCheck, Sparkles, Truck, RotateCcw, Zap,
} from "lucide-react";
import { categories, products } from "@/lib/mock-data";
import { formatBDT } from "@/lib/utils";
import { ProductCardGrid } from "@/components/ProductCardGrid";
import { NewsletterForm } from "@/components/NewsletterForm";

const Section = ({
  title, subtitle, href, children, actionLabel = "View all",
}: { title: string; subtitle?: string; href?: string; children: React.ReactNode; actionLabel?: string }) => (
  <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-12">
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {href && (
        <Link href={href} className="group hidden items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700 sm:flex">
          {actionLabel}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
    {children}
  </section>
);

export default function HomePage() {
  const featured = products.slice(0, 8);
  const bestSelling = [...products].sort((a, b) => b.sold - a.sold).slice(0, 8);
  const newArrivals = [...products].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).slice(0, 4);
  const flashDeals = products.filter((p) => p.badge === "Flash Deal");

  return (
    <>
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-slate-900 via-brand-900 to-slate-900 text-white">
        <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_20%_10%,#818cf8,transparent_40%),radial-gradient(circle_at_80%_80%,#f472b6,transparent_40%)]" />
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> Summer Sale · Up to 60% off
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Everything you love,<br />
              <span className="bg-gradient-to-r from-brand-300 via-white to-rose-300 bg-clip-text text-transparent">
                delivered to your door.
              </span>
            </h1>
            <p className="mt-5 max-w-lg text-base text-white/70">
              Shop 10,000+ curated products across electronics, fashion, home and beauty. Free delivery on orders over ৳5,000.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/products" className="inline-flex h-12 items-center gap-2 rounded-xl bg-white px-6 text-sm font-semibold text-slate-900 transition-transform hover:scale-[1.02]">
                Shop Now <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/products?filter=deals" className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/10">
                Explore Deals
              </Link>
            </div>
            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-white/10 pt-6">
              {[
                { k: "10K+", v: "Products" },
                { k: "250K+", v: "Happy customers" },
                { k: "4.9★", v: "Rated service" },
              ].map((s) => (
                <div key={s.v}>
                  <dt className="text-2xl font-bold">{s.k}</dt>
                  <dd className="text-xs text-white/60">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://picsum.photos/seed/hero1/600/800" alt="" className="col-span-1 aspect-[3/4] w-full rounded-3xl object-cover shadow-pop" />
              <div className="flex flex-col gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://picsum.photos/seed/hero2/600/600" alt="" className="aspect-square w-full rounded-3xl object-cover shadow-pop" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://picsum.photos/seed/hero3/600/500" alt="" className="aspect-[6/5] w-full rounded-3xl object-cover shadow-pop" />
              </div>
            </div>
            <div className="absolute -bottom-5 -left-5 hidden animate-slide-up rounded-2xl bg-white p-3.5 text-slate-900 shadow-pop sm:block">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-100 text-emerald-600"><Truck className="h-5 w-5" /></div>
                <div>
                  <p className="text-xs text-slate-500">Free delivery</p>
                  <p className="text-sm font-semibold">Over ৳5,000</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 py-6 md:grid-cols-4">
          {[
            { icon: Truck, t: "Free Shipping", s: "On orders ৳5,000+" },
            { icon: RotateCcw, t: "30-Day Returns", s: "Hassle-free" },
            { icon: ShieldCheck, t: "Secure Payment", s: "256-bit SSL" },
            { icon: Headphones, t: "24/7 Support", s: "Always here" },
          ].map((b) => (
            <div key={b.t} className="flex items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600"><b.icon className="h-5 w-5" /></div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">{b.t}</p>
                <p className="truncate text-xs text-slate-500">{b.s}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Section title="Shop by Category" subtitle="Browse our most popular collections" href="/products">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((c) => (
            <Link key={c.slug} href={`/products?category=${c.slug}`}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft transition-all hover:-translate-y-1 hover:shadow-card">
              <div className="aspect-square overflow-hidden bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.image} alt={c.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
              <div className="p-3 text-center">
                <p className="text-sm font-semibold text-slate-900 group-hover:text-brand-600">{c.name}</p>
                <p className="text-xs text-slate-500">{c.count} items</p>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      <section className="mx-auto grid max-w-7xl gap-4 px-6 pb-4 lg:grid-cols-3">
        <Link href="/products?category=electronics" className="group relative col-span-1 overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-indigo-900 p-8 text-white lg:col-span-2">
          <div className="relative z-10 max-w-xs">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/70">Limited time</p>
            <h3 className="mt-2 text-2xl font-bold">Tech Fest — up to 45% off</h3>
            <p className="mt-2 text-sm text-white/70">Headphones, watches, keyboards & more</p>
            <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold underline-offset-4 group-hover:underline">
              Shop electronics <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://picsum.photos/seed/promo-e/500/400" alt="" className="absolute right-0 top-0 h-full w-1/2 object-cover opacity-40 mix-blend-overlay" />
        </Link>
        <Link href="/products?category=fashion" className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-500 to-pink-700 p-8 text-white">
          <div className="relative z-10">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/70">New collection</p>
            <h3 className="mt-2 text-2xl font-bold">Fashion Forward</h3>
            <p className="mt-2 text-sm text-white/70">Fresh drops every week</p>
            <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold underline-offset-4 group-hover:underline">
              Shop fashion <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://picsum.photos/seed/promo-f/400/400" alt="" className="absolute -bottom-4 -right-4 h-40 w-40 rounded-2xl object-cover opacity-80" />
        </Link>
      </section>

      {flashDeals.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-10">
          <div className="overflow-hidden rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6 sm:p-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-amber-500 text-white shadow-soft"><Zap className="h-5 w-5" /></div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Flash Deals</h2>
                  <p className="text-sm text-amber-700">Hurry — offers end soon</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-amber-900">
                <Clock className="h-4 w-4" />
                {["04h", "12m", "34s"].map((u, i) => (
                  <span key={i} className="rounded-lg bg-white px-3 py-1.5 text-sm font-semibold tabular-nums shadow-soft">{u}</span>
                ))}
              </div>
            </div>
            <ProductCardGrid products={flashDeals} />
          </div>
        </section>
      )}

      <Section title="Featured Products" subtitle="Hand-picked this week" href="/products">
        <ProductCardGrid products={featured} />
      </Section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-10 text-white sm:p-14">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-500/30 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-rose-500/20 blur-3xl" />
          <div className="relative grid items-center gap-8 lg:grid-cols-2">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-300">
                <BadgePercent className="h-4 w-4" /> Special offer
              </div>
              <h3 className="mt-3 text-3xl font-bold sm:text-4xl">Save an extra 15% on your first order</h3>
              <p className="mt-3 text-white/70">Use code <span className="rounded-lg bg-white/10 px-2 py-0.5 font-mono font-semibold text-white">WELCOME15</span> at checkout. Valid on all products.</p>
              <Link href="/products" className="mt-6 inline-flex h-12 items-center gap-2 rounded-xl bg-white px-6 text-sm font-semibold text-slate-900 transition-transform hover:scale-[1.02]">
                Grab the deal <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="relative hidden lg:block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://picsum.photos/seed/discount/700/500" alt="" className="ml-auto max-w-md rounded-3xl object-cover shadow-pop" />
            </div>
          </div>
        </div>
      </section>

      <Section title="Best Sellers" subtitle="Most loved by our customers" href="/products?sort=popular">
        <ProductCardGrid products={bestSelling} />
      </Section>

      <Section title="New Arrivals" subtitle="Fresh on the shelves" href="/products?sort=new">
        <ProductCardGrid products={newArrivals} cols={4} />
      </Section>

      <Section title="Recommended for You" subtitle="Based on your browsing">
        <ProductCardGrid products={products.slice(6, 14)} />
      </Section>

      <section className="border-t border-slate-200 bg-white py-16">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">Why shop with Shopfront?</h2>
          <p className="mt-2 text-center text-sm text-slate-500">A shopping experience built for you</p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { icon: Truck, t: "Fast, free delivery", d: "Nationwide delivery in 1–3 days, free on orders above ৳5,000." },
              { icon: ShieldCheck, t: "Buyer protection", d: "100% secure payments and full refund if items don't match." },
              { icon: RotateCcw, t: "Easy returns", d: "Change of mind? Return within 30 days, no questions asked." },
            ].map((b) => (
              <div key={b.t} className="rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-6">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-50 text-brand-600"><b.icon className="h-5 w-5" /></div>
                <h3 className="mt-4 text-base font-semibold">{b.t}</h3>
                <p className="mt-1.5 text-sm text-slate-500">{b.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 p-10 text-white sm:p-14">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <h3 className="text-3xl font-bold">Join our newsletter</h3>
              <p className="mt-2 text-white/80">Get exclusive offers, new arrivals and insider deals directly in your inbox.</p>
            </div>
            <NewsletterForm />
          </div>
        </div>
      </section>
    </>
  );
}