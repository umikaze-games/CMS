const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { test } = require("node:test");

test("admin notices table paginates at fifteen rows and supports page jumps", () => {
  const source = readFileSync("components/admin-notices-table.tsx", "utf8");

  assert.match(source, /const pageSize = 15/);
  assert.match(source, /const \[pageInputValue, setPageInputValue\] = useState\("1"\)/);
  assert.match(source, /function jumpToPage\(\)/);
  assert.match(source, /Math\.max\(1, Math\.min\(totalPages, Number\(pageInputValue\)\)\)/);
  assert.match(source, /type="number"[\s\S]*?value=\{pageInputValue\}[\s\S]*?onChange=\{\(event\) => setPageInputValue\(event\.target\.value\)\}/);
  assert.match(source, /onSubmit=\{\(event\) => \{[\s\S]*?event\.preventDefault\(\);[\s\S]*?jumpToPage\(\);[\s\S]*?\}\}/);
});

test("admin notices visibility action toggles hidden notices back to published", () => {
  const source = readFileSync("components/admin-notices-table.tsx", "utf8");

  assert.match(source, /function getVisibilityToggleStatus\(notice: NoticeWithCategory\)/);
  assert.match(source, /return notice\.status === "hidden" \? "published" : "hidden"/);
  assert.match(source, /status: getVisibilityToggleStatus\(notice\)/);
  assert.match(source, /await updateNoticeStatus\(confirmAction\.notice, confirmAction\.status \?\? "hidden"\)/);
});

test("admin notices visibility action shows selected styling while hidden", () => {
  const source = readFileSync("components/admin-notices-table.tsx", "utf8");

  assert.match(source, /notice\.status === "hidden"[\s\S]*?border-rose-200 bg-rose-50 text-rose-600 ring-1 ring-rose-200/);
  assert.match(source, /notice\.status === "hidden" \? labels\.show : labels\.hide/);
  assert.match(source, /show: "\\u8868\\u793a\\u306b\\u623b\\u3059"/);
});
