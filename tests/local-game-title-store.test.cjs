const assert = require("node:assert/strict");
const { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } = require("node:fs");
const { join, resolve } = require("node:path");
const { test } = require("node:test");
const ts = require("typescript");

const repoRoot = process.cwd();
const seedGameTitles = [
  { id: "stella-quest", name: "Stella Quest" },
  { id: "pixel-arena", name: "Pixel Arena" }
];

function loadLocalGameTitleStore() {
  const source = readFileSync(join(repoRoot, "lib", "local-game-title-store.ts"), "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2021
    }
  }).outputText;
  const module = { exports: {} };
  const localRequire = (id) => {
    if (id === "@/lib/admin-game-titles") {
      return {
        dedupeGames: (games) => {
          const seen = new Set();
          return games.filter((game) => {
            const key = game.name.trim().toLocaleLowerCase();
            if (!key || seen.has(key)) {
              return false;
            }
            seen.add(key);
            return true;
          });
        }
      };
    }
    if (id === "@/lib/mock-data") {
      return { gameTitles: seedGameTitles };
    }
    return require(id);
  };

  Function("exports", "require", "module", "__filename", "__dirname", compiled)(
    module.exports,
    localRequire,
    module,
    join(repoRoot, "lib", "local-game-title-store.ts"),
    join(repoRoot, "lib")
  );

  return module.exports;
}

test("local game title store seeds only when the store file is missing", async () => {
  const cwd = process.cwd();
  const tempCwd = resolve(".tmp-tests-local-game-title-seed");
  rmSync(tempCwd, { recursive: true, force: true });
  mkdirSync(tempCwd, { recursive: true });
  process.chdir(tempCwd);

  try {
    const { getLocalGameTitles } = loadLocalGameTitleStore();
    const games = await getLocalGameTitles();

    assert.deepEqual(games, seedGameTitles);
    assert.equal(existsSync(join(tempCwd, ".local-game-titles.json")), true);
  } finally {
    process.chdir(cwd);
  }
});

test("local game title store persists normalized game titles", async () => {
  const cwd = process.cwd();
  const tempCwd = resolve(".tmp-tests-local-game-title-save");
  const storePath = join(tempCwd, ".local-game-titles.json");
  rmSync(tempCwd, { recursive: true, force: true });
  mkdirSync(tempCwd, { recursive: true });
  process.chdir(tempCwd);

  try {
    const { getLocalGameTitles, saveLocalGameTitles } = loadLocalGameTitleStore();
    await saveLocalGameTitles([
      { id: "one", name: "One" },
      { id: "duplicate", name: "one" },
      { id: "two", name: "Two" }
    ]);

    assert.deepEqual(await getLocalGameTitles(), [
      { id: "one", name: "One" },
      { id: "two", name: "Two" }
    ]);
    assert.deepEqual(JSON.parse(readFileSync(storePath, "utf8")), [
      { id: "one", name: "One" },
      { id: "two", name: "Two" }
    ]);
  } finally {
    process.chdir(cwd);
  }
});

test("local game title store does not overwrite an unreadable existing store", async () => {
  const cwd = process.cwd();
  const tempCwd = resolve(".tmp-tests-local-game-title-invalid");
  const storePath = join(tempCwd, ".local-game-titles.json");
  rmSync(tempCwd, { recursive: true, force: true });
  mkdirSync(tempCwd, { recursive: true });
  writeFileSync(storePath, "{not-json", "utf8");
  process.chdir(tempCwd);

  try {
    const { getLocalGameTitles } = loadLocalGameTitleStore();

    await assert.rejects(() => getLocalGameTitles(), /Unexpected token|Expected property name/);
    assert.equal(readFileSync(storePath, "utf8"), "{not-json");
  } finally {
    process.chdir(cwd);
  }
});
