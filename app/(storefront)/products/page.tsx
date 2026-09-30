"use client";
import { useMemo, useState } from "react";
import { Filter, SlidersHorizontal, X } from "lucide-react";
import { categories, products } from "@/lib/mock-data";
import { ProductCardGrid } from "@/components/ProductCardGrid";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

const sorts = [
  { id: "popular", label: "Most Popular" },
  { id: "new", label: "Newest" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "rating", label: "Top Rated" },
];

export default function ProductsPage() {
  const [cat, setCat] = useState<string>("all");
  const [sort, setSort] = useState("popular");
  const [maxPrice, setMaxPrice] = useState(50000);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = [...products];
    if (cat !== "all") {
      const catName = categories.find((c) => c.slug === cat)?.name;
      if (catName) list = list.filter((p) => p.category === catName);
    }
    list = list.filter((p) => p.price <= maxPrice && p.rating >= minRating);
    if (inStockOnly) list = list.filter((p) => p.stock > 0);
    switch (sort) {
      case "new":
        list.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
        break;
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      default:
        list.sort((a, b) => b.sold - a.sold);
    }
    return list;
  }, [cat, sort, maxPrice, minRating, inStockOnly]);

  const FilterPanel = (
    <div className="space-y-6">
      <div>
        <h4 className="mb-3 text-sm font-semibold text-slate-900">Category</h4>
        <div className="space-y-1">
          <button
            onClick={() => setCat("all")}
            className={cn(
              "block w-full rounded-lg px-3 py-1.5 text-left text-sm",
              cat === "all" ? "bg-brand-50 font-medium text-brand-700" : "text-slate-600 hover:bg-slate-50"
            )}
          >
            All Products
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              onClick={() => setCat(c.slug)}
              className={cn(
                "block w-full rounded-lg px-3 py-1.5 text-left text-sm",
                cat === c.slug ? "bg-brand-50 font-medium text-brand-700" : "text-slate-600 hover:bg-slate-50"
              )}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h4 className="mb-3 text-sm font-semibold text-slate-900">Price range</h4>
        <input
          type="range"
          min={500}
          max={50000}
          step={500}
          value={maxPrice}
          onChange={(e) => setMaxPrice(+e.target.value)}
          className="w-full accent-brand-600"
        />
        <div className="mt-2 flex justify-between text-xs text-slate-500">
          <span>৳500</span>
          <span>৳{maxPrice.toLocaleString()}</span>
        </div>
      </div>
      <div>
        <h4 className="mb-3 text-sm font-semibold text-slate-900">Rating</h4>
        <div className="flex gap-2">
          {[0, 3, 4, 4.5].map((r) => (
            <button
              key={r}
              onClick={() => setMinRating(r)}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-xs",
                minRating === r
                  ? "border-brand-500 bg-brand-50 text-brand-700"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              )}
            >
              {r === 0 ? "All" : `${r}★+`}
            </button>
          ))}
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => setInStockOnly(e.target.checked)}
          className="h-4 w-4 rounded accent-brand-600"
        />
        In stock only
      </label>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
      <div className="mb-8">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Shop</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">All Products</h1>
        <p className="mt-1 text-sm text-slate-500">{filtered.length} products found</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-32 rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
            {FilterPanel}
          </div>
        </aside>

        <div>
          <div className="mb-5 flex items-center justify-between gap-3">
            <button
              onClick={() => setFiltersOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </button>
            <div className="ml-auto flex items-center gap-2">
              <span className="hidden text-sm text-slate-500 sm:block">Sort by</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-500"
              >
                {sorts.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white py-20 text-center">
              <Filter className="mx-auto h-8 w-8 text-slate-300" />
              <p className="mt-3 font-semibold text-slate-900">No products found</p>
              <p className="mt-1 text-sm text-slate-500">Try adjusting your filters.</p>
              <Button
                className="mt-4"
                variant="outline"
                onClick={() => {
                  setCat("all");
                  setMaxPrice(50000);
                  setMinRating(0);
                  setInStockOnly(false);
                }}
              >
                Reset filters
              </Button>
            </div>
          ) : (
            <ProductCardGrid products={filtered} />
          )}
        </div>
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/40 animate-fade-in"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-80 max-w-[85%] animate-slide-in overflow-y-auto bg-white p-5 shadow-pop">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold">Filters</h3>
              <button onClick={() => setFiltersOpen(false)} className="rounded-lg p-2 hover:bg-slate-100">
                <X className="h-4 w-4" />
              </button>
            </div>
            {FilterPanel}
            <Button className="mt-6 w-full" onClick={() => setFiltersOpen(false)}>
              Apply filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}