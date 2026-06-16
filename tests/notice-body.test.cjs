const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");
const { test } = require("node:test");
const ts = require("typescript");

function loadNoticeBody() {
  const source = readFileSync("components/notice-body.tsx", "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2021
    }
  }).outputText;
  const module = { exports: {} };

  Function("exports", "require", "module", "__filename", "__dirname", compiled)(
    module.exports,
    require,
    module,
    resolve("components/notice-body.tsx"),
    resolve("components")
  );

  return module.exports;
}

test("legacy markdown image attributes are escaped before rich HTML rendering", () => {
  const { NoticeBody } = loadNoticeBody();
  const element = NoticeBody({
    body: '<p>![bad "alt](/uploads/notices/a" onerror="alert.png)</p>'
  });

  assert.equal(
    element.props.dangerouslySetInnerHTML.__html,
    '<p><img src="/uploads/notices/a&quot; onerror=&quot;alert.png" alt="bad &quot;alt" class="notice-inline-image"></p>'
  );
});
