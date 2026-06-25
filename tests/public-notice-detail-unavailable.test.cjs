const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { test } = require("node:test");

const source = readFileSync("app/notices/[id]/page.tsx", "utf8");

test("public hidden notice detail shows a Japanese unavailable message", () => {
  assert.match(source, /if \(!notice \|\| notice\.status !== "published"\) \{/);
  assert.match(source, /<UnavailableNotice \/>/);
  assert.match(source, /const unavailableTitle = "\\u3053\\u306e\\u304a\\u77e5\\u3089\\u305b/);
  assert.match(source, /const noticeTopLabel = "\\u304a\\u77e5\\u3089\\u305b\\u30c8\\u30c3\\u30d7/);
  assert.match(source, /\{unavailableTitle\}/);
  assert.match(source, /\{noticeTopLabel\}/);
  assert.match(source, /href="\/notices"/);
  assert.doesNotMatch(source, /from "next\/navigation"/);
  assert.doesNotMatch(source, /notFound\(\)/);
});
