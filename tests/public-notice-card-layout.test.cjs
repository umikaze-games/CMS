const test = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");

test("public notice cards use a fixed desktop height", () => {
  const source = readFileSync("components/notice-card.tsx", "utf8");

  assert.match(source, /md:h-40/);
  assert.match(source, /md:grid-cols-\[284px_1fr\]/);
  assert.match(source, /aspect-video/);
  assert.match(source, /md:h-full/);
  assert.doesNotMatch(source, /md:aspect-auto/);
});
