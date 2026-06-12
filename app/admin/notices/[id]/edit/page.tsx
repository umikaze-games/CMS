import { notFound } from "next/navigation";
import { AdminCurrentClock } from "@/components/admin-current-clock";
import { AdminNoticeForm } from "@/components/admin-notice-form";
import { AdminShell } from "@/components/admin-shell";
import { getDefaultGameId, getGameTitles, getNoticeById, getPublicCategories } from "@/lib/notices";

const labels = {
  section: "EDIT",
  title: "\u304a\u77e5\u3089\u305b\u7de8\u96c6"
};

type AdminNoticeEditPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    game?: string;
  }>;
};

export default async function AdminNoticeEditPage({
  params,
  searchParams
}: AdminNoticeEditPageProps) {
  const { id } = await params;
  const query = await searchParams;
  const notice = await getNoticeById(id);
  const categories = await getPublicCategories();
  const games = getGameTitles();
  const currentGameId = query.game ?? notice?.gameId ?? getDefaultGameId();

  if (!notice) {
    notFound();
  }

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
      <AdminNoticeForm
        categories={categories}
        games={games}
        currentGameId={currentGameId}
        notice={notice}
      />
    </AdminShell>
  );
}
