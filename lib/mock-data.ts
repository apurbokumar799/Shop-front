import { slugify } from "./utils";

export type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  stock: number;
  image: string;
  images: string[];
  description: string;
  specs: { key: string; value: string }[];
  badge?: "New" | "Best Seller" | "Flash Deal" | "Limited";
  sku: string;
  sold: number;
  createdAt: string;
};

const img = (seed: string, w = 800, h = 800) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

export const categories = [
  { name: "Electronics", slug: "electronics", icon: "Cpu", count: 128, image: img("electronics-cat", 400, 400) },
  { name: "Fashion", slug: "fashion", icon: "Shirt", count: 342, image: img("fashion-cat", 400, 400) },
  { name: "Home & Living", slug: "home-living", icon: "Home", count: 96, image: img("home-cat", 400, 400) },
  { name: "Beauty", slug: "beauty", icon: "Sparkles", count: 74, image: img("beauty-cat", 400, 400) },
  { name: "Sports", slug: "sports", icon: "Dumbbell", count: 58, image: img("sports-cat", 400, 400) },
  { name: "Toys & Kids", slug: "toys", icon: "Baby", count: 41, image: img("toys-cat", 400, 400) },
];

const base = (
  id: string, name: string, category: string, brand: string,
  price: number, originalPrice: number, rating: number, reviews: number,
  stock: number, badge: Product["badge"], sold: number
): Product => ({
  id, name, slug: slugify(name), category, brand,
  price, originalPrice, rating, reviews, stock, badge, sold,
  image: img(id),
  images: [img(id), img(id + "-b"), img(id + "-c"), img(id + "-d")],
  sku: `SKU-${id.toUpperCase().slice(0, 6)}`,
  createdAt: new Date(Date.now() - Math.random() * 90 * 864e5).toISOString(),
  description:
    "Crafted with precision using premium materials, this product balances form and function for everyday excellence. Backed by a 1-year warranty and 30-day returns.",
  specs: [
    { key: "Material", value: "Premium blend" },
    { key: "Weight", value: "320 g" },
    { key: "Dimensions", value: "20 × 12 × 6 cm" },
    { key: "Warranty", value: "1 year" },
    { key: "Country", value: "Bangladesh" },
  ],
});

export const products: Product[] = [
  base("p1", "Aurora Noise-Cancelling Headphones", "Electronics", "Aura", 12900, 15900, 4.8, 312, 42, "Best Seller", 1840),
  base("p2", "Nimbus Air Smart Watch Series 7", "Electronics", "Nimbus", 8990, 11990, 4.6, 218, 8, "Flash Deal", 1220),
  base("p3", "Lumen 4K Ultra HD Projector", "Electronics", "Lumen", 42500, 49900, 4.7, 84, 15, "New", 240),
  base("p4", "Vega Mechanical Keyboard Pro", "Electronics", "Vega", 6450, 7900, 4.5, 156, 62, undefined, 980),
  base("p5", "Solace Oversized Cotton Hoodie", "Fashion", "Solace", 2450, 3200, 4.4, 421, 130, "Best Seller", 3200),
  base("p6", "Drift Classic Denim Jacket", "Fashion", "Drift", 3890, 4900, 4.6, 187, 54, undefined, 760),
  base("p7", "Aether Running Sneakers", "Fashion", "Aether", 5290, 6900, 4.7, 264, 6, "Flash Deal", 1420),
  base("p8", "Nomad Leather Weekender Bag", "Fashion", "Nomad", 8900, 11500, 4.8, 92, 22, "Limited", 310),
  base("p9", "Hearth Ceramic Dinner Set (16 pc)", "Home & Living", "Hearth", 4500, 5800, 4.5, 143, 38, undefined, 640),
  base("p10", "Terra Rattan Accent Chair", "Home & Living", "Terra", 12500, 15900, 4.6, 61, 11, "New", 180),
  base("p11", "Bloom Vitamin C Serum 30ml", "Beauty", "Bloom", 1250, 1650, 4.9, 812, 240, "Best Seller", 5400),
  base("p12", "Velvet Matte Lipstick Set (5x)", "Beauty", "Velvet", 1890, 2400, 4.7, 342, 0, "Flash Deal", 2100),
  base("p13", "Vertex Adjustable Dumbbell 24kg", "Sports", "Vertex", 15900, 19900, 4.7, 78, 19, undefined, 340),
  base("p14", "Pulse Yoga Mat Pro 6mm", "Sports", "Pulse", 2190, 2900, 4.5, 268, 88, undefined, 1120),
  base("p15", "Wonder Wooden Puzzle Blocks", "Toys & Kids", "Wonder", 990, 1350, 4.8, 194, 156, "New", 890),
  base("p16", "Cosmo Remote-Control Rover", "Toys & Kids", "Cosmo", 3490, 4300, 4.6, 121, 4, "Flash Deal", 520),
];

