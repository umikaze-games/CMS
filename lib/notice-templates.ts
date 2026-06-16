export type NoticeTemplate = {
  categoryId: string;
  title: string;
  body: string;
  updatedAt: string;
};

export type NoticeTemplateMap = Record<string, NoticeTemplate>;

export function getNoticeTemplate(templates: NoticeTemplateMap, categoryId: string) {
  return templates[categoryId] ?? null;
}

export function createNoticeTemplate(categoryId: string, title: string, body: string) {
  return {
    categoryId,
    title: title.trim(),
    body: body.trim(),
    updatedAt: new Date().toISOString()
  } satisfies NoticeTemplate;
}
