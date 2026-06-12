export type NoticeTemplate = {
  categoryId: string;
  title: string;
  body: string;
  updatedAt: string;
};

const storageKey = "notice-category-templates";

export function getNoticeTemplates() {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    return JSON.parse(window.localStorage.getItem(storageKey) ?? "{}") as Record<
      string,
      NoticeTemplate
    >;
  } catch {
    return {};
  }
}

export function getNoticeTemplate(categoryId: string) {
  return getNoticeTemplates()[categoryId] ?? null;
}

export function setNoticeTemplate(categoryId: string, title: string, body: string) {
  if (typeof window === "undefined") {
    return;
  }

  const templates = getNoticeTemplates();
  templates[categoryId] = {
    categoryId,
    title,
    body,
    updatedAt: new Date().toISOString()
  };
  window.localStorage.setItem(storageKey, JSON.stringify(templates));
}
