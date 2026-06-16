"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ChangeEvent, FormEvent } from "react";
import { useEffect, useState } from "react";
import { FileText, Save, UploadCloud } from "lucide-react";
import {
  AdminDateTimePicker,
  defaultLocalDateTime
} from "@/components/admin-date-time-picker";
import { AdminNoticeReviewDialog } from "@/components/admin-notice-review-dialog";
import { AdminRichTextEditor } from "@/components/admin-rich-text-editor";
import { AdminSelect } from "@/components/admin-select";
import { getSaveResponseMessage } from "@/lib/admin-save-response";
import { validateAdminBannerFile } from "@/lib/admin-upload";
import { loadGameTitles, subscribeGameTitlesChange } from "@/lib/admin-game-titles";
import { addDaysLocalDateTime, formatDateTimeLocal } from "@/lib/date";
import { getNoticeTemplate } from "@/lib/notice-templates";
import type { GameTitle, NoticeCategory, NoticeWithCategory } from "@/lib/types";
import type { NoticeStatus } from "@/lib/types";

const labels = {
  save: "\u4fdd\u5b58",
  saving: "\u4fdd\u5b58\u4e2d",
  saveError: "\u4fdd\u5b58\u306b\u5931\u6557\u3057\u307e\u3057\u305f\u3002",
  title: "\u304a\u77e5\u3089\u305b\u306e\u30bf\u30a4\u30c8\u30eb",
  titlePlaceholder: "\u4f8b\uff1a\u30e1\u30f3\u30c6\u30ca\u30f3\u30b9\u306e\u304a\u77e5\u3089\u305b",
  game: "\u30b2\u30fc\u30e0\u30bf\u30a4\u30c8\u30eb",
  category: "\u30ab\u30c6\u30b4\u30ea\u30fc",
  status: "\u516c\u958b\u72b6\u614b",
  draft: "\u4e0b\u66f8\u304d",
  published: "\u516c\u958b / \u4e88\u7d04\u516c\u958b",
  hidden: "\u975e\u516c\u958b",
  banner: "\u753b\u50cf\u30d0\u30ca\u30fc",
  upload: "\u30af\u30ea\u30c3\u30af\u3057\u3066\u753b\u50cf\u3092\u30a2\u30c3\u30d7\u30ed\u30fc\u30c9",
  uploaded: "\u753b\u50cf\u9078\u629e\u6e08\u307f",
  body: "\u672c\u6587",
  bodyPlaceholder:
    "\u672c\u6587\u3092\u5165\u529b\u3002\u7d75\u6587\u5b57\u3068\u6539\u884c\u306f\u305d\u306e\u307e\u307e\u30d5\u30ed\u30f3\u30c8\u306b\u53cd\u6620\u3055\u308c\u307e\u3059\u3002",
  bodyHelp:
    "Win + . \u3067 Windows 11 \u306e\u7d75\u6587\u5b57\u5165\u529b\u304c\u4f7f\u3048\u307e\u3059\u3002\u753b\u50cf\u3092\u672c\u6587\u306b\u8cbc\u308a\u4ed8\u3051\u308b\u3068\u672c\u6587\u5185\u753b\u50cf\u3068\u3057\u3066\u633f\u5165\u3055\u308c\u307e\u3059\u3002",
  publishAt: "\u4e88\u7d04\u516c\u958b\u65e5\u6642",
  useReservation: "\u4e88\u7d04\u516c\u958b\u65e5\u6642",
  publishHelp:
    "\u6307\u5b9a\u3057\u305f\u5e74\u6708\u65e5\u6642\u5206\u4ee5\u964d\u306b\u30d5\u30ed\u30f3\u30c8\u5074\u3078\u8868\u793a\u3055\u308c\u307e\u3059\u3002",
  newBadgeStart: "\u958b\u59cb\u65e5\u6642",
  newBadgeEnd: "\u7d42\u4e86\u65e5\u6642",
  newBadgePeriod: "NEW\u8868\u793a\u671f\u9593",
  newBadgeHelp:
    "\u958b\u59cb\u65e5\u6642\u306f\u516c\u958b\u65e5\u6642\u3092\u521d\u671f\u5024\u306b\u3057\u3001\u7d42\u4e86\u65e5\u6642\u306f7\u65e5\u5f8c\u3092\u81ea\u52d5\u8a2d\u5b9a\u3057\u307e\u3059\u3002\u7d42\u4e86\u65e5\u6642\u306f\u624b\u52d5\u3067\u5909\u66f4\u3067\u304d\u307e\u3059\u3002",
  sortOrder: "\u8868\u793a\u9806",
  pin: "TOP\u306b\u56fa\u5b9a\u3059\u308b",
  pinHelp:
    "TOP\u56fa\u5b9a\u3067\u304d\u308b\u304a\u77e5\u3089\u305b\u306f\u30b2\u30fc\u30e0\u3054\u3068\u306b1\u4ef6\u3060\u3051\u3067\u3059\u3002\u65b0\u3057\u304f\u56fa\u5b9a\u3059\u308b\u3068\u4ed6\u306e\u56fa\u5b9a\u306f\u89e3\u9664\u3055\u308c\u307e\u3059\u3002",
  insertImage: "\u753b\u50cf\u8cbc\u308a\u4ed8\u3051\u5bfe\u5fdc",
  emoji: "\u7d75\u6587\u5b57OK",
  reviewSave: "\u30ec\u30d3\u30e5\u30fc\u3057\u3066\u4fdd\u5b58",
  loadTemplate: "\u30c6\u30f3\u30d7\u30ec\u30fc\u30c8\u8aad\u307f\u8fbc\u307f",
  templateMissing:
    "\u9078\u629e\u4e2d\u306e\u30ab\u30c6\u30b4\u30ea\u30fc\u306b\u30c6\u30f3\u30d7\u30ec\u30fc\u30c8\u304c\u767b\u9332\u3055\u308c\u3066\u3044\u307e\u305b\u3093\u3002"
};

