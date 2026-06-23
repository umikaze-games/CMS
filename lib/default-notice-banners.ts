import type { NoticeWithCategory } from "@/lib/types";

const defaultNoticeBannerPrefix = "/default-banners/";

export const defaultNoticeBannerByCategoryId = {
  important: "/default-banners/important.svg",
  maintenance: "/default-banners/maintenance.svg",
  event: "/default-banners/event.svg",
  campaign: "/default-banners/campaign.svg",
  update: "/default-banners/update.svg",
  bug: "/default-banners/bug.svg",
  other: "/default-banners/other.svg"
} as const;

export function getDefaultNoticeBannerUrl(categoryId: string) {
  return (
    defaultNoticeBannerByCategoryId[
      categoryId as keyof typeof defaultNoticeBannerByCategoryId
    ] ?? defaultNoticeBannerByCategoryId.other
  );
}

export function isDefaultNoticeBannerUrl(bannerImage: string | null | undefined) {
  return typeof bannerImage === "string" && bannerImage.startsWith(defaultNoticeBannerPrefix);
}

export function resolveNoticeBannerImage(
  categoryId: string,
  bannerImage: string | null | undefined
) {
  if (bannerImage && !isDefaultNoticeBannerUrl(bannerImage)) {
    return bannerImage;
  }

  return getDefaultNoticeBannerUrl(categoryId);
}

export function getNoticeBannerImage(notice: NoticeWithCategory) {
  return resolveNoticeBannerImage(notice.categoryId, notice.bannerImage);
}
