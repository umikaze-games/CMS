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

  assert.match(source, /bannerHelp: "10MB\\u4ee5\\u4e0b/);
  assert.match(source, /\\u30a2\\u30c3\\u30d7\\u30ed\\u30fc\\u30c9\\u63a8\\u5968\\u30b5\\u30a4\\u30ba\\uff1a1280\\u00d7720px\\u4ee5\\u4e0a/);
  assert.match(source, /\\u6bd4\\u738716\\uff1a9/);
  assert.match(source, /\{labels\.bannerHelp\}/);
  assert.doesNotMatch(source, /bannerMainSize/);
  assert.doesNotMatch(source, /bannerDetailSize/);
});

test("banner upload preview matches the public notice list thumbnail crop", () => {
  const formSource = readFileSync("components/admin-notice-form.tsx", "utf8");
  const cardSource = readFileSync("components/notice-card.tsx", "utf8");
  const detailSource = readFileSync("app/notices/[id]/page.tsx", "utf8");

  assert.match(cardSource, /md:grid-cols-\[284px_1fr\]/);
  assert.match(cardSource, /aspect-video/);
  assert.match(cardSource, /className="object-cover saturate-125/);
  assert.match(detailSource, /aspect-video/);
  assert.doesNotMatch(detailSource, /md:h-\[420px\]/);
  assert.match(formSource, /aspect-video/);
  assert.match(formSource, /max-w-\[284px\]/);
  assert.match(formSource, /className="absolute inset-0 h-full w-full object-cover saturate-125/);
});

test("banner selection can be cancelled back to the category default banner", () => {
  const source = readFileSync("components/admin-notice-form.tsx", "utf8");

  assert.match(source, /bannerInputRef = useRef<HTMLInputElement>\(null\)/);
  assert.match(source, /function clearBannerSelection\(\)/);
  assert.match(source, /bannerInputRef\.current\.value = ""/);
  assert.match(source, /setBannerFileName\(null\)/);
  assert.match(source, /setUsesDefaultBanner\(true\)/);
  assert.match(source, /setBannerPreview\(getDefaultNoticeBannerUrl\(categoryValue\)\)/);
  assert.match(source, /onClick=\{\(event\) => \{\s*event\.preventDefault\(\);\s*event\.stopPropagation\(\);\s*clearBannerSelection\(\);\s*\}\}/);
});

test("selected banner status uses high contrast text", () => {
  const source = readFileSync("components/admin-notice-form.tsx", "utf8");

  assert.match(source, /bg-slate-950\/85/);
  assert.match(source, /text-white/);
  assert.match(source, /text-slate-200/);
});
