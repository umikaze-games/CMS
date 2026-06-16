const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { test } = require("node:test");

test("settings category edits persist through the admin API", () => {
  const source = readFileSync("components/admin-settings-panel.tsx", "utf8");

  assert.match(source, /async function persistCategoryItems\(nextCategories: NoticeCategory\[\]\)/);
  assert.match(source, /fetch\("\/api\/admin\/categories"/);
  assert.match(source, /method: "PUT"/);
  assert.match(source, /router\.refresh\(\)/);
});

test("server pages read categories from persistent storage", () => {
  const source = readFileSync("lib/notices.ts", "utf8");

  assert.match(source, /import \{ getLocalCategories \} from "@\/lib\/local-category-store"/);
  assert.match(source, /export async function getPublicCategories\(\)/);
  assert.match(source, /getLocalCategories\(\)/);
});

test("category API reassigns deleted categories to other before deleting", () => {
  const source = readFileSync("app/api/admin/categories/route.ts", "utf8");

  assert.match(source, /reassignLocalNoticesByCategoryIds\(deleteIds, otherCategoryId\)/);
  assert.match(source, /\.from\("notices"\)[\s\S]*?\.update\(\{ category_id: otherCategoryId \}\)[\s\S]*?\.in\("category_id", deleteIds\)/);
  assert.match(source, /\.from\("notice_categories"\)[\s\S]*?\.delete\(\)[\s\S]*?\.in\("id", deleteIds\)/);
});

test("other category is preserved in settings deletion UI", () => {
  const source = readFileSync("components/admin-settings-panel.tsx", "utf8");

  assert.match(source, /otherCategoryId/);
  assert.match(source, /category\.id !== otherCategoryId \?/);
});

test("local notice store can reassign categories by deleted ids", () => {
  const source = readFileSync("lib/local-notice-store.ts", "utf8");

  assert.match(source, /export async function reassignLocalNoticesByCategoryIds/);
  assert.match(source, /const deleteIds = new Set\(categoryIds\)/);
  assert.match(source, /categoryId: fallbackCategoryId/);
});
