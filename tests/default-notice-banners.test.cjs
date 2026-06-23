const assert = require("node:assert/strict");
const { existsSync, readFileSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");

const categories = ["important", "maintenance", "event", "campaign", "update", "bug", "other"];

test("default banner assets exist for every built-in notice category", () => {
  for (const category of categories) {
    assert.equal(
      existsSync(join("public", "default-banners", `${category}.svg`)),
      true,
      `${category} default banner is missing`
    );
  }
});

test("default banner helper maps categories and preserves custom images", () => {
  const source = readFileSync("lib/default-notice-banners.ts", "utf8");

  for (const category of categories) {
    assert.match(source, new RegExp(`${category}: "/default-banners/${category}\\.svg"`));
  }

  assert.match(source, /export function getDefaultNoticeBannerUrl/);
  assert.match(source, /export function isDefaultNoticeBannerUrl/);
  assert.match(source, /export function resolveNoticeBannerImage/);
  assert.match(source, /bannerImage && !isDefaultNoticeBannerUrl\(bannerImage\)/);
});

test("front pages use category defaults instead of NO IMAGE fallbacks", () => {
  const cardSource = readFileSync("components/notice-card.tsx", "utf8");
  const detailSource = readFileSync(join("app", "notices", "[id]", "page.tsx"), "utf8");

  assert.match(cardSource, /getNoticeBannerImage\(notice\)/);
  assert.doesNotMatch(cardSource, /NO IMAGE/);
  assert.match(detailSource, /getNoticeBannerImage\(notice\)/);
  assert.match(cardSource, /isDefaultNoticeBannerUrl\(bannerImage\)/);
  assert.match(detailSource, /isDefaultNoticeBannerUrl\(bannerImage\)/);
});

test("admin notice form previews and submits category default banners", () => {
  const formSource = readFileSync("components/admin-notice-form.tsx", "utf8");
  const noticeFormSource = readFileSync("lib/notice-form.ts", "utf8");

  assert.match(formSource, /getDefaultNoticeBannerUrl\(categoryValue\)/);
  assert.match(formSource, /function handleCategoryChange\(nextCategoryId: string\)/);
  assert.match(formSource, /name="use_default_banner"/);
  assert.match(formSource, /value=\{usesDefaultBanner \? "true" : "false"\}/);
  assert.match(noticeFormSource, /useDefaultBanner/);
});

test("notice save APIs write default banners when no upload is supplied", () => {
  const createRoute = readFileSync(join("app", "api", "admin", "notices", "route.ts"), "utf8");
  const updateRoute = readFileSync(join("app", "api", "admin", "notices", "[id]", "route.ts"), "utf8");

  assert.match(createRoute, /resolveNoticeBannerImage\(values\.categoryId, null\)/);
  assert.match(updateRoute, /values\.useDefaultBanner/);
  assert.match(updateRoute, /resolveNoticeBannerImage\(values\.categoryId, null\)/);
});
