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

test("rich text emoji chip opens a selectable picker", () => {
  assert.match(source, /const emojiGroups = \[/);
  assert.match(source, /emojiChoices = emojiGroups\.flatMap/);
  assert.match(source, /selectedEmojiGroup/);
  assert.match(source, /showEmojiMenu/);
  assert.match(source, /selectedEmojiChoices\.map/);
  assert.match(source, /onClick=\{\(\) => insertEmoji\(item\)\}/);
  assert.match(source, /label: "\u9854"/);
  assert.match(source, /label: "\u9854\u6587\u5b57"/);
  assert.match(source, /label: "\u65d7"/);
});

test("rich text emoji picker does not toggle closed from the opener", () => {
  assert.match(source, /function openEmojiPicker\(\)/);
  assert.match(source, /setShowEmojiMenu\(true\)/);
  assert.doesNotMatch(source, /setShowEmojiMenu\(\(current\) => !current\)/);
});

test("rich text emoji picker stays open after inserting a choice", () => {
  const insertEmojiBody = source.match(/function insertEmoji\(value: string\) \{([\s\S]*?)\n  \}/)?.[1] ?? "";
  assert.match(insertEmojiBody, /runCommand\("insertText", value\)/);
  assert.doesNotMatch(insertEmojiBody, /setShowEmojiMenu\(false\)/);
});

test("rich text popup tool openers do not toggle closed from their buttons", () => {
  assert.match(source, /function openTableMenu\(\)/);
  assert.match(source, /function openCellColorMenu\(\)/);
  assert.match(source, /function openTextColorMenu\(\)/);
  assert.match(source, /setShowTableMenu\(true\)/);
  assert.match(source, /setShowCellColorMenu\(true\)/);
  assert.match(source, /setShowTextColorMenu\(true\)/);
  assert.doesNotMatch(source, /setShow(?:Table|CellColor|TextColor)Menu\(\(current\) => !current\)/);
});

test("rich text image chip opens an image picker", () => {
  assert.match(source, /onClick=\{openImagePicker\}/);
  assert.match(source, /<input[\s\S]*type="file"[\s\S]*accept="image\/\*"/);
});

test("rich text image insertion uploads images instead of embedding base64", () => {
  assert.match(source, /async function uploadInlineImage/);
  assert.match(source, /fetch\("\/api\/admin\/uploads"/);
  assert.match(source, /insertInlineImage\(data\.url\)/);
  assert.doesNotMatch(source, /readAsDataURL/);
});
