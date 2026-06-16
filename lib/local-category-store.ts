import { promises as fs } from "fs";
import path from "path";
import { normalizeCategories } from "@/lib/admin-categories";
import { noticeCategories as seedCategories } from "@/lib/mock-data";
import type { NoticeCategory } from "@/lib/types";

const storePath = path.join(process.cwd(), ".local-categories.json");

export async function getLocalCategories() {
  return readStore();
}

export async function saveLocalCategories(categories: NoticeCategory[]) {
  const nextCategories = normalizeCategories(categories);
  await writeStore(nextCategories);
  return nextCategories;
}

async function readStore() {
  try {
    const content = await fs.readFile(storePath, "utf8");
    return normalizeCategories(JSON.parse(content) as NoticeCategory[]);
  } catch (error) {
    if (!isNotFoundError(error)) {
      throw error;
    }

    await writeStore(seedCategories);
    return [...seedCategories];
  }
}

async function writeStore(categories: NoticeCategory[]) {
  await fs.writeFile(storePath, JSON.stringify(normalizeCategories(categories), null, 2), "utf8");
}

function isNotFoundError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === "ENOENT"
  );
}
