import Link from "next/link";
import { FileText, Settings, Shield } from "lucide-react";
import type { GameTitle } from "@/lib/types";
import { AdminCreateLink } from "@/components/admin-create-link";
import { AdminGameSwitcher } from "@/components/admin-game-switcher";
import { AdminLogoutButton } from "@/components/admin-logout-button";

const cmsLabel = "CMS \u7ba1\u7406";
const noticeLabel = "\u304a\u77e5\u3089\u305b\u7ba1\u7406";
const createLabel = "\u65b0\u898f\u4f5c\u6210";
const settingsLabel = "\u8a2d\u5b9a";
const logoutLabel = "\u30ed\u30b0\u30a2\u30a6\u30c8";

type AdminShellProps = {
  children: React.ReactNode;
  currentGameId?: string;
  games?: GameTitle[];
  includeAllGames?: boolean;
};

export function AdminShell({
  children,
  currentGameId,
  games = [],
  includeAllGames = false
}: AdminShellProps) {
  const query = currentGameId ? `?game=${currentGameId}` : "";
  const createFallbackGameId = currentGameId === "all" ? undefined : currentGameId;
  const settingsQuery = createFallbackGameId ? `?game=${createFallbackGameId}` : "";

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_20%_0%,rgba(34,211,238,0.10),transparent_28%),linear-gradient(180deg,#f8fbff,#edf3f8)]">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-slate-200 bg-white/86 px-5 py-6 shadow-[8px_0_40px_rgba(15,23,42,0.05)] backdrop-blur-xl md:block">
        <Link href={`/admin/notices${query}`} className="mb-5 flex items-center gap-3 text-lg font-black text-ink">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white shadow-[0_12px_28px_rgba(15,23,42,0.18)]">
            <Shield size={22} />
          </span>
          {cmsLabel}
        </Link>

        <AdminGameSwitcher
          games={games}
          currentGameId={currentGameId}
          includeAllGames={includeAllGames}
        />

        <nav className="mt-5 grid gap-2 text-sm font-bold">
          <Link
            href={`/admin/notices${query}`}
            className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-ink hover:bg-cyan-50 hover:text-cyan-700"
          >
            <FileText size={18} />
            {noticeLabel}
          </Link>
          <AdminCreateLink fallbackGameId={createFallbackGameId} label={createLabel} />
        </nav>
        <Link
          href={`/admin/settings${settingsQuery}`}
          className="absolute bottom-20 left-5 flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold text-ink hover:bg-cyan-50 hover:text-cyan-700"
        >
          <Settings size={18} />
          {settingsLabel}
        </Link>
        <AdminLogoutButton label={logoutLabel} />
      </aside>
      <div className="md:pl-72">
        <header className="border-b border-line bg-white/92 px-5 py-4 shadow-sm backdrop-blur md:hidden">
          <Link href={`/admin/notices${query}`} className="font-black text-ink">
            {cmsLabel}
          </Link>
        </header>
        <main className="mx-auto max-w-6xl px-5 py-5">{children}</main>
      </div>
    </div>
  );
}
