"use client";
import { useState } from "react";
import { Check, Send } from "lucide-react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); if (email) { setDone(true); setEmail(""); setTimeout(() => setDone(false), 3500); } }}
      className="flex flex-col gap-3 sm:flex-row"
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="h-12 flex-1 rounded-xl border border-white/20 bg-white/10 px-4 text-sm text-white placeholder:text-white/50 outline-none backdrop-blur focus:border-white/50 focus:bg-white/15"
      />
      <button
        type="submit"
        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-semibold text-slate-900 transition-transform hover:scale-[1.02]"
      >
        {done ? <><Check className="h-4 w-4" /> Subscribed</> : <><Send className="h-4 w-4" /> Subscribe</>}
      </button>
    </form>
  );
}