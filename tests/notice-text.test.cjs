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
    "lib/notice-text.ts",
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

const { getNoticeExcerpt } = require("../.tmp-tests/notice-text.js");

test("turns rich HTML notice body into plain excerpt text", () => {
  assert.equal(
    getNoticeExcerpt('<span style="font-weight: normal;">oooooooooooooooo</span>'),
    "oooooooooooooooo"
  );
});

test("removes inline markdown images from excerpt text", () => {
  assert.equal(
    getNoticeExcerpt("before\n![banner](data:image/png;base64,abc)\nafter"),
    "before after"
  );
});

test("decodes common HTML entities in excerpt text", () => {
  assert.equal(getNoticeExcerpt("<p>A&nbsp;&amp;&nbsp;B</p>"), "A & B");
});