export type Order = {
  id: string;
  customer: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  date: string;
  amount: number;
  payment: "Cash on Delivery" | "Online Payment";
  paymentStatus: "Paid" | "Unpaid" | "Pending" | "Failed" | "Refunded";
  status: "Pending" | "Confirmed" | "Processing" | "Out for Delivery" | "Delivered" | "Cancelled";
  items: { id: string; name: string; price: number; qty: number; image: string }[];
  subtotal: number;
  discount: number;
  delivery: number;
  history: { status: string; at: string }[];
};

const lineItem = (p: Product, qty: number) => ({
  id: p.id, name: p.name, price: p.price, qty, image: p.image,
});

const mkOrder = (
  id: string, customer: string, phone: string, city: string, address: string,
  status: Order["status"], payment: Order["payment"], paymentStatus: Order["paymentStatus"],
  items: { id: string; name: string; price: number; qty: number; image: string }[],
  daysAgo: number
): Order => {
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = Math.round(subtotal * 0.05);
  const delivery = subtotal > 5000 ? 0 : 80;
  const history = [
    { status: "Order Placed", at: new Date(Date.now() - daysAgo * 864e5).toISOString() },
  ];
  const flow = ["Confirmed", "Processing", "Out for Delivery", "Delivered"];
  const idx = flow.indexOf(status);
  for (let i = 0; i <= idx; i++) {
    history.push({
      status: flow[i],
      at: new Date(Date.now() - (daysAgo - i - 1) * 864e5).toISOString(),
    });
  }
  return {
    id, customer, phone, city, address,
    email: `${customer.split(" ")[0].toLowerCase()}@example.com`,
    date: new Date(Date.now() - daysAgo * 864e5).toISOString(),
    amount: subtotal - discount + delivery,
    payment, paymentStatus, status, items, subtotal, discount, delivery,
    history,
  };
};

export const orders: Order[] = [
  mkOrder("ORD-10582", "Rahim Ahmed", "+8801711000001", "Dhaka", "House 42, Road 11, Banani", "Pending", "Cash on Delivery", "Unpaid", [lineItem(products[0], 1), lineItem(products[10], 1)], 0),
  mkOrder("ORD-10581", "Fatima Khan", "+8801711000002", "Chattogram", "12 Agrabad C/A", "Confirmed", "Online Payment", "Paid", [lineItem(products[1], 1)], 0),
  mkOrder("ORD-10580", "Tanvir Hossain", "+8801711000003", "Dhaka", "Flat 5B, Dhanmondi 27", "Processing", "Online Payment", "Paid", [lineItem(products[4], 2), lineItem(products[13], 1)], 1),
  mkOrder("ORD-10579", "Nusrat Jahan", "+8801711000004", "Sylhet", "Zindabazar Point", "Out for Delivery", "Cash on Delivery", "Unpaid", [lineItem(products[6], 1)], 2),
  mkOrder("ORD-10578", "Imran Chowdhury", "+8801711000005", "Khulna", "Sonadanga R/A", "Delivered", "Online Payment", "Paid", [lineItem(products[8], 1), lineItem(products[11], 2)], 3),
  mkOrder("ORD-10577", "Sadia Islam", "+8801711000006", "Rajshahi", "Shaheb Bazar", "Delivered", "Cash on Delivery", "Paid", [lineItem(products[2], 1)], 4),
  mkOrder("ORD-10576", "Arif Mahmud", "+8801711000007", "Dhaka", "Mirpur DOHS", "Cancelled", "Online Payment", "Refunded", [lineItem(products[12], 1)], 5),
  mkOrder("ORD-10575", "Mim Akter", "+8801711000008", "Barishal", "Band Road", "Delivered", "Online Payment", "Paid", [lineItem(products[3], 1), lineItem(products[9], 1)], 6),
];

