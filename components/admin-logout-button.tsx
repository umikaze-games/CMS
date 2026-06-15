"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type AdminLogoutButtonProps = {
  label: string;
};

export function AdminLogoutButton({ label }: AdminLogoutButtonProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogout() {
    setIsSubmitting(true);
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isSubmitting}
      className="absolute bottom-6 left-5 right-5 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold text-muted shadow-sm hover:text-ink disabled:cursor-not-allowed disabled:text-slate-400"
    >
      <LogOut size={18} />
      {isSubmitting ? "ログアウト中..." : label}
    </button>
  );
}
