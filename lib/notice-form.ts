import type { NoticeStatus } from "@/lib/types";
import { addDaysLocalDateTime } from "@/lib/date";

export function readNoticeFormData(formData: FormData) {
  const gameId = String(formData.get("game_id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const categoryId = String(formData.get("category_id") ?? "");
  const status = String(formData.get("status") ?? "draft") as NoticeStatus;
  const publishAt = String(formData.get("publish_at") ?? "");
  const newBadgeStartAt = String(formData.get("new_badge_start_at") ?? "").trim();
  const newBadgeEndAt = String(formData.get("new_badge_end_at") ?? "").trim();
  const sortOrder = Number(formData.get("sort_order") ?? 50);
  const isPinned = formData.get("is_pinned") === "on" || formData.get("is_pinned") === "true";
  const banner = formData.get("banner_image");

  if (!gameId || !title || !body || !categoryId || !publishAt) {
    throw new Error(
      "\u30b2\u30fc\u30e0\u3001\u30bf\u30a4\u30c8\u30eb\u3001\u672c\u6587\u3001\u30ab\u30c6\u30b4\u30ea\u30fc\u3001\u4e88\u7d04\u516c\u958b\u65e5\u6642\u306f\u5fc5\u9808\u3067\u3059\u3002"
    );
  }

  const resolvedNewBadgeStartAt = newBadgeStartAt || publishAt;
  const resolvedNewBadgeEndAt = newBadgeEndAt || addDaysLocalDateTime(resolvedNewBadgeStartAt, 7);

  if (
    new Date(resolvedNewBadgeStartAt).getTime() >= new Date(resolvedNewBadgeEndAt).getTime()
  ) {
    throw new Error(
      "NEW\u30d0\u30c3\u30b8\u306e\u7d42\u4e86\u65e5\u6642\u306f\u958b\u59cb\u65e5\u6642\u3088\u308a\u5f8c\u306b\u8a2d\u5b9a\u3057\u3066\u304f\u3060\u3055\u3044\u3002"
    );
  }

  return {
    gameId,
    title,
    body,
    categoryId,
    status,
    publishAt,
    sortOrder: Number.isFinite(sortOrder) ? sortOrder : 50,
    isPinned,
    newBadgeStartAt: resolvedNewBadgeStartAt,
    newBadgeEndAt: resolvedNewBadgeEndAt,
    banner: banner instanceof File && banner.size > 0 ? banner : null
  };
}

export function slugifyFileName(name: string) {
  const extension = name.split(".").pop() || "jpg";
  const safeName = name
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return `${safeName || "banner"}-${Date.now()}.${extension}`;
}
