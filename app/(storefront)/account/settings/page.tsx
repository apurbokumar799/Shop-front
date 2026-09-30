"use client";
import { useState } from "react";
import { Button, Card, Input } from "@/components/ui";
import { useApp } from "@/app/providers";
import { createClient } from "@/lib/supabase/client";

export default function SettingsPage() {
  const { user, toast } = useApp();
  const [tab, setTab] = useState("profile");
  const [name, setName] = useState(user?.name ?? "");

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      data: { name },
    });
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "error" });
      return;
    }
    toast({ title: "Profile updated", variant: "success" });
  };

  const changePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      password: fd.get("password") as string,
    });
    if (error) {
      toast({ title: "Failed", description: error.message, variant: "error" });
      return;
    }
    toast({ title: "Password updated", variant: "success" });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Account Settings</h2>
      <div className="flex gap-1 border-b border-slate-200">
        {["profile", "password"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium capitalize ${
              tab === t ? "border-b-2 border-brand-600 text-brand-600" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <Card className="p-6">
        {tab === "profile" && (
          <form className="max-w-lg space-y-4" onSubmit={saveProfile}>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600">Full name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600">Email</label>
              <Input value={user?.email ?? ""} disabled />
            </div>
            <Button type="submit">Save changes</Button>
          </form>
        )}
        {tab === "password" && (
          <form className="max-w-lg space-y-4" onSubmit={changePassword}>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600">New password</label>
              <Input type="password" name="password" minLength={6} required />
            </div>
            <Button type="submit">Update password</Button>
          </form>
        )}
      </Card>
    </div>
  );
}