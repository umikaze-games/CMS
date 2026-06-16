import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminCurrentClock } from "@/components/admin-current-clock";
import { AdminShell } from "@/components/admin-shell";
import { AdminNoticesTable } from "@/components/admin-notices-table";
import { getAdminNotices, getDefaultGameId, getGameTitles } from "@/lib/notices";

const labels = {
  backOffice: "BACK OFFICE",
  title: "\u304a\u77e5\u3089\u305b\u7ba1\u7406",
  lead:
    "\u30b2\u30fc\u30e0\u30bf\u30a4\u30c8\u30eb\u3054\u3068\u306b\u304a\u77e5\u3089\u305b\u3092\u7ba1\u7406\u3067\u304d\u307e\u3059\u3002TOP\u56fa\u5b9a\u306f1\u4ef6\u306e\u307f\u3001\u4e88\u7d04\u516c\u958b\u306f\u6307\u5b9a\u65e5\u6642\u4ee5\u964d\u306b\u8868\u793a\u3055\u308c\u307e\u3059\u3002",
  create: "\u65b0\u898f\u4f5c\u6210"
};

type AdminNoticesPageProps = {
  searchParams: Promise<{
    game?: string;
  }>;
};

export default async function AdminNoticesPage({ searchParams }: AdminNoticesPageProps) {
  const params = await searchParams;
  const games = await getGameTitles();
  const currentGameId = params.game ?? getDefaultGameId(games);
  const notices = await getAdminNotices(currentGameId);

  return (
    <AdminShell games={games} currentGameId={currentGameId}>
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-soft backdrop-blur">
        <div className="flex flex-col gap-4 md:flex-row md:items-stretch md:justify-between">
          <div>
            <p className="mb-2 text-sm font-bold text-muted">{labels.backOffice}</p>
            <h1 className="text-3xl font-black text-ink">{labels.title}</h1>
            <p className="mt-2 text-sm text-muted">{labels.lead}</p>
          </div>
          <div className="flex flex-col items-start gap-3 md:items-end md:justify-between">
            <AdminCurrentClock />
            <Link
              href={`/admin/notices/new?game=${currentGameId}`}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-ink px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-slate-700"
            >
              <Plus size={18} />
              {labels.create}
            </Link>
          </div>
        </div>
      </div>

      <AdminNoticesTable notices={notices} currentGameId={currentGameId} />
    </AdminShell>
  );
}
