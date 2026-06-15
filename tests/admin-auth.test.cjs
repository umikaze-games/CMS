const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const { join } = require("node:path");
const { rmSync } = require("node:fs");
const { test } = require("node:test");

rmSync(".tmp-tests", { recursive: true, force: true });
execFileSync(
  process.execPath,
  [
    join("node_modules", "typescript", "bin", "tsc"),
    "lib/admin-auth.ts",
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

const auth = require("../.tmp-tests/admin-auth.js");

test("validates configured admin credentials exactly", () => {
  assert.equal(
    auth.verifyAdminCredentials("admin@example.com", "secret", {
      ADMIN_EMAIL: "admin@example.com",
      ADMIN_PASSWORD: "secret"
    }),
    true
  );
  assert.equal(
    auth.verifyAdminCredentials("admin@example.com", "wrong", {
      ADMIN_EMAIL: "admin@example.com",
      ADMIN_PASSWORD: "secret"
    }),
    false
  );
  assert.equal(auth.verifyAdminCredentials("admin@example.com", "secret", {}), false);
});

test("does not require secure cookies unless explicitly enabled", () => {
  assert.equal(auth.isAdminCookieSecure({}), false);
  assert.equal(auth.isAdminCookieSecure({ ADMIN_COOKIE_SECURE: "false" }), false);
  assert.equal(auth.isAdminCookieSecure({ ADMIN_COOKIE_SECURE: "true" }), true);
});

test("creates verifiable session tokens and rejects tampering", async () => {
  const token = await auth.createAdminSessionToken({
    email: "admin@example.com",
    secret: "long-test-secret",
    now: 1_000,
    maxAgeSeconds: 60
  });

  assert.equal(
    await auth.verifyAdminSessionToken(token, {
      secret: "long-test-secret",
      now: 1_030
    }),
    true
  );
  assert.equal(
    await auth.verifyAdminSessionToken(`${token}x`, {
      secret: "long-test-secret",
      now: 1_030
    }),
    false
  );
});

test("rejects expired session tokens", async () => {
  const token = await auth.createAdminSessionToken({
    email: "admin@example.com",
    secret: "long-test-secret",
    now: 1_000,
    maxAgeSeconds: 60
  });

  assert.equal(
    await auth.verifyAdminSessionToken(token, {
      secret: "long-test-secret",
      now: 1_061
    }),
    false
  );
});
