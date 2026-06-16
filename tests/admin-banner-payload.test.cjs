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

test("banner selection clears stale size errors for valid files", () => {
  const source = readFileSync("components/admin-notice-form.tsx", "utf8");
  const handlerBody =
    source.match(/async function handleBannerChange\([^)]*\) \{([\s\S]*?)\n  \}/)?.[1] ?? "";

  assert.match(handlerBody, /const bannerError = validateAdminBannerFile\(file\)/);
  assert.match(handlerBody, /if \(bannerError\) \{/);
  assert.match(handlerBody, /setMessage\(bannerError\)/);
  assert.match(handlerBody, /event\.currentTarget\.value = ""/);
  assert.match(handlerBody, /setMessage\(null\)/);
  assert.match(handlerBody, /setBannerPreview\(await fileToDataUrl\(file\)\)/);
});
