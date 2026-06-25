import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Pin, Zap } from "lucide-react";
import { CategoryBadge } from "@/components/category-badge";
import { formatDateWithTime } from "@/lib/date";
import { getNoticeBannerImage, isDefaultNoticeBannerUrl } from "@/lib/default-notice-banners";
import { isLocalNoticeUploadUrl } from "@/lib/local-upload-path";
import { getNoticeExcerpt } from "@/lib/notice-text";
import type { NoticeWithCategory } from "@/lib/types";

const publishedLabel = "\u516c\u958b";
const updatedLabel = "\u66f4\u65b0";
const detailLabel = "\u8a73\u7d30\u3092\u898b\u308b";

type NoticeCardProps = {
  notice: NoticeWithCategory;
  featured?: boolean;
  isNew?: boolean;
};

export function NoticeCard({ notice, featured = false, isNew = false }: NoticeCardProps) {
  const bannerImage = getNoticeBannerImage(notice);

  return (
    <Link
      href={`/notices/${notice.id}`}
      className="group relative grid overflow-hidden rounded-lg border border-transparent bg-white shadow-[0_8px_22px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-[0_18px_44px_rgba(8,145,178,0.14)] md:grid-cols-[220px_1fr]"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent" />
      <div className="relative aspect-video overflow-hidden bg-slate-100">
        <Image
          src={bannerImage}
          alt=""
          fill
          sizes="(min-width: 768px) 220px, 100vw"
          unoptimized={isLocalNoticeUploadUrl(bannerImage) || isDefaultNoticeBannerUrl(bannerImage)}
          className="object-cover saturate-125 transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/18 via-transparent to-transparent" />
      </div>

      <div className="grid h-full min-w-0 gap-2 px-4 py-3 md:grid-cols-[1fr_220px] md:grid-rows-[auto_1fr_auto] md:gap-x-5 md:px-5 md:py-3">
        <div className="min-w-0 md:row-span-3">
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            <CategoryBadge category={notice.category} isPinned={notice.isPinned} />
            {isNew ? (
              <span className="inline-flex items-center rounded-md bg-rose-600 px-2.5 py-1 text-[11px] font-black text-white shadow-[0_8px_20px_rgba(225,29,72,0.24)]">
                NEW
              </span>
            ) : null}
            {featured && notice.isPinned ? (
              <span className="inline-flex items-center gap-1 rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-black text-amber-700">
                <Zap size={12} />
                TOP NEWS
              </span>
            ) : null}
          </div>

          <h2 className={`${featured ? "text-xl md:text-2xl" : "text-lg md:text-xl"} mb-2 truncate font-black leading-tight tracking-normal text-slate-950`}>
            {notice.title}
          </h2>
          <p className="line-clamp-2 text-sm leading-6 text-slate-600">
            {getNoticeExcerpt(notice.body)}
          </p>
        </div>

        <div className="flex items-start justify-between gap-4 border-t border-slate-100 pt-2 md:col-start-2 md:row-start-1 md:justify-end md:border-t-0 md:pt-0">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-bold text-slate-500 md:justify-end md:text-right">
            {notice.isPinned ? (
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-rose-50 text-rose-600" title="Pinned">
                <Pin size={13} />
              </span>
            ) : null}
            <span>{publishedLabel}: {formatDateWithTime(notice.publishAt)}</span>
            <span>{updatedLabel}: {formatDateWithTime(notice.updatedAt)}</span>
          </div>
        </div>

        <div className="flex justify-end md:col-start-2 md:row-start-3">
          <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-slate-950 px-3 py-2 text-xs font-black text-white transition group-hover:bg-cyan-600">
            {detailLabel}
            <ArrowUpRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
}
