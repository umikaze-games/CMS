const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { test } = require("node:test");

test("public notices list paginates eight notices per page", () => {
  const source = readFileSync("app/notices/page.tsx", "utf8");

  assert.match(source, /const pageSize = 8/);
  assert.match(source, /const pageNotices = notices\.slice\(\(safePage - 1\) \* pageSize, safePage \* pageSize\)/);
  assert.match(source, /href=\{pageHref\(Math\.max\(1, safePage - 1\)\)\}/);
  assert.match(source, /href=\{pageHref\(Math\.min\(totalPages, safePage \+ 1\)\)\}/);
});

test("public category filters reset pagination", () => {
  const source = readFileSync("app/notices/page.tsx", "utf8");

  assert.match(source, /href=\{categoryHref\(category\.id\)\}/);
  assert.match(source, /function categoryHref\(categoryId: string\)/);
  assert.doesNotMatch(source, /href=\{`\/notices\?category=\$\{category\.id\}`\}/);
});

test("public TOP NEWS label only appears on pinned notices", () => {
  const source = readFileSync("components/notice-card.tsx", "utf8");

  assert.match(source, /featured && notice\.isPinned/);
  assert.doesNotMatch(source, /\{featured \? \(/);
});
