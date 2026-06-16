const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { test } = require("node:test");

const source = readFileSync("components/admin-rich-text-editor.tsx", "utf8");

test("rich text toolbar gives bold a visible active state", () => {
  assert.match(source, /active=\{activeFormats\.bold\}/);
  assert.match(source, /aria-pressed=\{active\}/);
  assert.match(source, /bg-cyan-100 text-cyan-700/);
});

test("rich text toolbar collapses text selection after applying a command", () => {
  assert.match(source, /function collapseSelectionToEnd\(\)/);
  assert.match(source, /range\.collapse\(false\)/);
  assert.match(source, /if \(collapseAfter\) \{\s*collapseSelectionToEnd\(\);/);
});

test("rich text toolbar renders one bold button", () => {
  const boldButtonCount = (source.match(/label=\{labels\.bold\}/g) ?? []).length;
  assert.equal(boldButtonCount, 1);
});
