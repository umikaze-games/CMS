const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { test } = require("node:test");

const settingsPanelSource = readFileSync("components/admin-settings-panel.tsx", "utf8");
const noticesSource = readFileSync("lib/notices.ts", "utf8");
const adminNoticesPageSource = readFileSync("app/admin/notices/page.tsx", "utf8");
const adminNewPageSource = readFileSync("app/admin/notices/new/page.tsx", "utf8");
const adminEditPageSource = readFileSync("app/admin/notices/[id]/edit/page.tsx", "utf8");
const adminSettingsPageSource = readFileSync("app/admin/settings/page.tsx", "utf8");

test("settings game title edits persist through the admin API", () => {
  assert.match(settingsPanelSource, /async function persistGameItems\(nextGames: GameTitle\[\]\)/);
  assert.match(settingsPanelSource, /fetch\("\/api\/admin\/game-titles"/);
  assert.match(settingsPanelSource, /method: "PUT"/);
  assert.match(settingsPanelSource, /router\.refresh\(\)/);
});

test("server pages read game titles from persistent storage", () => {
  assert.match(noticesSource, /export async function getGameTitles\(\)/);
  assert.match(noticesSource, /getLocalGameTitles\(\)/);
  assert.match(adminNoticesPageSource, /const games = await getGameTitles\(\)/);
  assert.match(adminNewPageSource, /const games = await getGameTitles\(\)/);
  assert.match(adminEditPageSource, /const games = await getGameTitles\(\)/);
  assert.match(adminSettingsPageSource, /const games = await getGameTitles\(\)/);
});
