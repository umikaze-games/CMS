import { promises as fs } from "fs";
import path from "path";
import { migrateLocalBannerDataUrls } from "@/lib/local-banner-store";
import { notices as seedNotices } from "@/lib/mock-data";
import type { Notice, NoticeStatus } from "@/lib/types";

const storePath = path.join(process.cwd(), ".local-notices.json");

type NoticeInput = Omit<Notice, "id" | "createdAt" | "updatedAt">;

export async function getLocalNotices() {
  return readStore();
}

export async function createLocalNotice(input: NoticeInput) {
  const current = await readStore();
  const now = new Date().toISOString();
  const notice: Notice = {
    ...input,
    id: `local-${Date.now()}`,
    createdAt: now,
    updatedAt: now
  };

  const next = input.isPinned
    ? current.map((item) =>
        item.gameId === input.gameId ? { ...item, isPinned: false, updatedAt: now } : item
      )
    : current;
  await writeStore([notice, ...next]);
  return notice;
}

export async function updateLocalNotice(id: string, input: NoticeInput) {
  const current = await readStore();
  const now = new Date().toISOString();
  const next = current.map((item) => {
    if (input.isPinned && item.gameId === input.gameId && item.id !== id) {
      return { ...item, isPinned: false, updatedAt: now };
    }

    if (item.id !== id) {
      return item;
    }

    return {
      ...item,
      ...input,
      updatedAt: now
    };
  });

  await writeStore(next);
}

export async function updateLocalNoticeStatus(id: string, status: NoticeStatus) {
  const current = await readStore();
  const now = new Date().toISOString();
  await writeStore(
    current.map((item) => (item.id === id ? { ...item, status, updatedAt: now } : item))
  );
}

export async function deleteLocalNotice(id: string) {
  const current = await readStore();
  await writeStore(current.filter((item) => item.id !== id));
}

export async function deleteLocalNoticesByGameIds(gameIds: string[]) {
  if (gameIds.length === 0) {
    return;
  }

  const current = await readStore();
  const deleteIds = new Set(gameIds);
  await writeStore(current.filter((item) => !deleteIds.has(item.gameId)));
}

export async function reassignLocalNoticesByCategoryIds(
  categoryIds: string[],
  fallbackCategoryId = "other"
) {
  if (categoryIds.length === 0) {
    return;
  }

  const current = await readStore();
  const now = new Date().toISOString();
  const deleteIds = new Set(categoryIds);
  await writeStore(
    current.map((item) =>
      deleteIds.has(item.categoryId)
        ? { ...item, categoryId: fallbackCategoryId, updatedAt: now }
        : item
    )
  );
}

async function readStore() {
  try {
    const content = await fs.readFile(storePath, "utf8");
    const items = JSON.parse(content) as Notice[];
    const migrated = await migrateLocalBannerDataUrls(items);
    if (migrated.changed) {
      await writeStore(migrated.items);
    }
    return migrated.items;
  } catch (error) {
    if (!isNotFoundError(error)) {
      throw error;
    }

    await writeStore(seedNotices);
    return [...seedNotices];
  }
}

async function writeStore(items: Notice[]) {
  await fs.writeFile(storePath, JSON.stringify(items, null, 2), "utf8");
}

function isNotFoundError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === "ENOENT"
  );
}
