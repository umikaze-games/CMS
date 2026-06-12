"use client";

import { X } from "lucide-react";
import { CategoryBadge } from "@/components/category-badge";
import { NoticeBody } from "@/components/notice-body";
import { formatDateWithTime } from "@/lib/date";
import type { NoticeCategory } from "@/lib/types";

const labels = {
  title: "\u4fdd\u5b58\u524d\u30ec\u30d3\u30e5\u30fc",
  lead:
    "\u30d5\u30ed\u30f3\u30c8\u5074\u3067\u8868\u793a\u3055\u308c\u308b\u898b\u3048\u65b9\u3092\u78ba\u8a8d\u3057\u3066\u304f\u3060\u3055\u3044\u3002",
  publishAt: "\u516c\u958b\u65e5",
  edit: "\u623b\u3063\u3066\u4fee\u6b63",
  save: "\u554f\u984c\u306a\u3044\u306e\u3067\u4fdd\u5b58"
};

type ReviewData = {
  title: string;
  body: string;
  category?: NoticeCategory;
  publishAt: string;
  bannerUrl: string | null;
};

type AdminNoticeReviewDialogProps = {
  open: boolean;
  data: ReviewData | null;
  saving: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function AdminNoticeReviewDialog({
  open,
  data,
  saving,
  onCancel,
  onConfirm
}: AdminNoticeReviewDialogProps) {
  if (!open || !data) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/42 px-4 py-5 backdrop-blur-sm">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-white/80 bg-white shadow-[0_28px_90px_rgba(15,23,42,0.28)]">
        <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="text-xl font-black text-slate-950">{labels.title}</h2>
            <p className="mt-1 text-sm text-slate-600">{labels.lead}</p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        <article className="bg-[#f4f8ff] p-4">
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_18px_46px_rgba(15,23,42,0.10)]">
            {data.bannerUrl ? (
              <div className="relative h-44 bg-slate-100">
                <img src={data.bannerUrl} alt="" className="h-full w-full object-cover" />
              </div>
            ) : null}
            <div className="p-5">
              <div className="mb-3 flex flex-wrap items-center gap-3">
                {data.category ? <CategoryBadge category={data.category} /> : null}
                <span className="text-sm font-bold text-slate-500">
                  {labels.publishAt}: {formatDateWithTime(data.publishAt)}
                </span>
              </div>
              <h1 className="mb-4 text-2xl font-black leading-tight text-slate-950">
                {data.title}
              </h1>
              <div className="border-t border-slate-200 pt-4 text-sm leading-7 text-slate-700">
                <NoticeBody body={data.body} />
              </div>
            </div>
          </div>
        </article>

        <div className="flex justify-end gap-3 border-t border-slate-100 bg-white px-5 py-4">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-700 hover:bg-slate-50"
          >
            {labels.edit}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={saving}
            className="rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-5 py-2.5 text-sm font-black text-white shadow-[0_16px_34px_rgba(8,145,178,0.22)] disabled:opacity-60"
          >
            {labels.save}
          </button>
        </div>
      </div>
    </div>
  );
}
