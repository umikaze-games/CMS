const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");

const repoRoot = process.cwd();

function readRepoFile(...parts) {
  return readFileSync(join(repoRoot, ...parts), "utf8");
}

test("admin notice drag reorder is persisted through the reorder API", () => {
  const tableSource = readRepoFile("components", "admin-notices-table.tsx");

  assert.match(tableSource, /async function saveNoticeOrder/);
  assert.match(tableSource, /fetch\("\/api\/admin\/notices\/reorder"/);
  assert.match(tableSource, /orderedIds: nextItems\.map\(\(item\) => item\.id\)/);
  assert.match(tableSource, /await saveNoticeOrder\(nextItems\)/);
});

test("pinned TOP notices cannot be dragged or used as drop targets", () => {
  const tableSource = readRepoFile("components", "admin-notices-table.tsx");

  assert.match(tableSource, /draggable=\{!notice\.isPinned\}/);
  assert.match(tableSource, /if \(notice\.isPinned\) \{\s*event\.preventDefault\(\);\s*return;/);
  assert.match(tableSource, /targetNotice\?\.isPinned/);
  assert.match(tableSource, /cursor-not-allowed/);
});

test("admin and public notice reads use persisted sort order", () => {
  const noticesSource = readRepoFile("lib", "notices.ts");

  assert.match(noticesSource, /function byNoticeOrder/);
  assert.match(noticesSource, /\.order\("is_pinned", \{ ascending: false \}\)\s*\.order\("sort_order", \{ ascending: true \}\)/);
  assert.match(noticesSource, /return localNotices[\s\S]*\.sort\(byNoticeOrder\);/);
});

test("reorder API updates the local store and Supabase sort_order values", () => {
  const routeSource = readRepoFile("app", "api", "admin", "notices", "reorder", "route.ts");
  const storeSource = readRepoFile("lib", "local-notice-store.ts");

  assert.match(routeSource, /export async function POST/);
  assert.match(routeSource, /reorderLocalNotices\(orderedIds\)/);
  assert.match(routeSource, /\.update\(\{ sort_order: index \+ 1, updated_at: now \}\)/);
  assert.match(storeSource, /export async function reorderLocalNotices/);
  assert.match(storeSource, /sortOrder: orderMap\.get\(item\.id\)!/);
});
