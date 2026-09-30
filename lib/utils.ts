import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export const formatBDT = (n: number) =>
  `৳${n.toLocaleString("en-BD", { maximumFractionDigits: 0 })}`;

export const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const statusColor = (status: string) => {
  const map: Record<string, string> = {
    Pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
    Confirmed: "bg-blue-50 text-blue-700 ring-blue-600/20",
    Processing: "bg-indigo-50 text-indigo-700 ring-indigo-600/20",
    "Out for Delivery": "bg-violet-50 text-violet-700 ring-violet-600/20",
    Delivered: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    Cancelled: "bg-rose-50 text-rose-700 ring-rose-600/20",
    Paid: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    Unpaid: "bg-slate-100 text-slate-700 ring-slate-600/20",
    Failed: "bg-rose-50 text-rose-700 ring-rose-600/20",
    Refunded: "bg-purple-50 text-purple-700 ring-purple-600/20",
    "In Stock": "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    "Low Stock": "bg-amber-50 text-amber-700 ring-amber-600/20",
    "Out of Stock": "bg-rose-50 text-rose-700 ring-rose-600/20",
  };
  return map[status] ?? "bg-slate-100 text-slate-700 ring-slate-600/20";
};

export const stockStatus = (n: number) =>
  n === 0 ? "Out of Stock" : n <= 10 ? "Low Stock" : "In Stock";