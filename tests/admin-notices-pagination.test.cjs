const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { test } = require("node:test");

test("admin notices table supports selectable page sizes and page jumps", () => {
  const source = readFileSync("components/admin-notices-table.tsx", "utf8");

  assert.match(source, /const pageSizeOptions = \[15, 30, 50, 100\]/);
  assert.match(source, /const \[pageSize, setPageSize\] = useState\(pageSizeOptions\[0\]\)/);
  assert.match(source, /const \[pageInputValue, setPageInputValue\] = useState\("1"\)/);
  assert.match(source, /Math\.ceil\(filteredItems\.length \/ pageSize\)/);
  assert.match(source, /filteredItems\.slice\(\(safePage - 1\) \* pageSize, safePage \* pageSize\)/);
  assert.match(source, /function jumpToPage\(\)/);
  assert.match(source, /Math\.max\(1, Math\.min\(totalPages, Number\(pageInputValue\)\)\)/);
  assert.match(source, /setCurrentPage\(1\);\s*\}, \[pageSize, gameFilter, categoryFilter, statusFilter\]\)/);
  assert.match(source, /pageSizeOptions\.map\(\(size\) => \(/);
  assert.match(source, /value=\{pageSize\}/);
  assert.match(source, /onChange=\{\(event\) => setPageSize\(Number\(event\.target\.value\)\)\}/);
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

test("admin notice rows open edit screen while controls keep their own actions", () => {
  const source = readFileSync("components/admin-notices-table.tsx", "utf8");

  assert.match(source, /import \{ useRouter \} from "next\/navigation"/);
  assert.match(source, /const router = useRouter\(\)/);
  assert.match(source, /function getNoticeEditHref\(notice: NoticeWithCategory\)/);
  assert.match(source, /function handleRowClick/);
  assert.match(source, /shouldIgnoreRowNavigation\(event\.target\)/);
  assert.match(source, /router\.push\(getNoticeEditHref\(notice\)\)/);
  assert.match(source, /onClick=\{\(event\) => handleRowClick\(event, notice\)\}/);
  assert.match(source, /data-row-action/);
  assert.match(source, /cursor-pointer/);
});
