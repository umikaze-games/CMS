const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const { existsSync, mkdirSync, rmSync } = require("node:fs");
const { join, resolve } = require("node:path");
const { test } = require("node:test");

rmSync(".tmp-tests", { recursive: true, force: true });
execFileSync(
  process.execPath,
  [
    join("node_modules", "typescript", "bin", "tsc"),
    "lib/local-banner-store.ts",
    "--outDir",
    ".tmp-tests",
    "--module",
    "commonjs",
    "--target",
    "es2021",
    "--esModuleInterop",
    "--skipLibCheck"
  ],
  { stdio: "inherit" }
);

const compiledModulePath = resolve(".tmp-tests/local-banner-store.js");

test("saves local banner uploads as public file paths", async () => {
  const cwd = process.cwd();
  const tempCwd = resolve(".tmp-tests-banner-save");
  rmSync(tempCwd, { recursive: true, force: true });
  mkdirSync(tempCwd, { recursive: true });
  process.chdir(tempCwd);

  try {
    const { saveLocalBannerFile } = require(compiledModulePath);
    const file = new File(["banner"], "Banner Image.PNG", { type: "image/png" });
    const url = await saveLocalBannerFile(file);

    assert.match(url, /^\/uploads\/notices\/banner-image-\d+-[a-f0-9]{12}\.png$/);
    assert.equal(existsSync(join(tempCwd, "public", url.slice(1))), true);
  } finally {
    process.chdir(cwd);
  }
});

test("migrates existing local banner data URLs to public file paths", async () => {
  const cwd = process.cwd();
  const tempCwd = resolve(".tmp-tests-banner-migrate");
  rmSync(tempCwd, { recursive: true, force: true });
  mkdirSync(tempCwd, { recursive: true });
  process.chdir(tempCwd);

  try {
    const { migrateLocalBannerDataUrls } = require(compiledModulePath);
    const dataUrl = `data:image/png;base64,${Buffer.from("old-banner").toString("base64")}`;
    const result = await migrateLocalBannerDataUrls([
      {
        id: "local-test",
        gameId: "stella-quest",
        categoryId: "maintenance",
        title: "Test",
        body: "Body",
        bannerImage: dataUrl,
        status: "published",
        isPinned: false,
        publishAt: "2026-06-16T11:04:00+09:00",
        newBadgeStartAt: "2026-06-16T11:04:00+09:00",
        newBadgeEndAt: "2026-06-23T11:04:00+09:00",
        createdAt: "2026-06-16T02:04:00.000Z",
        updatedAt: "2026-06-16T02:04:00.000Z",
        sortOrder: 0
      }
    ]);

    assert.equal(result.changed, true);
    assert.match(result.items[0].bannerImage, /^\/uploads\/notices\/local-test-[a-f0-9]{12}\.png$/);
    assert.equal(existsSync(join(tempCwd, "public", result.items[0].bannerImage.slice(1))), true);
  } finally {
    process.chdir(cwd);
  }
});
