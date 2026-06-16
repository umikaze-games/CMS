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
