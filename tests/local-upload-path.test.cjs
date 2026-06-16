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
    "lib/local-upload-path.ts",
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

const { getLocalNoticeUploadPath, getLocalNoticeUploadUrl, isLocalNoticeUploadUrl } =
  require("../.tmp-tests/local-upload-path.js");

test("recognizes local notice upload URLs", () => {
  assert.equal(isLocalNoticeUploadUrl("/uploads/notices/test.png"), true);
  assert.equal(isLocalNoticeUploadUrl("/images/test.png"), false);
});

test("builds local notice upload paths safely", () => {
  assert.equal(getLocalNoticeUploadUrl("test.png"), "/uploads/notices/test.png");
  assert.match(getLocalNoticeUploadPath("../test.png"), /public[\\/]+uploads[\\/]+notices[\\/]+test\.png$/);
});
