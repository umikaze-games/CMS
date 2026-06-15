const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const { rmSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");

rmSync(".tmp-tests", { recursive: true, force: true });
execFileSync(
  process.execPath,
  [
    join("node_modules", "typescript", "bin", "tsc"),
    "lib/admin-upload.ts",
    "--outDir",
    ".tmp-tests",
    "--module",
    "commonjs",
    "--target",
    "es2020",
    "--esModuleInterop",
    "--skipLibCheck"
  ],
  { stdio: "inherit" }
);

const {
  ADMIN_BANNER_MAX_BYTES,
  validateAdminBannerFile
} = require("../.tmp-tests/admin-upload.js");

test("allows missing or small banner files", () => {
  assert.equal(validateAdminBannerFile(null), null);
  assert.equal(validateAdminBannerFile({ size: ADMIN_BANNER_MAX_BYTES }), null);
});

test("rejects oversized banner files", () => {
  assert.equal(
    validateAdminBannerFile({ size: ADMIN_BANNER_MAX_BYTES + 1 }),
    "画像サイズが大きすぎます。10MB以下の画像を選択してください。"
  );
});
