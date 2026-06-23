const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { test } = require("node:test");

const source = readFileSync("components/admin-rich-text-editor.tsx", "utf8");
const formSource = readFileSync("components/admin-notice-form.tsx", "utf8");

test("rich text toolbar gives bold a visible active state", () => {
  assert.match(source, /active=\{activeFormats\.bold\}/);
  assert.match(source, /aria-pressed=\{active\}/);
  assert.match(source, /bg-cyan-100 text-cyan-700/);
});

test("rich text toolbar keeps selected text active after applying text effects", () => {
  assert.match(source, /function runCommand\(command: string, commandValue\?: string, collapseAfter = false\)/);
  assert.match(source, /function collapseSelectionToEnd\(\)/);
  assert.match(source, /range\.collapse\(false\)/);
  assert.match(source, /if \(collapseAfter\) \{\s*collapseSelectionToEnd\(\);/);
  assert.match(source, /onClick=\{\(\) => runCommand\("bold"\)\}/);
  assert.match(source, /onClick=\{\(\) => runCommand\("strikeThrough"\)\}/);
  assert.match(source, /onClick=\{\(\) => runCommand\("justifyLeft"\)\}/);
  assert.match(source, /onClick=\{\(\) => runCommand\("justifyCenter"\)\}/);
  assert.match(source, /onClick=\{\(\) => runCommand\("justifyRight"\)\}/);
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
  assert.match(source, /<SmilePlus size=\{16\} \/>/);
  assert.match(source, /label: "\u9854"/);
  assert.match(source, /label: "\u9854\u6587\u5b57"/);
  assert.match(source, /label: "\u65d7"/);
});

test("rich text emoji and image tools sit inside the right toolbar", () => {
  const toolbarBody =
    source.match(/<div className="relative ml-auto flex[\s\S]*?<\/div>\s*<\/div>\s*<div\s*ref=\{editorRef\}/)
      ?.[0] ?? "";
  assert.match(toolbarBody, /ref=\{emojiMenuRef\}/);
  assert.match(toolbarBody, /onClick=\{openEmojiPicker\}/);
  assert.match(toolbarBody, /<SmilePlus size=\{16\} \/>/);
  assert.match(toolbarBody, /onClick=\{openImagePicker\}/);
  assert.match(toolbarBody, /<ImagePlus size=\{16\} \/>/);
  assert.doesNotMatch(source, /gap-1 rounded-full bg-cyan-50 px-2\.5 py-1/);
  assert.doesNotMatch(source, /gap-1 rounded-full bg-indigo-50 px-2\.5 py-1/);
});

test("rich text emoji picker does not toggle closed from the opener", () => {
  assert.match(source, /function openEmojiPicker\(\)/);
  assert.match(source, /setShowEmojiMenu\(true\)/);
  assert.doesNotMatch(source, /setShowEmojiMenu\(\(current\) => !current\)/);
});

test("rich text toolbar ignores stray pointer clicks that did not start on a tool button", () => {
  assert.match(source, /const pointerStartedRef = useRef\(false\)/);
  assert.match(source, /onPointerDown=\{\(event\) => \{/);
  assert.match(source, /pointerStartedRef\.current = true/);
  assert.match(source, /if \(event\.detail !== 0 && !pointerStartedRef\.current\) \{\s*return;\s*\}/);
  assert.match(source, /pointerStartedRef\.current = false/);
  assert.match(source, /onClick\(\)/);
  assert.doesNotMatch(source, /editorPointerDownUntil/);
});

test("rich text emoji picker closes after inserting a choice", () => {
  const insertEmojiBody = source.match(/function insertEmoji\(value: string\) \{([\s\S]*?)\n  \}/)?.[1] ?? "";
  assert.match(insertEmojiBody, /runCommand\("insertText", value, true\)/);
  assert.match(insertEmojiBody, /setShowEmojiMenu\(false\)/);
});

test("rich text emoji picker has an explicit close button", () => {
  const emojiPickerBody =
    source.match(/\{showEmojiMenu \? \([\s\S]*?\) : null\}/)?.[0] ?? "";
  assert.match(emojiPickerBody, /<PanelHeader title=\{labels\.emoji\} onClose=\{\(\) => setShowEmojiMenu\(false\)\} \/>/);
});

test("rich text emoji picker closes without intercepting editor pointer focus", () => {
  assert.match(source, /emojiMenuRef/);
  assert.match(source, /function handleEmojiOutsidePointerDown\(event: globalThis\.PointerEvent\)/);
  assert.match(
    source,
    /document\.addEventListener\("pointerdown", handleEmojiOutsidePointerDown\)/
  );
  assert.match(
    source,
    /document\.removeEventListener\("pointerdown", handleEmojiOutsidePointerDown\)/
  );
  assert.doesNotMatch(source, /onPointerDownCapture=\{handleEditorPointerDown\}/);
  assert.match(source, /ref=\{emojiMenuRef\}/);
  assert.match(source, /function closeFloatingMenusAfterPointerDefault\(close: \(\) => void\) \{/);
  assert.match(source, /window\.setTimeout\(close, 0\)/);
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

test("rich text table popup closes from outside clicks", () => {
  assert.match(source, /tableMenuRef/);
  assert.match(source, /function handleTableOutsidePointerDown\(event: globalThis\.PointerEvent\)/);
  assert.match(
    source,
    /document\.addEventListener\("pointerdown", handleTableOutsidePointerDown\)/
  );
  assert.match(
    source,
    /document\.removeEventListener\("pointerdown", handleTableOutsidePointerDown\)/
  );
  assert.match(source, /ref=\{tableMenuRef\}/);
});

test("rich text color popups close from outside clicks", () => {
  assert.match(source, /const menuRef = useRef<HTMLDivElement>\(null\)/);
  assert.match(source, /function handleOutsidePointerDown\(event: globalThis\.PointerEvent\)/);
  assert.match(source, /if \(!menuRef\.current\?\.contains\(event\.target as Node\)\) \{\s*closeFloatingMenusAfterPointerDefault\(onClose\);/);
  assert.match(source, /document\.addEventListener\("pointerdown", handleOutsidePointerDown\)/);
  assert.match(source, /document\.removeEventListener\("pointerdown", handleOutsidePointerDown\)/);
});

test("rich text editor blank clicks close text adjustment popups", () => {
  assert.match(source, /function closeFloatingMenus\(\) \{/);
  assert.match(source, /if \(showEmojiMenu\) \{\s*setShowEmojiMenu\(false\);\s*\}/);
  assert.match(source, /if \(showTextColorMenu\) \{\s*setShowTextColorMenu\(false\);\s*\}/);
  assert.match(source, /if \(showCellColorMenu\) \{\s*setShowCellColorMenu\(false\);\s*\}/);
  assert.match(source, /if \(showTableMenu\) \{\s*setShowTableMenu\(false\);\s*\}/);

  const editorFocusBody =
    source.match(/function handleEditorFocus\(\) \{([\s\S]*?)\n  \}/)
      ?.[1] ?? "";
  assert.match(editorFocusBody, /closeFloatingMenus\(\)/);
});

test("rich text editor text clicks avoid unnecessary state updates", () => {
  const clearSelectedCellsBody =
    source.match(/function clearSelectedCells\(\) \{([\s\S]*?)\n  \}/)
      ?.[1] ?? "";
  assert.match(clearSelectedCellsBody, /const highlightedCells = Array\.from/);
  assert.match(clearSelectedCellsBody, /if \(highlightedCells\.length > 0 \|\| selectedCells\.length > 0\) \{\s*setSelectedCells\(\[\]\);\s*\}/);

  const editorMouseDownBody =
    source.match(/function handleEditorMouseDown\(event: MouseEvent<HTMLDivElement>\) \{([\s\S]*?)\n  \}/)
      ?.[1] ?? "";
  assert.doesNotMatch(editorMouseDownBody, /setShowEmojiMenu\(false\)/);

  const editorMouseUpBody =
    source.match(/function handleEditorMouseUp\(\) \{([\s\S]*?)\n  \}/)
      ?.[1] ?? "";
  assert.match(editorMouseUpBody, /if \(isSelectingCells\) \{\s*setIsSelectingCells\(false\);\s*\}/);
});

test("rich text editor mouseup does not re-render toolbar state while focusing text", () => {
  const editorMouseUpBody =
    source.match(/function handleEditorMouseUp\(\) \{([\s\S]*?)\n  \}/)
      ?.[1] ?? "";
  assert.match(editorMouseUpBody, /saveSelection\(\)/);
  assert.doesNotMatch(editorMouseUpBody, /updateToolbarState\(\)/);
});

test("rich text image chip opens an image picker", () => {
  assert.match(source, /onClick=\{openImagePicker\}/);
  assert.match(source, /<ImagePlus size=\{16\} \/>/);
  assert.match(source, /<input[\s\S]*type="file"[\s\S]*accept="image\/\*"/);
});

test("rich text image insertion uploads images instead of embedding base64", () => {
  assert.match(source, /async function uploadInlineImage/);
  assert.match(source, /fetch\("\/api\/admin\/uploads"/);
  assert.match(source, /insertInlineImage\(data\.url\)/);
  assert.doesNotMatch(source, /readAsDataURL/);
});

test("notice form does not wrap the rich text editor in a label", () => {
  assert.doesNotMatch(
    formSource,
    /<label[^>]*>\s*\{labels\.body\}[\s\S]*?<AdminRichTextEditor[\s\S]*?<\/label>/
  );
});
