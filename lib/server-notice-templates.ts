import { getLocalNoticeTemplates, saveLocalNoticeTemplate } from "@/lib/local-notice-template-store";
import type { NoticeTemplate, NoticeTemplateMap } from "@/lib/notice-templates";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function getNoticeTemplates() {
  if (!supabaseAdmin) {
    return getLocalNoticeTemplates();
  }

  const { data, error } = await supabaseAdmin
    .from("notice_templates")
    .select("category_id,title,body,updated_at");

  if (error || !data) {
    return getLocalNoticeTemplates();
  }

  return Object.fromEntries(
    data.map((row) => [
      String(row.category_id),
      {
        categoryId: String(row.category_id),
        title: String(row.title ?? ""),
        body: String(row.body ?? ""),
        updatedAt: String(row.updated_at)
      }
    ])
  ) satisfies NoticeTemplateMap;
}

export async function saveNoticeTemplate(template: NoticeTemplate) {
  if (!supabaseAdmin) {
    return saveLocalNoticeTemplate(template);
  }

  const { error } = await supabaseAdmin.from("notice_templates").upsert({
    category_id: template.categoryId,
    title: template.title,
    body: template.body,
    updated_at: template.updatedAt
  });

  if (error) {
    return saveLocalNoticeTemplate(template);
  }

  return template;
}
