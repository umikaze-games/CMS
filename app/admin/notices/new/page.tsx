import { AdminNoticeForm } from "@/components/admin-notice-form";
import { AdminCurrentClock } from "@/components/admin-current-clock";
import { AdminShell } from "@/components/admin-shell";
import { getDefaultGameId, getGameTitles, getPublicCategories } from "@/lib/notices";

const labels = {
  section: "CREATE",
  title: "\u304a\u77e5\u3089\u305b\u65b0\u898f\u4f5c\u6210"
};

type AdminNoticeNewPageProps = {
  searchParams: Promise<{
    game?: string;
  }>;
};

export default async function AdminNoticeNewPage({ searchParams }: AdminNoticeNewPageProps) {
  const params = await searchParams;
  const categories = await getPublicCategories();
  const games = getGameTitles();
  const currentGameId = params.game ?? getDefaultGameId();

  return (
    <AdminShell games={games} currentGameId={currentGameId}>
      <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="mb-1 text-xs font-bold text-muted">{labels.section}</p>
            <h1 className="text-2xl font-black text-ink">{labels.title}</h1>
          </div>
          <AdminCurrentClock />
        </div>
      </div>
      <AdminNoticeForm categories={categories} games={games} currentGameId={currentGameId} />
    </AdminShell>
  );
}
