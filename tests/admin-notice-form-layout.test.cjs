const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { test } = require("node:test");

test("NEW badge start and end controls are presented as one period setting", () => {
  const source = readFileSync("components/admin-notice-form.tsx", "utf8");

  assert.match(source, /newBadgePeriod: "NEW\\u8868\\u793a\\u671f\\u9593"/);
  assert.match(source, /newBadgeStart: "\\u958b\\u59cb\\u65e5\\u6642"/);
  assert.match(source, /newBadgeEnd: "\\u7d42\\u4e86\\u65e5\\u6642"/);
  assert.match(source, /\\u7d42\\u4e86\\u65e5\\u6642\\u306f\\u624b\\u52d5\\u3067\\u5909\\u66f4\\u3067\\u304d\\u307e\\u3059/);
  assert.match(source, /<fieldset[\s\S]*?<legend className="sr-only">[\s\S]*?labels\.newBadgePeriod[\s\S]*?new_badge_start_at[\s\S]*?new_badge_end_at[\s\S]*?<\/fieldset>/);
});

test("NEW badge end keeps seven days from start until manually changed", () => {
  const source = readFileSync("components/admin-notice-form.tsx", "utf8");

  assert.match(source, /function handleNewBadgeStartChange\(nextValue: string\)/);
  assert.match(source, /const currentDefaultEnd = addDaysLocalDateTime\(newBadgeStartValue, 7\)/);
  assert.match(source, /setNewBadgeEndValue\(addDaysLocalDateTime\(nextValue, 7\)\)/);
});

test("NEW badge period is preserved when editing without scheduled publish", () => {
  const source = readFileSync("components/admin-notice-form.tsx", "utf8");

  assert.match(source, /const effectiveNewBadgeStartValue = newBadgeStartValue;/);
  assert.match(source, /const effectiveNewBadgeEndValue = newBadgeEndValue;/);
  assert.doesNotMatch(source, /const effectiveNewBadgeEndValue = reservationEnabled[\s\S]*?addDaysLocalDateTime\(effectivePublishValue, 7\);/);
});
