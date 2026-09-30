import Link from "next/link";
import { Mail, MapPin, Phone, ShoppingBag } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

const cols = [
  { title: "Shop", links: ["New Arrivals", "Best Sellers", "Flash Deals", "Gift Cards", "Brands"] },
  { title: "Support", links: ["Help Center", "Track Order", "Shipping Info", "Returns", "Contact Us"] },
  { title: "Company", links: ["About", "Careers", "Press", "Sustainability", "Affiliates"] },
  { title: "Legal", links: ["Terms", "Privacy", "Cookies", "Licenses", "Sitemap"] },
];

const socials = [
  { Icon: FaFacebookF, label: "Facebook" },
  { Icon: FaInstagram, label: "Instagram" },
  { Icon: FaTwitter, label: "Twitter" },
  { Icon: FaYoutube, label: "YouTube" },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold">Shopfront</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-slate-500">
              Bangladesh&apos;s modern marketplace for premium electronics, fashion, home essentials and more — delivered to your door.
            </p>
            <div className="mt-5 space-y-2 text-sm text-slate-500">
              <p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Gulshan 2, Dhaka 1212, BD</p>
              <p className="flex items-center gap-2"><Phone className="h-4 w-4" /> +880 1700 000 000</p>
              <p className="flex items-center gap-2"><Mail className="h-4 w-4" /> hello@shopfront.com</p>
            </div>
            <div className="mt-5 flex gap-2">
              {socials.map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-slate-500 transition-colors hover:border-brand-500 hover:text-brand-600"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="text-sm font-semibold text-slate-900">{c.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {c.links.map((l) => (
                  <li key={l}>
                    <Link href="#" className="text-sm text-slate-500 transition-colors hover:text-brand-600">
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-6 text-xs text-slate-500 sm:flex-row">
          <p>© 2025 Shopfront. All rights reserved.</p>
          <p>Secure payments via bKash · Nagad · Visa · Mastercard · COD</p>
        </div>
      </div>
    </footer>
  );
}