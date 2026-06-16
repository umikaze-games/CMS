import { NextResponse } from "next/server";
import { normalizeCategories, otherCategoryId } from "@/lib/admin-categories";
import { getLocalCategories, saveLocalCategories } from "@/lib/local-category-store";
import { reassignLocalNoticesByCategoryIds } from "@/lib/local-notice-store";
import { getPublicCategories } from "@/lib/notices";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { NoticeCategory } from "@/lib/types";

const saveFailed = "\u30ab\u30c6\u30b4\u30ea\u30fc\u306e\u4fdd\u5b58\u306b\u5931\u6557\u3057\u307e\u3057\u305f\u3002";
const invalidCategories =
  "\u30ab\u30c6\u30b4\u30ea\u30fc\u304c\u6b63\u3057\u304f\u3042\u308a\u307e\u305b\u3093\u3002";

export async function GET() {
  return NextResponse.json({ categories: await getPublicCategories() });
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as { categories?: unknown } | null;
    const categories = readCategories(body?.categories);

    if (categories.length === 0) {
      return NextResponse.json({ message: invalidCategories }, { status: 400 });
    }

    if (!supabaseAdmin) {
      const currentCategories = await getLocalCategories();
      const deleteIds = getDeletedCategoryIds(currentCategories, categories);
      await reassignLocalNoticesByCategoryIds(deleteIds, otherCategoryId);
      return NextResponse.json({
        categories: await saveLocalCategories(categories),
        local: true
      });
    }

    const rows = categories.map((category) => ({
      id: category.id,
      name: category.name,
      color: category.color,
      sort_order: category.sortOrder,
      updated_at: new Date().toISOString()
    }));

    const { error: upsertError } = await supabaseAdmin.from("notice_categories").upsert(rows);

    if (upsertError) {
      throw upsertError;
    }

    const { data: existingRows, error: existingError } = await supabaseAdmin
      .from("notice_categories")
      .select("id");

    if (existingError) {
      throw existingError;
    }

    const nextIds = new Set(categories.map((category) => category.id));
    const deleteIds =
      existingRows
        ?.map((row) => String(row.id))
        .filter((id) => id !== otherCategoryId && !nextIds.has(id)) ?? [];

    if (deleteIds.length > 0) {
      const { error: noticeUpdateError } = await supabaseAdmin
        .from("notices")
        .update({ category_id: otherCategoryId })
        .in("category_id", deleteIds);

      if (noticeUpdateError) {
        throw noticeUpdateError;
      }

      const { error: deleteError } = await supabaseAdmin
        .from("notice_categories")
        .delete()
        .in("id", deleteIds);

      if (deleteError) {
        throw deleteError;
      }
    }

    return NextResponse.json({ categories });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : saveFailed },
      { status: 400 }
    );
  }
}

function getDeletedCategoryIds(
  currentCategories: NoticeCategory[],
  nextCategories: NoticeCategory[]
) {
  const nextIds = new Set(nextCategories.map((category) => category.id));
  return currentCategories
    .map((category) => category.id)
    .filter((id) => id !== otherCategoryId && !nextIds.has(id));
}

function readCategories(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return normalizeCategories(
    value.flatMap((item): NoticeCategory[] => {
      if (!item || typeof item !== "object") {
        return [];
      }

      const id = "id" in item ? String(item.id).trim() : "";
      const name = "name" in item ? String(item.name).trim() : "";
      const color = "color" in item ? String(item.color).trim() : "";
      const sortOrder = "sortOrder" in item ? Number(item.sortOrder) : 50;

      if (!id || !name) {
        return [];
      }

      return [{ id, name, color, sortOrder }];
    })
  );
}
