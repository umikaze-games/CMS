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

test("banner upload area shows the current image size limit", () => {
  const source = readFileSync("components/admin-notice-form.tsx", "utf8");

  assert.match(source, /bannerHelp: "10MB\\u4ee5\\u4e0b\\uff08\\u5e45\\u30fb\\u9ad8\\u3055\\u306e\\u5236\\u9650\\u306f\\u3042\\u308a\\u307e\\u305b\\u3093\\uff09"/);
  assert.match(source, /\{labels\.bannerHelp\}/);
});

test("banner selection can be cancelled back to the empty upload prompt", () => {
  const source = readFileSync("components/admin-notice-form.tsx", "utf8");

  assert.match(source, /bannerInputRef = useRef<HTMLInputElement>\(null\)/);
  assert.match(source, /function clearBannerSelection\(\)/);
  assert.match(source, /bannerInputRef\.current\.value = ""/);
  assert.match(source, /setBannerFileName\(null\)/);
  assert.match(source, /setBannerPreview\(null\)/);
  assert.match(source, /onClick=\{\(event\) => \{\s*event\.preventDefault\(\);\s*event\.stopPropagation\(\);\s*clearBannerSelection\(\);\s*\}\}/);
});

test("selected banner status uses high contrast text", () => {
  const source = readFileSync("components/admin-notice-form.tsx", "utf8");

  assert.match(source, /bg-slate-950\/85/);
  assert.match(source, /text-white/);
  assert.match(source, /text-slate-200/);
});
