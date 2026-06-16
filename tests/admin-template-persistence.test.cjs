const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { test } = require("node:test");

test("notice templates are persisted through an admin API", () => {
  const route = readFileSync("app/api/admin/templates/route.ts", "utf8");

  assert.match(route, /export async function GET\(\)/);
  assert.match(route, /export async function PUT\(request: Request\)/);
  assert.match(route, /saveNoticeTemplate\(template\)/);
});

test("settings and notice forms receive server templates", () => {
  const settingsPage = readFileSync("app/admin/settings/page.tsx", "utf8");
  const newPage = readFileSync("app/admin/notices/new/page.tsx", "utf8");
  const editPage = readFileSync("app/admin/notices/[id]/edit/page.tsx", "utf8");

  assert.match(settingsPage, /const templates = await getNoticeTemplates\(\)/);
  assert.match(settingsPage, /templates=\{templates\}/);
  assert.match(newPage, /const templates = await getNoticeTemplates\(\)/);
  assert.match(newPage, /templates=\{templates\}/);
  assert.match(editPage, /const templates = await getNoticeTemplates\(\)/);
  assert.match(editPage, /templates=\{templates\}/);
});

test("template client components save and load from props instead of localStorage", () => {
  const settingsPanel = readFileSync("components/admin-settings-panel.tsx", "utf8");
  const noticeForm = readFileSync("components/admin-notice-form.tsx", "utf8");
  const clientTemplateHelpers = readFileSync("lib/notice-templates.ts", "utf8");

  assert.match(settingsPanel, /templates: NoticeTemplateMap/);
  assert.match(settingsPanel, /fetch\("\/api\/admin\/templates"/);
  assert.match(noticeForm, /templates: NoticeTemplateMap/);
  assert.match(noticeForm, /getNoticeTemplate\(templates, categoryValue\)/);
  assert.doesNotMatch(clientTemplateHelpers, /localStorage/);
});

test("local template store and schema support persisted templates", () => {
  const localStore = readFileSync("lib/local-notice-template-store.ts", "utf8");
  const schema = readFileSync("supabase/schema.sql", "utf8");

  assert.match(localStore, /\.local-notice-templates\.json/);
  assert.match(localStore, /export async function saveLocalNoticeTemplate/);
  assert.match(schema, /create table if not exists public\.notice_templates/);
});
