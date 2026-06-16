"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";

type AdminCreateLinkProps = {
  fallbackGameId?: string;
  label: string;
};

export function AdminCreateLink({ fallbackGameId, label }: AdminCreateLinkProps) {
  const searchParams = useSearchParams();
  const searchGameId = searchParams.get("game");
  const gameId = searchGameId && searchGameId !== "all" ? searchGameId : fallbackGameId || "";
  const query = gameId ? `?game=${gameId}` : "";

  return (
    <Link
      href={`/admin/notices/new${query}`}
      className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-ink hover:bg-cyan-50 hover:text-cyan-700"
    >
      <Plus size={18} />
      {label}
    </Link>
  );
}
