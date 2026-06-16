import { promises as fs } from "fs";
import path from "path";
import type { NoticeTemplate, NoticeTemplateMap } from "@/lib/notice-templates";

const storePath = path.join(process.cwd(), ".local-notice-templates.json");

export async function getLocalNoticeTemplates() {
  return readStore();
}

export async function saveLocalNoticeTemplate(template: NoticeTemplate) {
  const templates = await readStore();
  const nextTemplates = {
    ...templates,
    [template.categoryId]: template
  };
  await writeStore(nextTemplates);
  return template;
}

async function readStore() {
  try {
    const content = await fs.readFile(storePath, "utf8");
    return normalizeTemplates(JSON.parse(content) as NoticeTemplateMap);
  } catch (error) {
    if (!isNotFoundError(error)) {
      throw error;
    }

    await writeStore({});
    return {};
  }
}

async function writeStore(templates: NoticeTemplateMap) {
  await fs.writeFile(storePath, JSON.stringify(normalizeTemplates(templates), null, 2), "utf8");
}

function normalizeTemplates(templates: NoticeTemplateMap) {
  return Object.fromEntries(
    Object.entries(templates).flatMap(([categoryId, template]) => {
      const id = String(template?.categoryId ?? categoryId).trim();
      if (!id) {
        return [];
      }

      return [
        [
          id,
          {
            categoryId: id,
            title: String(template?.title ?? ""),
            body: String(template?.body ?? ""),
            updatedAt: String(template?.updatedAt ?? new Date().toISOString())
          }
        ]
      ];
    })
  ) satisfies NoticeTemplateMap;
}

function isNotFoundError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === "ENOENT"
  );
}
