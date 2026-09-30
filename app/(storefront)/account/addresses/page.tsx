"use client";
import { useEffect, useState } from "react";
import { MapPin, Plus, Trash2 } from "lucide-react";
import { Button, Card, Input } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";
import { useApp } from "@/app/providers";

export default function AddressesPage() {
  const { user, toast } = useApp();
  const [addrs, setAddrs] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    label: "Home",
    name: "",
    phone: "",
    line1: "",
    city: "",
  });

  const load = async () => {
    if (!user) return;
    const supabase = createClient();
    const { data } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setAddrs(data ?? []);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const save = async () => {
    if (!user) return;
    const supabase = createClient();
    const { error } = await supabase.from("addresses").insert({
      user_id: user.id,
      ...form,
    });
    if (error) {
      toast({ title: "Failed", description: error.message, variant: "error" });
      return;
    }
    toast({ title: "Address saved", variant: "success" });
    setOpen(false);
    setForm({ label: "Home", name: "", phone: "", line1: "", city: "" });
    load();
  };

  const remove = async (id: string) => {
    const supabase = createClient();
    await supabase.from("addresses").delete().eq("id", id);
    toast({ title: "Address removed", variant: "default" });
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Saved Addresses</h2>
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus className="h-3.5 w-3.5" /> Add address
        </Button>
      </div>

      {open && (
        <Card className="p-5">
          <h3 className="text-sm font-semibold">New Address</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Input placeholder="Label (Home, Office)" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} />
            <Input placeholder="Recipient name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <Input placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            <Input placeholder="Street address" className="sm:col-span-2" value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} />
          </div>
          <div className="mt-4 flex gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save}>Save address</Button>
          </div>
        </Card>
      )}

      {addrs.length === 0 && !open && (
        <Card className="p-10 text-center">
          <MapPin className="mx-auto h-8 w-8 text-slate-300" />
          <p className="mt-3 font-semibold">No saved addresses</p>
          <p className="mt-1 text-sm text-slate-500">Add an address to speed up checkout.</p>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {addrs.map((a) => (
          <Card key={a.id} className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-slate-500">
                  <MapPin className="h-4 w-4" />
                </div>
                <p className="text-sm font-semibold">{a.label}</p>
              </div>
              <button
                onClick={() => remove(a.id)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="mt-4 space-y-1 text-sm text-slate-600">
              <p className="font-medium text-slate-900">{a.name}</p>
              <p>{a.line1}</p>
              <p>{a.city}</p>
              <p className="text-slate-500">{a.phone}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}