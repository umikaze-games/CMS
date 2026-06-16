const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { test } = require("node:test");

test("game deletion requires typed confirmation in settings", () => {
  const source = readFileSync("components/admin-settings-panel.tsx", "utf8");

  assert.match(source, /const deleteGameConfirmationText = "\\u78ba\\u8a8d\\u524a\\u9664"/);
  assert.match(source, /confirmationRequiredText=\{/);
  assert.match(source, /confirmAction\?\.type === "delete-game" \? deleteGameConfirmationText : undefined/);
  assert.match(source, /deleteGameCascadeDescription/);
});

test("confirmation dialog disables confirm until required text matches", () => {
  const source = readFileSync("components/admin-confirm-dialog.tsx", "utf8");

  assert.match(source, /confirmationRequiredText\?: string/);
  assert.match(source, /confirmationValue === confirmationRequiredText/);
  assert.match(source, /disabled=\{confirmationRequiredText \? !canConfirm : false\}/);
});

test("game title API cascades deleted games to notices", () => {
  const source = readFileSync("app/api/admin/game-titles/route.ts", "utf8");

  assert.match(source, /deleteLocalNoticesByGameIds\(deleteIds\)/);
  assert.match(source, /\.from\("notices"\)[\s\S]*?\.delete\(\)[\s\S]*?\.in\("game_id", deleteIds\)/);
});

test("local notice store can delete notices by game ids", () => {
  const source = readFileSync("lib/local-notice-store.ts", "utf8");

  assert.match(source, /export async function deleteLocalNoticesByGameIds\(gameIds: string\[\]\)/);
  assert.match(source, /const deleteIds = new Set\(gameIds\)/);
  assert.match(source, /current\.filter\(\(item\) => !deleteIds\.has\(item\.gameId\)\)/);
});