export const customers = [
  { id: "c1", name: "Rahim Ahmed", email: "rahim@example.com", phone: "+8801711000001", orders: 12, spent: 84500, joined: "2024-02-12", avatar: img("c1", 100, 100) },
  { id: "c2", name: "Fatima Khan", email: "fatima@example.com", phone: "+8801711000002", orders: 8, spent: 53200, joined: "2024-03-04", avatar: img("c2", 100, 100) },
  { id: "c3", name: "Tanvir Hossain", email: "tanvir@example.com", phone: "+8801711000003", orders: 21, spent: 142900, joined: "2023-11-19", avatar: img("c3", 100, 100) },
  { id: "c4", name: "Nusrat Jahan", email: "nusrat@example.com", phone: "+8801711000004", orders: 5, spent: 19800, joined: "2024-05-22", avatar: img("c4", 100, 100) },
  { id: "c5", name: "Imran Chowdhury", email: "imran@example.com", phone: "+8801711000005", orders: 15, spent: 97600, joined: "2024-01-08", avatar: img("c5", 100, 100) },
];

export const payments = [
  { id: "pay1", orderId: "ORD-10582", customer: "Rahim Ahmed", amount: 14325, method: "Cash on Delivery", txn: "—", status: "Unpaid", date: "2025-06-12" },
  { id: "pay2", orderId: "ORD-10581", customer: "Fatima Khan", amount: 8990, method: "bKash", txn: "TXN8F2A91C", status: "Paid", date: "2025-06-12" },
  { id: "pay3", orderId: "ORD-10580", customer: "Tanvir Hossain", amount: 10305, method: "Card", txn: "TXN91B00E2", status: "Paid", date: "2025-06-11" },
  { id: "pay4", orderId: "ORD-10579", customer: "Nusrat Jahan", amount: 5290, method: "Cash on Delivery", txn: "—", status: "Pending", date: "2025-06-10" },
  { id: "pay5", orderId: "ORD-10577", customer: "Sadia Islam", amount: 40505, method: "Nagad", txn: "TXN4C21D88", status: "Paid", date: "2025-06-09" },
  { id: "pay6", orderId: "ORD-10576", customer: "Arif Mahmud", amount: 15900, method: "Card", txn: "TXNABB120", status: "Refunded", date: "2025-06-08" },
  { id: "pay7", orderId: "ORD-10571", customer: "Sabbir Rahman", amount: 3450, method: "bKash", txn: "TXNFE00341", status: "Failed", date: "2025-06-06" },
];

export const salesSeries = [
  { label: "Mon", sales: 42000, orders: 34, revenue: 38000 },
  { label: "Tue", sales: 58000, orders: 48, revenue: 51000 },
  { label: "Wed", sales: 49000, orders: 41, revenue: 45000 },
  { label: "Thu", sales: 72000, orders: 62, revenue: 68000 },
  { label: "Fri", sales: 96000, orders: 84, revenue: 91000 },
  { label: "Sat", sales: 112000, orders: 101, revenue: 105000 },
  { label: "Sun", sales: 88000, orders: 76, revenue: 82000 },
];

export const recentOrders = orders.slice(0, 6);