type AdminNoticeFormProps = {
  categories: NoticeCategory[];
  games: GameTitle[];
  currentGameId: string;
  notice?: NoticeWithCategory;
};

type ReviewData = {
  title: string;
  body: string;
  category?: NoticeCategory;
  publishAt: string;
  bannerUrl: string | null;
};

const inputClass =
  "rounded-xl border border-line bg-white px-4 py-3 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100";

export function AdminNoticeForm({ categories, games, currentGameId, notice }: AdminNoticeFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [titleValue, setTitleValue] = useState(notice?.title ?? "");
  const [bodyValue, setBodyValue] = useState(notice?.body ?? "");
  const [bannerPreview, setBannerPreview] = useState<string | null>(notice?.bannerImage ?? null);
  const [bannerFileName, setBannerFileName] = useState<string | null>(null);
  const [gameItems, setGameItems] = useState(games);
  const [gameValue, setGameValue] = useState(notice?.gameId ?? currentGameId);
  const [categoryValue, setCategoryValue] = useState(notice?.categoryId ?? categories[0]?.id ?? "");
  const [statusValue, setStatusValue] = useState(notice?.status ?? "draft");
  const [reservationEnabled, setReservationEnabled] = useState(() =>
    notice ? new Date(notice.publishAt).getTime() > Date.now() : false
  );
  const [publishValue, setPublishValue] = useState(
    notice ? formatDateTimeLocal(notice.publishAt) : defaultLocalDateTime()
  );
  const [newBadgeStartValue, setNewBadgeStartValue] = useState(() => {
    if (notice?.newBadgeStartAt) {
      return formatDateTimeLocal(notice.newBadgeStartAt);
    }
    const publishAt = notice ? formatDateTimeLocal(notice.publishAt) : defaultLocalDateTime();
    return publishAt;
  });
  const [newBadgeEndValue, setNewBadgeEndValue] = useState(() => {
    if (notice?.newBadgeEndAt) {
      return formatDateTimeLocal(notice.newBadgeEndAt);
    }
    const publishAt = notice ? formatDateTimeLocal(notice.publishAt) : defaultLocalDateTime();
    return addDaysLocalDateTime(publishAt, 7);
  });
  const [pendingFormData, setPendingFormData] = useState<FormData | null>(null);
  const [reviewData, setReviewData] = useState<ReviewData | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  useEffect(() => {
    const syncGames = () => setGameItems(loadGameTitles(games));
    syncGames();
    return subscribeGameTitlesChange(syncGames);
  }, [games]);

  useEffect(() => {
    if (gameItems.length > 0 && !gameItems.some((game) => game.id === gameValue)) {
      setGameValue(gameItems[0].id);
    }
  }, [gameItems, gameValue]);

  useEffect(() => {
    if (currentGameId && gameItems.some((game) => game.id === currentGameId)) {
      setGameValue(currentGameId);
    }
  }, [currentGameId, gameItems]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const effectivePublishValue = reservationEnabled ? publishValue : currentLocalDateTime();
    const effectiveNewBadgeStartValue = reservationEnabled ? newBadgeStartValue : effectivePublishValue;
    const effectiveNewBadgeEndValue = reservationEnabled
      ? newBadgeEndValue
      : addDaysLocalDateTime(effectivePublishValue, 7);

    formData.set("title", titleValue);
    formData.set("body", bodyValue);
    formData.set("publish_at", effectivePublishValue);
    formData.set("new_badge_start_at", effectiveNewBadgeStartValue);
    formData.set("new_badge_end_at", effectiveNewBadgeEndValue);

    const selectedCategory = categories.find((category) => category.id === categoryValue);
    const uploadedBanner = formData.get("banner_image");
    const bannerError =
      uploadedBanner instanceof File && uploadedBanner.size > 0
        ? validateAdminBannerFile(uploadedBanner)
        : null;

    if (bannerError) {
      setMessage(bannerError);
      return;
    }

    const bannerUrl =
      uploadedBanner instanceof File && uploadedBanner.size > 0
        ? await fileToDataUrl(uploadedBanner)
        : notice?.bannerImage ?? null;

    setPendingFormData(formData);
    setReviewData({
      title: String(formData.get("title") ?? ""),
      body: bodyValue,
      category: selectedCategory,
      publishAt: effectivePublishValue,
      bannerUrl
    });
    setIsReviewOpen(true);
  }

  async function saveFormData(formData: FormData) {
    setMessage(null);
    setIsSaving(true);

    const endpoint = notice ? `/api/admin/notices/${notice.id}` : "/api/admin/notices";
    const method = notice ? "PUT" : "POST";

    try {
      const response = await fetch(endpoint, {
        method,
        body: formData
      });
      if (!response.ok) {
        throw new Error(await getSaveResponseMessage(response));
      }

      router.push(`/admin/notices?game=${formData.get("game_id")}`);
      router.refresh();
    } catch (error) {
      setIsReviewOpen(false);
      setMessage(error instanceof Error ? error.message : labels.saveError);
    } finally {
      setIsSaving(false);
    }
  }

  function confirmReviewSave() {
    if (!pendingFormData) {
      return;
    }
    void saveFormData(pendingFormData);
  }

  function handlePublishChange(nextValue: string) {
    const currentDefaultStart = publishValue;
    const currentDefaultEnd = addDaysLocalDateTime(publishValue, 7);
    setPublishValue(nextValue);

    if (newBadgeStartValue === currentDefaultStart) {
      setNewBadgeStartValue(nextValue);
    }

    if (newBadgeEndValue === currentDefaultEnd) {
      setNewBadgeEndValue(addDaysLocalDateTime(nextValue, 7));
    }
  }

  function handleNewBadgeStartChange(nextValue: string) {
    const currentDefaultEnd = addDaysLocalDateTime(newBadgeStartValue, 7);
    setNewBadgeStartValue(nextValue);

    if (newBadgeEndValue === currentDefaultEnd) {
      setNewBadgeEndValue(addDaysLocalDateTime(nextValue, 7));
    }
  }

  function handleGameChange(nextGameId: string) {
    setGameValue(nextGameId);
    const params = new URLSearchParams(searchParams.toString());
    params.set("game", nextGameId);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function loadSelectedTemplate() {
    const template = getNoticeTemplate(categoryValue);
    if (!template) {
      setMessage(labels.templateMissing);
      return;
    }

    const selectedGame = gameItems.find((game) => game.id === gameValue);
    const gameName = selectedGame?.name ?? "";

    setMessage(null);
    setTitleValue(applyTemplateVariables(template.title, gameName));
    setBodyValue(applyTemplateVariables(template.body, gameName));
  }

  async function handleBannerChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0] ?? null;

    if (!file) {
      setMessage(null);
      setBannerFileName(null);
      setBannerPreview(notice?.bannerImage ?? null);
      return;
    }

    const bannerError = validateAdminBannerFile(file);
    if (bannerError) {
      setMessage(bannerError);
      setBannerFileName(null);
      setBannerPreview(notice?.bannerImage ?? null);
      event.currentTarget.value = "";
      return;
    }

    setMessage(null);
    setBannerFileName(file.name);
    setBannerPreview(await fileToDataUrl(file));
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_24px_70px_rgba(15,23,42,0.08)]"
    >
      {message ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          {message}
        </div>
      ) : null}
      <div className="grid gap-4 md:grid-cols-2">
        <AdminSelect
          label={labels.game}
          name="game_id"
          value={gameValue}
          onChange={handleGameChange}
          options={gameItems.map((game) => ({ label: game.name, value: game.id }))}
        />
        <AdminSelect
          label={labels.category}
          name="category_id"
          value={categoryValue}
          onChange={setCategoryValue}
          options={categories.map((category) => ({ label: category.name, value: category.id }))}
        />
      </div>

      <label className="grid gap-2 text-sm font-bold text-ink">
        <span className="flex items-center justify-between gap-3">
          {labels.title}
          <button
            type="button"
            onClick={loadSelectedTemplate}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-cyan-50 px-3 text-xs font-black text-cyan-700 hover:bg-cyan-100"
            title={labels.loadTemplate}
          >
            <FileText size={15} />
            {labels.loadTemplate}
          </button>
        </span>
        <input
          name="title"
          value={titleValue}
          onChange={(event) => setTitleValue(event.target.value)}
          className={inputClass}
          placeholder={labels.titlePlaceholder}
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <AdminSelect
          label={labels.status}
          name="status"
          value={statusValue}
          onChange={(value) => setStatusValue(value as NoticeStatus)}
          options={[
            { label: labels.draft, value: "draft" },
            { label: labels.published, value: "published" },
            { label: labels.hidden, value: "hidden" }
          ]}
        />
        <AdminDateTimePicker
          label={
            <label className="inline-flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={reservationEnabled}
                onChange={(event) => setReservationEnabled(event.target.checked)}
                className="h-5 w-5 rounded border-slate-300 accent-cyan-600"
              />
              {labels.useReservation}
            </label>
          }
          name="publish_at"
          value={publishValue}
          onChange={handlePublishChange}
          labelAside={labels.publishHelp}
          disabled={!reservationEnabled}
        />
      </div>

      <fieldset className="rounded-xl border border-cyan-100 bg-cyan-50/35 p-4">
        <legend className="sr-only">{labels.newBadgePeriod}</legend>
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-sm font-black text-ink">{labels.newBadgePeriod}</p>
            <p className="mt-1 text-xs font-semibold text-muted">{labels.newBadgeHelp}</p>
          </div>
        </div>
        <div className="grid items-start gap-3 md:grid-cols-[1fr_auto_1fr]">
          <AdminDateTimePicker
            label={labels.newBadgeStart}
            name="new_badge_start_at"
            value={newBadgeStartValue}
            onChange={handleNewBadgeStartChange}
            reserveHelp
          />
          <div className="hidden h-12 items-center px-1 pt-7 text-lg font-black text-cyan-700 md:flex">
            ～
          </div>
          <AdminDateTimePicker
            label={labels.newBadgeEnd}
            name="new_badge_end_at"
            value={newBadgeEndValue}
            onChange={setNewBadgeEndValue}
            reserveHelp
          />
        </div>
      </fieldset>

      <div className="grid gap-2">
        <label className="text-sm font-bold text-ink" htmlFor="banner">
          {labels.banner}
        </label>
        <label
          htmlFor="banner"
          className="relative flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-lg border border-dashed border-slate-300 bg-[linear-gradient(135deg,#f8fafc,#eef6f2)] px-4 py-5 text-center text-sm font-semibold text-muted transition hover:border-ink hover:bg-white"
        >
          {bannerPreview ? (
            <>
              <img
                src={bannerPreview}
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-85"
              />
              <div className="absolute inset-0 bg-slate-950/35" />
              <div className="relative z-10 inline-flex flex-col items-center gap-1 rounded-xl bg-white/92 px-4 py-2 text-slate-900 shadow-[0_12px_30px_rgba(15,23,42,0.16)] backdrop-blur">
                <span className="text-sm font-black text-cyan-700">{labels.uploaded}</span>
                <span className="max-w-[720px] truncate text-xs font-bold text-slate-600">
                  {bannerFileName ?? notice?.bannerImage ?? ""}
                </span>
              </div>
            </>
          ) : (
            <>
              <UploadCloud size={28} />
              <span>{labels.upload}</span>
            </>
          )}
        </label>
        <input
          id="banner"
          name="banner_image"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => void handleBannerChange(event)}
        />
      </div>

      <div className="grid gap-2">
        <span className="text-sm font-bold text-ink">{labels.body}</span>
        <AdminRichTextEditor
          value={bodyValue}
          onChange={setBodyValue}
          help={labels.bodyHelp}
          placeholder={labels.bodyPlaceholder}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <input type="hidden" name="sort_order" value={notice?.sortOrder ?? 0} />
        <label className="flex min-h-[72px] items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-ink">
          <input
            name="is_pinned"
            type="checkbox"
            defaultChecked={notice?.isPinned ?? false}
            className="mt-1 h-4 w-4 accent-ink"
          />
          <span>
            {labels.pin}
            <span className="mt-1 block text-xs font-semibold text-muted">{labels.pinHelp}</span>
          </span>
        </label>
        <div className="flex items-end justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex min-h-[52px] items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-3 text-sm font-black text-white shadow-[0_16px_34px_rgba(8,145,178,0.22)] hover:from-cyan-500 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save size={18} />
          {isSaving ? labels.saving : labels.reviewSave}
        </button>
        </div>
      </div>
      <AdminNoticeReviewDialog
        open={isReviewOpen}
        data={reviewData}
        saving={isSaving}
        onCancel={() => setIsReviewOpen(false)}
        onConfirm={confirmReviewSave}
      />
    </form>
  );
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function currentLocalDateTime() {
  const date = new Date();
  date.setSeconds(0, 0);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

function applyTemplateVariables(value: string, gameName: string) {
  if (!gameName) {
    return value;
  }

  return value
    .replaceAll("\u30bf\u30a4\u30c8\u30eb\u540d", gameName)
    .replaceAll("{{gameTitle}}", gameName)
    .replaceAll("{gameTitle}", gameName);
}
