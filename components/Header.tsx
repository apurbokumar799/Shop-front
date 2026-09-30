"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  ChevronDown,
  Heart,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
  LogOut,
  Package,
  MapPin,
  Settings,
} from "lucide-react";
import { useApp } from "@/app/providers";
import { cn } from "@/lib/utils";
import { categories } from "@/lib/mock-data";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/products" },
  { label: "Offers", href: "/products?filter=deals" },
];

export function Header() {
  const path = usePathname();
  const { cartCount, setCartOpen, wishlist, user, logout, authLoading } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
      <div className="hidden border-b border-slate-100 bg-slate-900 text-white md:block">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-6 text-xs">
          <p>Free shipping on orders over ৳5,000 · 30-day returns</p>
          <div className="flex items-center gap-4 text-slate-300">
            <Link href="/track" className="hover:text-white">Track Order</Link>
            <span>·</span>
            <Link href="#" className="hover:text-white">Help</Link>
            <span>·</span>
            <span>EN / ৳ BDT</span>
          </div>
        </div>
      </div>

      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <Link href="/" className="flex shrink-0 items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-soft">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            Shop<span className="text-brand-600">front</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900",
                path === l.href && "text-brand-600"
              )}
            >
              {l.label}
            </Link>
          ))}
          <div className="relative" onMouseLeave={() => setCatOpen(false)}>
            <button
              onMouseEnter={() => setCatOpen(true)}
              className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Categories <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {catOpen && (
              <div className="absolute left-0 top-full z-50 w-64 pt-2">
                <div className="animate-scale-in origin-top rounded-2xl border border-slate-200 bg-white p-2 shadow-pop">
                  {categories.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/products?category=${c.slug}`}
                      className="flex items-center justify-between rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <span>{c.name}</span>
                      <span className="text-xs text-slate-400">{c.count}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

        <div className="ml-auto hidden flex-1 max-w-lg lg:block">
          <div className="group relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              placeholder="Search for products, brands and more…"
              className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50/70 pl-10 pr-4 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10"
            />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-1">
          <Link href="/products" className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden">
            <Search className="h-5 w-5" />
          </Link>

          <Link href="/account/wishlist" className="relative hidden rounded-xl p-2 text-slate-600 hover:bg-slate-100 sm:block">
            <Heart className="h-5 w-5" />
            {wishlist.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white">
                {wishlist.length}
              </span>
            )}
          </Link>

          <button
            onClick={() => setCartOpen(true)}
            className="relative rounded-xl p-2 text-slate-600 hover:bg-slate-100"
            aria-label="Cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-semibold text-white">
                {cartCount}
              </span>
            )}
          </button>

          {authLoading ? (
            <div className="h-9 w-9 animate-pulse rounded-full bg-slate-200" />
          ) : user ? (
            <div className="relative">
              <button
                onClick={() => setUserOpen((v) => !v)}
                onBlur={() => setTimeout(() => setUserOpen(false), 150)}
                className="flex items-center gap-2 rounded-xl p-1 pr-2 hover:bg-slate-100"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-8 w-8 rounded-full object-cover"
                />
                <ChevronDown className="hidden h-3.5 w-3.5 text-slate-400 sm:block" />
              </button>
              {userOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-60 animate-scale-in origin-top-right rounded-2xl border border-slate-200 bg-white p-2 shadow-pop">
                  <div className="border-b border-slate-100 px-3 py-2.5">
                    <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                    <p className="truncate text-xs text-slate-500">{user.email}</p>
                  </div>
                  {[
                    { icon: User, label: "Profile", href: "/account" },
                    { icon: Package, label: "My Orders", href: "/account/orders" },
                    { icon: MapPin, label: "Addresses", href: "/account/addresses" },
                    { icon: Heart, label: "Wishlist", href: "/account/wishlist" },
                    { icon: Settings, label: "Settings", href: "/account/settings" },
                  ].map((i) => (
                    <Link
                      key={i.href}
                      href={i.href}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <i.icon className="h-4 w-4 text-slate-400" /> {i.label}
                    </Link>
                  ))}
                  <button
                    onClick={logout}
                    className="mt-1 flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-rose-600 hover:bg-rose-50"
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="ml-1 hidden rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 sm:block"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <div className="absolute inset-0 bg-slate-900/40 animate-fade-in" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-80 max-w-[85%] animate-slide-in bg-white p-4 shadow-pop">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold">Menu</span>
              <button onClick={() => setMobileOpen(false)} className="rounded-xl p-2 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="mt-4 space-y-1">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-xl px-3 py-2.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
                >
                  {l.label}
                </Link>
              ))}
              {!user && (
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="mt-4 block rounded-xl bg-slate-900 px-4 py-3 text-center text-sm font-medium text-white"
                >
                  Login / Register
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}