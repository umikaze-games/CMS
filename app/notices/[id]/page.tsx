import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { CategoryBadge } from "@/components/category-badge";
import { NoticeBody } from "@/components/notice-body";
import { formatDateWithTime } from "@/lib/date";
import { getNoticeBannerImage, isDefaultNoticeBannerUrl } from "@/lib/default-notice-banners";
import { isLocalNoticeUploadUrl } from "@/lib/local-upload-path";
import { getNoticeById } from "@/lib/notices";

const backLabel = "\u304a\u77e5\u3089\u305b\u4e00\u89a7\u3078\u623b\u308b";
const noticeTopLabel = "\u304a\u77e5\u3089\u305b\u30c8\u30c3\u30d7\u306b\u623b\u308b";
const unavailableTitle = "\u3053\u306e\u304a\u77e5\u3089\u305b\u306f\u73fe\u5728\u8868\u793a\u3067\u304d\u307e\u305b\u3093";
const unavailableBody =
  "\u516c\u958b\u304c\u7d42\u4e86\u3057\u305f\u304b\u3001\u73fe\u5728\u975e\u8868\u793a\u306b\u8a2d\u5b9a\u3055\u308c\u3066\u3044\u307e\u3059\u3002";
const publishedLabel = "\u516c\u958b\u65e5";
const updatedLabel = "\u66f4\u65b0\u65e5";

type NoticeDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function NoticeDetailPage({ params }: NoticeDetailPageProps) {
  const { id } = await params;
  const notice = await getNoticeById(id);

  if (!notice || notice.status !== "published") {
    return <UnavailableNotice />;
  }

  const bannerImage = getNoticeBannerImage(notice);

  return (
    <>
      <main>
        <section className="relative border-b border-cyan-100">
          <div className="absolute inset-0">
            <Image
              src={bannerImage}
              alt=""
              fill
              priority
              sizes="100vw"
              unoptimized={isLocalNoticeUploadUrl(bannerImage) || isDefaultNoticeBannerUrl(bannerImage)}
              className="object-cover opacity-24 saturate-125"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,#ffffff_0%,rgba(255,255,255,0.94)_48%,rgba(255,255,255,0.76)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#f4f8ff] to-transparent" />
          </div>

          <div className="relative mx-auto max-w-6xl px-5 py-4 md:py-5">
            <Link
              href="/notices"
              className="mb-3 inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white/80 px-4 py-2 text-sm font-black text-slate-600 shadow-[0_12px_30px_rgba(15,23,42,0.08)] backdrop-blur hover:border-cyan-300 hover:text-slate-950"
            >
              <ArrowLeft size={18} />
              {backLabel}
            </Link>

            <div className="flex flex-wrap items-center gap-3">
              <CategoryBadge category={notice.category} isPinned={notice.isPinned} />
              <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white/78 px-3 py-1 text-xs font-bold text-slate-600 backdrop-blur">
                <CalendarDays size={14} />
                {publishedLabel}: {formatDateWithTime(notice.publishAt)}
              </span>
              <span className="rounded-md border border-slate-200 bg-white/78 px-3 py-1 text-xs font-bold text-slate-600 backdrop-blur">
                {updatedLabel}: {formatDateWithTime(notice.updatedAt)}
              </span>
            </div>

            <h1 className="mt-3 max-w-4xl text-3xl font-black leading-tight tracking-normal text-slate-950 md:text-4xl">
              {notice.title}
            </h1>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-5 md:py-6">
          <article className="overflow-hidden rounded-lg border border-slate-200 bg-white/92 shadow-[0_24px_60px_rgba(15,23,42,0.10)] backdrop-blur">
            <div className="relative h-60 border-b border-slate-200 bg-slate-100 md:h-[420px]">
              <Image
                src={bannerImage}
                alt=""
                fill
                sizes="(min-width: 1024px) 1100px, 100vw"
                unoptimized={isLocalNoticeUploadUrl(bannerImage) || isDefaultNoticeBannerUrl(bannerImage)}
                className="object-cover"
              />
            </div>

            <div className="p-6 text-base leading-8 text-slate-700 md:p-10">
              <NoticeBody body={notice.body} />
            </div>
          </article>
          <div className="mt-6 flex justify-center">
            <Link
              href="/notices"
              className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-5 py-2.5 text-sm font-black text-slate-600 shadow-[0_12px_30px_rgba(15,23,42,0.08)] hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700"
            >
              <ArrowLeft size={18} />
              {backLabel}
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}

function UnavailableNotice() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-4xl items-center justify-center px-5 py-16">
      <section className="w-full rounded-lg border border-slate-200 bg-white p-8 text-center shadow-[0_24px_60px_rgba(15,23,42,0.10)]">
        <p className="mb-3 text-sm font-black uppercase tracking-normal text-cyan-700">NEWS</p>
        <h1 className="text-2xl font-black leading-tight text-slate-950 md:text-3xl">
          {unavailableTitle}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm font-semibold leading-7 text-slate-600">
          {unavailableBody}
        </p>
        <Link
          href="/notices"
          className="mt-7 inline-flex items-center gap-2 rounded-md bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-[0_12px_30px_rgba(15,23,42,0.16)] hover:bg-cyan-700"
        >
          <ArrowLeft size={18} />
          {noticeTopLabel}
        </Link>
      </section>
    </main>
  );
}
