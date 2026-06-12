import { gameTitles, noticeCategories } from "@/lib/mock-data";
import { getLocalNotices } from "@/lib/local-notice-store";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { Notice, NoticeWithCategory } from "@/lib/types";

function withCategory(notice: Notice): NoticeWithCategory {
  const category = noticeCategories.find((item) => item.id === notice.categoryId);

  if (!category) {
    throw new Error(`Category not found: ${notice.categoryId}`);
  }

  return {
    ...notice,
    category
  };
}

function byPublicOrder(a: NoticeWithCategory, b: NoticeWithCategory) {
  if (a.isPinned !== b.isPinned) {
    return a.isPinned ? -1 : 1;
  }

  if (a.sortOrder !== b.sortOrder) {
    return a.sortOrder - b.sortOrder;
  }

  return new Date(b.publishAt).getTime() - new Date(a.publishAt).getTime();
}

export function getCategories() {
  return [...noticeCategories].sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getGameTitles() {
  return [...gameTitles];
}

export function getDefaultGameId() {
  return gameTitles[0]?.id ?? "default";
}

function fromNoticeRow(row: Record<string, any>): Notice {
  return {
    id: String(row.id),
    gameId: String(row.game_id ?? getDefaultGameId()),
    categoryId: String(row.category_id),
    title: String(row.title),
    body: String(row.body),
    bannerImage: row.banner_image ? String(row.banner_image) : null,
    status: row.status,
    isPinned: Boolean(row.is_pinned),
    publishAt: String(row.publish_at),
    newBadgeStartAt: row.new_badge_start_at ? String(row.new_badge_start_at) : null,
    newBadgeEndAt: row.new_badge_end_at ? String(row.new_badge_end_at) : null,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
    sortOrder: Number(row.sort_order ?? 50)
  };
}

function fromCategoryRow(row: Record<string, any>) {
  return {
    id: String(row.id),
    name: String(row.name),
    color: String(row.color),
    sortOrder: Number(row.sort_order ?? 50)
  };
}

async function getDbCategories() {
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("notice_categories")
    .select("id,name,color,sort_order")
    .order("sort_order", { ascending: true });

  if (error || !data) {
    return null;
  }

  return data.map(fromCategoryRow);
}

export async function getPublicCategories() {
  return (await getDbCategories()) ?? getCategories();
}

export async function getPublicNotices(categoryId?: string, gameId?: string) {
  if (supabase) {
    let query = supabase
      .from("notices")
      .select(
        "id,game_id,category_id,title,body,banner_image,status,is_pinned,publish_at,new_badge_start_at,new_badge_end_at,created_at,updated_at,sort_order,category:notice_categories(id,name,color,sort_order)"
      )
      .eq("status", "published")
      .lte("publish_at", new Date().toISOString())
      .order("is_pinned", { ascending: false })
      .order("sort_order", { ascending: true })
      .order("publish_at", { ascending: false });

    if (gameId) {
      query = query.eq("game_id", gameId);
    }

    if (categoryId) {
      query = query.eq("category_id", categoryId);
    }

    const { data, error } = await query;

    if (!error && data) {
      return data.map((row: any) => ({
        ...fromNoticeRow(row),
        category: fromCategoryRow(Array.isArray(row.category) ? row.category[0] : row.category)
      }));
    }
  }

  const now = Date.now();

  const localNotices = await getLocalNotices();

  return localNotices
    .filter((notice) => notice.status === "published")
    .filter((notice) => (gameId ? notice.gameId === gameId : true))
    .filter((notice) => new Date(notice.publishAt).getTime() <= now)
    .filter((notice) => (categoryId ? notice.categoryId === categoryId : true))
    .map(withCategory)
    .sort(byPublicOrder);
}

export async function getNoticeById(id: string) {
  if (supabase) {
    const { data, error } = await supabase
      .from("notices")
      .select(
        "id,game_id,category_id,title,body,banner_image,status,is_pinned,publish_at,new_badge_start_at,new_badge_end_at,created_at,updated_at,sort_order,category:notice_categories(id,name,color,sort_order)"
      )
      .eq("id", id)
      .single();

    if (!error && data) {
      return {
        ...fromNoticeRow(data),
        category: fromCategoryRow(Array.isArray((data as any).category) ? (data as any).category[0] : (data as any).category)
      };
    }
  }

  const localNotices = await getLocalNotices();
  const notice = localNotices.find((item) => item.id === id);
  return notice ? withCategory(notice) : null;
}

export async function getAdminNotices(gameId = getDefaultGameId()) {
  if (supabaseAdmin) {
    const { data, error } = await supabaseAdmin
      .from("notices")
      .select(
        "id,game_id,category_id,title,body,banner_image,status,is_pinned,publish_at,new_badge_start_at,new_badge_end_at,created_at,updated_at,sort_order,category:notice_categories(id,name,color,sort_order)"
      )
      .eq("game_id", gameId)
      .order("updated_at", { ascending: false });

    if (!error && data) {
      return data.map((row: any) => ({
        ...fromNoticeRow(row),
        category: fromCategoryRow(Array.isArray(row.category) ? row.category[0] : row.category)
      }));
    }
  }

  const localNotices = await getLocalNotices();

  return localNotices
    .filter((notice) => notice.gameId === gameId)
    .map(withCategory)
    .sort(byPublicOrder);
}
