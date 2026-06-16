const assert = require("node:assert/strict");
const { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } = require("node:fs");
const { join, resolve } = require("node:path");
const { test } = require("node:test");
const ts = require("typescript");

const repoRoot = process.cwd();
const seedNotices = [
  {
    id: "seed-notice",
    gameId: "stella-quest",
    categoryId: "maintenance",
    title: "Seed",
    body: "Body",
    bannerImage: null,
    status: "draft",
    isPinned: false,
    publishAt: "2026-06-16T00:00:00+09:00",
    newBadgeStartAt: null,
    newBadgeEndAt: null,
    createdAt: "2026-06-16T00:00:00.000Z",
    updatedAt: "2026-06-16T00:00:00.000Z",
    sortOrder: 50
  }
];

function loadLocalNoticeStore() {
  const source = readFileSync(join(repoRoot, "lib", "local-notice-store.ts"), "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2021
    }
  }).outputText;
  const module = { exports: {} };
  const localRequire = (id) => {
    if (id === "@/lib/local-banner-store") {
      return {
        migrateLocalBannerDataUrls: async (items) => ({ items, changed: false })
      };
    }
    if (id === "@/lib/mock-data") {
      return { notices: seedNotices };
    }
    return require(id);
  };

  Function("exports", "require", "module", "__filename", "__dirname", compiled)(
    module.exports,
    localRequire,
    module,
    join(repoRoot, "lib", "local-notice-store.ts"),
    join(repoRoot, "lib")
  );

  return module.exports;
}

test("local notice store seeds only when the store file is missing", async () => {
  const cwd = process.cwd();
  const tempCwd = resolve(".tmp-tests-local-notice-seed");
  rmSync(tempCwd, { recursive: true, force: true });
  mkdirSync(tempCwd, { recursive: true });
  process.chdir(tempCwd);

  try {
    const { getLocalNotices } = loadLocalNoticeStore();
    const notices = await getLocalNotices();

    assert.deepEqual(notices, seedNotices);
    assert.equal(existsSync(join(tempCwd, ".local-notices.json")), true);
  } finally {
    process.chdir(cwd);
  }
});

test("local notice store does not overwrite an unreadable existing store", async () => {
  const cwd = process.cwd();
  const tempCwd = resolve(".tmp-tests-local-notice-invalid");
  const storePath = join(tempCwd, ".local-notices.json");
  rmSync(tempCwd, { recursive: true, force: true });
  mkdirSync(tempCwd, { recursive: true });
  writeFileSync(storePath, "{not-json", "utf8");
  process.chdir(tempCwd);

  try {
    const { getLocalNotices } = loadLocalNoticeStore();

    await assert.rejects(() => getLocalNotices(), /Unexpected token|Expected property name/);
    assert.equal(readFileSync(storePath, "utf8"), "{not-json");
  } finally {
    process.chdir(cwd);
  }
});
