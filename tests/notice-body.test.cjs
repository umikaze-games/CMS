const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");
const { test } = require("node:test");
const ts = require("typescript");

const globalCss = readFileSync("app/globals.css", "utf8");

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

test("front notice rich body renders emoji with Twemoji assets", () => {
  const { NoticeBody } = loadNoticeBody();
  const element = NoticeBody({
    body: "<p>OK 😀</p>"
  });

  assert.match(
    element.props.dangerouslySetInnerHTML.__html,
    /<img class="twemoji" alt="😀" src="https:\/\/cdn\.jsdelivr\.net\/gh\/jdecked\/twemoji@16\.0\.1\/assets\/svg\/1f600\.svg">/
  );
});

test("front notice rich body keeps existing HTML entities while rendering emoji", () => {
  const { NoticeBody } = loadNoticeBody();
  const element = NoticeBody({
    body: "<p>A&nbsp;B 😀</p>"
  });

  assert.match(element.props.dangerouslySetInnerHTML.__html, /A&nbsp;B/);
  assert.doesNotMatch(element.props.dangerouslySetInnerHTML.__html, /&amp;nbsp;/);
});

test("front notice rich body preserves bold text styling", () => {
  assert.match(globalCss, /\.notice-rich-body\s+(?:b|strong)/);
  assert.match(globalCss, /font-weight:\s*(?:700|800|900|bold)/);
});

test("front Twemoji images align with text instead of using notice image sizing", () => {
  assert.match(globalCss, /\.twemoji/);
  assert.match(globalCss, /height:\s*1\.15em/);
  assert.match(globalCss, /vertical-align:\s*-0\.18em/);
});
