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
    "lib/supabase-config.ts",
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

const { hasSupabaseCmsConfig } = require("../.tmp-tests/supabase-config.js");

test("requires all Supabase CMS keys to enable database mode", () => {
  assert.equal(hasSupabaseCmsConfig({}), false);
  assert.equal(
    hasSupabaseCmsConfig({
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon"
    }),
    false
  );
  assert.equal(
    hasSupabaseCmsConfig({
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      SUPABASE_SERVICE_ROLE_KEY: "service"
    }),
    false
  );
  assert.equal(
    hasSupabaseCmsConfig({
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon",
      SUPABASE_SERVICE_ROLE_KEY: "service"
    }),
    true
  );
});
