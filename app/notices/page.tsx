import Link from "next/link";
import { ChevronLeft, ChevronRight, RadioTower, Sparkles } from "lucide-react";
import { NoticeCard } from "@/components/notice-card";
import { isNoticeNew } from "@/lib/date";
import { getPublicCategories, getPublicNotices } from "@/lib/notices";

const pageTitle = "\u304a\u77e5\u3089\u305b\u4e00\u89a7";
const leadText =
  "\u30e1\u30f3\u30c6\u30ca\u30f3\u30b9\u3001\u30a4\u30d9\u30f3\u30c8\u3001\u30ad\u30e3\u30f3\u30da\u30fc\u30f3\u306a\u3069\u3001\u516c\u5f0f\u30b5\u30a4\u30c8\u306b\u63b2\u8f09\u3059\u308b\u6700\u65b0\u60c5\u5831\u3092\u307e\u3068\u3081\u3066\u3044\u307e\u3059\u3002";
const liveLabel = "\u904b\u55b6\u304b\u3089\u306e\u6700\u65b0\u60c5\u5831";
const allLabel = "\u3059\u3079\u3066";
const emptyTitle = "\u8a72\u5f53\u3059\u308b\u304a\u77e5\u3089\u305b\u306f\u3042\u308a\u307e\u305b\u3093\u3002";
const emptyHelp = "\u5225\u306e\u30ab\u30c6\u30b4\u30ea\u30fc\u3092\u9078\u629e\u3057\u3066\u304f\u3060\u3055\u3044\u3002";
const prevLabel = "\u524d\u306e\u30da\u30fc\u30b8";
const nextLabel = "\u6b21\u306e\u30da\u30fc\u30b8";
const pageSize = 20;

type NoticesPageProps = {
  searchParams: Promise<{
    category?: string;
    page?: string;
  }>;
};

export default async function NoticesPage({ searchParams }: NoticesPageProps) {
  const params = await searchParams;
  const categories = await getPublicCategories();
  const notices = await getPublicNotices(params.category);
  const currentPage = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);
  const totalPages = Math.max(1, Math.ceil(notices.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const pageNotices = notices.slice((safePage - 1) * pageSize, safePage * pageSize);
  const featuredNotice = pageNotices[0];
  const restNotices = featuredNotice ? pageNotices.slice(1) : [];
  const pageHref = (page: number) => {
    const query = new URLSearchParams();
    if (params.category) {
      query.set("category", params.category);
    }
    if (page > 1) {
      query.set("page", String(page));
    }
    const queryText = query.toString();
    return queryText ? `/notices?${queryText}` : "/notices";
  };

  return (
    <>
      <main className="overflow-hidden">
        <section className="relative border-b border-slate-200 bg-white">
          <div className="relative mx-auto max-w-6xl px-5 py-4 md:py-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="max-w-3xl text-4xl font-black leading-none tracking-normal text-slate-950 md:text-5xl">
                  NEWS
                  <span className="ml-0 mt-2 block text-2xl text-cyan-700 md:ml-3 md:inline md:text-3xl">{pageTitle}</span>
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                  {leadText}
                </p>
              </div>
              <p className="inline-flex w-fit items-center gap-2 self-start rounded-md border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-black text-cyan-700 md:self-center">
                <RadioTower size={14} />
                {liveLabel}
              </p>
            </div>
          </div>
        </section>

        <section className="relative mx-auto max-w-6xl px-5 py-4 md:py-5">
          <div className="mb-4 flex flex-wrap gap-2 border-b border-slate-200 pb-3">
            <Link
              href="/notices"
              className={`inline-flex h-7 w-28 items-center justify-center gap-1.5 rounded-md px-3 text-xs font-black transition ${
                params.category
                  ? "bg-slate-100 text-slate-600 hover:bg-cyan-50 hover:text-slate-950"
                  : "bg-cyan-500 text-white shadow-[0_14px_30px_rgba(8,145,178,0.20)]"
              }`}
            >
              {allLabel}
              <ChevronRight size={15} />
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/notices?category=${category.id}`}
                className={`inline-flex h-7 w-28 items-center justify-center whitespace-nowrap rounded-md px-3 text-xs font-black transition hover:-translate-y-0.5 ${
                  params.category === category.id
                    ? "text-white shadow-[0_14px_30px_rgba(8,145,178,0.16)]"
                    : "hover:shadow-[0_10px_24px_rgba(15,23,42,0.10)]"
                }`}
                style={{
                  backgroundColor: params.category === category.id ? category.color : `${category.color}12`,
                  color: params.category === category.id ? "#ffffff" : category.color
                }}
              >
                {category.name}
              </Link>
            ))}
          </div>

          {notices.length ? (
            <>
              <div className="grid gap-3">
                {featuredNotice ? (
                  <NoticeCard
                    notice={featuredNotice}
                    featured
                    isNew={isNoticeNew(featuredNotice)}
                  />
                ) : null}
                {restNotices.map((notice) => (
                  <NoticeCard
                    key={notice.id}
                    notice={notice}
                    isNew={isNoticeNew(notice)}
                  />
                ))}
              </div>

              {totalPages > 1 ? (
                <nav className="mt-6 flex flex-wrap items-center justify-center gap-2" aria-label="pagination">
                  <Link
                    href={pageHref(Math.max(1, safePage - 1))}
                    aria-disabled={safePage === 1}
                    className={`inline-flex h-9 items-center justify-center gap-1 rounded-md px-3 text-xs font-black transition ${
                      safePage === 1
                        ? "pointer-events-none bg-slate-100 text-slate-400"
                        : "bg-white text-slate-700 shadow-[0_8px_20px_rgba(15,23,42,0.08)] hover:bg-cyan-50 hover:text-cyan-700"
                    }`}
                  >
                    <ChevronLeft size={15} />
                    {prevLabel}
                  </Link>
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                    <Link
                      key={page}
                      href={pageHref(page)}
                      className={`inline-flex h-9 w-9 items-center justify-center rounded-md text-xs font-black transition ${
                        safePage === page
                          ? "bg-cyan-500 text-white shadow-[0_12px_26px_rgba(8,145,178,0.20)]"
                          : "bg-white text-slate-700 shadow-[0_8px_20px_rgba(15,23,42,0.08)] hover:bg-cyan-50 hover:text-cyan-700"
                      }`}
                    >
                      {page}
                    </Link>
                  ))}
                  <Link
                    href={pageHref(Math.min(totalPages, safePage + 1))}
                    aria-disabled={safePage === totalPages}
                    className={`inline-flex h-9 items-center justify-center gap-1 rounded-md px-3 text-xs font-black transition ${
                      safePage === totalPages
                        ? "pointer-events-none bg-slate-100 text-slate-400"
                        : "bg-white text-slate-700 shadow-[0_8px_20px_rgba(15,23,42,0.08)] hover:bg-cyan-50 hover:text-cyan-700"
                    }`}
                  >
                    {nextLabel}
                    <ChevronRight size={15} />
                  </Link>
                </nav>
              ) : null}
            </>
          ) : (
            <div className="rounded-lg border border-slate-200 bg-white p-12 text-center shadow-[0_24px_60px_rgba(15,23,42,0.10)]">
              <Sparkles className="mx-auto mb-4 text-cyan-600" size={28} />
              <p className="text-lg font-black text-slate-950">{emptyTitle}</p>
              <p className="mt-2 text-sm text-slate-500">{emptyHelp}</p>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
