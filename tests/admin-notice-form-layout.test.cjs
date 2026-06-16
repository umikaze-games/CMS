const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { test } = require("node:test");

test("NEW badge start and end controls are presented as one period setting", () => {
  const source = readFileSync("components/admin-notice-form.tsx", "utf8");

  assert.match(source, /newBadgePeriod/);
  assert.match(source, /<fieldset[\s\S]*?labels\.newBadgePeriod[\s\S]*?new_badge_start_at[\s\S]*?new_badge_end_at[\s\S]*?<\/fieldset>/);
});
