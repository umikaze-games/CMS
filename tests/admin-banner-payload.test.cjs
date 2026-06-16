const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { test } = require("node:test");

test("edit form does not submit existing banner image data", () => {
  const source = readFileSync("components/admin-notice-form.tsx", "utf8");

  assert.equal(source.includes('name="current_banner_image"'), false);
});

test("notice update API does not read existing banner image from request body", () => {
  const source = readFileSync("app/api/admin/notices/[id]/route.ts", "utf8");

  assert.equal(source.includes("current_banner_image"), false);
});
