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
    "lib/date.ts",
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

const {
  addDaysLocalDateTime,
  formatDateWithTime,
  formatDateTimeLocal,
  isNoticeNew,
  normalizeJapanDateTime,
  parseNoticeDateTime
} = require("../.tmp-tests/date.js");

test("treats timezone-less notice datetimes as Japan time", () => {
  assert.equal(
    parseNoticeDateTime("2026-06-16T10:10").toISOString(),
    "2026-06-16T01:10:00.000Z"
  );
});

test("normalizes datetime-local values with Japan timezone", () => {
  assert.equal(normalizeJapanDateTime("2026-06-16T10:10"), "2026-06-16T10:10:00+09:00");
  assert.equal(normalizeJapanDateTime("2026-06-16T10:10:00+09:00"), "2026-06-16T10:10:00+09:00");
});

test("formats notice datetimes in Japan time", () => {
  assert.equal(formatDateWithTime("2026-06-16T10:10"), "2026.06.16 10:10");
});

test("returns datetime-local values in Japan time", () => {
  assert.equal(formatDateTimeLocal("2026-06-16T10:10:00+09:00"), "2026-06-16T10:10");
  assert.equal(addDaysLocalDateTime("2026-06-16T10:10:00+09:00", 7), "2026-06-23T10:10");
});

test("new badge uses Japan time for timezone-less notice datetimes", () => {
  assert.equal(
    isNoticeNew(
      {
        status: "published",
        publishAt: "2026-06-16T10:10",
        newBadgeStartAt: "2026-06-16T10:10",
        newBadgeEndAt: "2026-06-23T10:10"
      },
      new Date("2026-06-16T01:26:00.000Z")
    ),
    true
  );
});
