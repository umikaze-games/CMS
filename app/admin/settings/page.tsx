import { AdminSettingsPanel } from "@/components/admin-settings-panel";
import { AdminShell } from "@/components/admin-shell";
import { getDefaultGameId, getGameTitles, getPublicCategories } from "@/lib/notices";
import { getNoticeTemplates } from "@/lib/server-notice-templates";

const labels = {
  section: "SETTINGS",
  title: "\u8a2d\u5b9a",
  lead:
    "\u30a2\u30ab\u30a6\u30f3\u30c8\u767a\u884c\u3001\u30b2\u30fc\u30e0\u767b\u9332\u3001\u30ab\u30c6\u30b4\u30ea\u30fc\u7de8\u96c6\u3092\u884c\u3048\u307e\u3059\u3002"
};

type SettingsPageProps = {
  searchParams: Promise<{
    game?: string;
  }>;
};

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const params = await searchParams;
  const games = await getGameTitles();
  const categories = await getPublicCategories();
  const templates = await getNoticeTemplates();
  const currentGameId = params.game ?? getDefaultGameId(games);

  return (
    <AdminShell games={games} currentGameId={currentGameId}>
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
        <p className="mb-2 text-sm font-bold text-muted">{labels.section}</p>
        <h1 className="text-3xl font-black text-ink">{labels.title}</h1>
        <p className="mt-2 text-sm text-muted">{labels.lead}</p>
      </div>
      <AdminSettingsPanel games={games} categories={categories} templates={templates} />
    </AdminShell>
  );
}
