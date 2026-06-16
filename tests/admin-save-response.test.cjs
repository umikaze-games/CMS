const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const { rmSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");

rmSync(".tmp-tests", { recursive: true, force: true });
execFileSync(
  process.execPath,
  [
    join("node_modules", "typescript", "bin", "tsc"),
    "lib/admin-save-response.ts",
    "--outDir",
    ".tmp-tests",
    "--module",
    "commonjs",
    "--target",
    "es2020",
    "--esModuleInterop",
    "--skipLibCheck"
  ],
  { stdio: "inherit" }
);

const { getSaveResponseMessage } = require("../.tmp-tests/admin-save-response.js");

test("uses API JSON message when present", async () => {
  const response = new Response(JSON.stringify({ message: "入力内容を確認してください。" }), {
    status: 400,
    headers: { "content-type": "application/json" }
  });

  assert.equal(await getSaveResponseMessage(response), "入力内容を確認してください。");
});

test("turns HTML 413 responses into a server upload limit message", async () => {
  const response = new Response("<html><body>413 Request Entity Too Large</body></html>", {
    status: 413,
    headers: { "content-type": "text/html" }
  });

  assert.equal(
    await getSaveResponseMessage(response),
    "サーバーのアップロード上限を超えました。管理者にNginxのclient_max_body_size設定を確認してください。"
  );
});

test("falls back when a non-JSON server error is returned", async () => {
  const response = new Response("<html><body>Bad Gateway</body></html>", {
    status: 502,
    headers: { "content-type": "text/html" }
  });

  assert.equal(
    await getSaveResponseMessage(response),
    "保存に失敗しました。時間をおいてもう一度お試しください。"
  );
});
