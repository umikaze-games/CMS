import { noticeCategories } from "@/lib/mock-data";
import type { NoticeCategory } from "@/lib/types";

export const otherCategoryId = "other";

export function createCategoryId(name: string) {
  return (
    name
      .trim()
      .toLocaleLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "category"
  );
}

export function normalizeCategories(categories: NoticeCategory[]) {
  const seen = new Set<string>();
  const nextCategories = categories.flatMap((category, index): NoticeCategory[] => {
    const id = category.id.trim();
    const name = category.name.trim();

    if (!id || !name || seen.has(id)) {
      return [];
    }

    seen.add(id);
    return [
      {
        id,
        name,
        color: normalizeColor(category.color),
        sortOrder: index + 1
      }
    ];
  });

  return ensureOtherCategory(nextCategories);
}

export function ensureOtherCategory(categories: NoticeCategory[]) {
  const otherCategory =
    categories.find((category) => category.id === otherCategoryId) ??
    noticeCategories.find((category) => category.id === otherCategoryId) ?? {
      id: otherCategoryId,
      name: "\u305d\u306e\u4ed6",
      color: "#475467",
      sortOrder: categories.length + 1
    };

  const withoutOther = categories.filter((category) => category.id !== otherCategoryId);
  return [...withoutOther, { ...otherCategory, sortOrder: withoutOther.length + 1 }];
}

function normalizeColor(color: string) {
  return /^#[0-9a-f]{6}$/i.test(color) ? color : "#475467";
}
