const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { test } = require("node:test");

test("admin notices page supports an all-games filter", () => {
  const source = readFileSync("app/admin/notices/page.tsx", "utf8");

  assert.match(source, /params\.game === "all"/);
  assert.match(source, /getAdminNotices\(currentGameId === "all" \? undefined : currentGameId\)/);
  assert.match(source, /href=\{`\/admin\/notices\/new\?game=\$\{createGameId\}`\}/);
});

test("admin notices query omits game filtering for all games", () => {
  const source = readFileSync("lib/notices.ts", "utf8");

  assert.match(source, /export async function getAdminNotices\(gameId\?: string\)/);
  assert.match(source, /if \(gameId\) \{[\s\S]*?query = query\.eq\("game_id", gameId\);[\s\S]*?\}/);
  assert.match(source, /\.filter\(\(notice\) => \(gameId \? notice\.gameId === gameId : true\)\)/);
});

test("admin game switcher includes an all option", () => {
  const source = readFileSync("components/admin-game-switcher.tsx", "utf8");

  assert.match(source, /const allGamesValue = "all"/);
  assert.match(source, /label: allGamesLabel, value: allGamesValue/);
  assert.match(source, /includeAllGames \? \[\{ label: allGamesLabel, value: allGamesValue \}\] : \[\]/);
  assert.match(source, /\.\.\.gameItems\.map\(\(game\) => \(\{ label: game\.name, value: game\.id \}\)\)/);
});

test("admin all-games notice list shows each notice game title", () => {
  const pageSource = readFileSync("app/admin/notices/page.tsx", "utf8");
  const tableSource = readFileSync("components/admin-notices-table.tsx", "utf8");

  assert.match(pageSource, /<AdminNoticesTable notices=\{notices\} currentGameId=\{currentGameId\} games=\{games\} \/>/);
  assert.match(tableSource, /games: GameTitle\[\]/);
  assert.match(tableSource, /const showGameTitle = currentGameId === "all"/);
  assert.match(tableSource, /const \[gameFilter, setGameFilter\] = useState\("all"\)/);
  assert.match(tableSource, /new Map\(games\.map\(\(game\) => \[game\.id, game\.name\]\)\)/);
  assert.match(tableSource, /const gameFilterOptions: FilterOption\[\] = games\.map\(\(game\) => \(\{\s*label: game\.name,\s*value: game\.id\s*\}\)\)/);
  assert.match(tableSource, /const matchesGame = gameFilter === "all" \|\| notice\.gameId === gameFilter/);
  assert.match(tableSource, /return matchesGame && matchesCategory && matchesStatus/);
  assert.match(tableSource, /\{showGameTitle \? \(\s*<th className="w-\[13%\] rounded-tl-2xl px-3 py-3">[\s\S]*label=\{labels\.gameTitle\}/);
  assert.match(tableSource, /\{showGameTitle \? \(\s*<td className="px-4 py-4 font-bold text-slate-700">/);
  assert.match(tableSource, /<th className=\{`\$\{showGameTitle \? "w-\[4%\]" : "w-\[4%\] rounded-tl-2xl"\} px-2 py-3`\} \/>/);
  assert.match(tableSource, /gameNameById\.get\(notice\.gameId\) \?\? notice\.gameId/);
  assert.doesNotMatch(tableSource, /<span className="shrink-0">\{labels\.gameTitle\}<\/span>/);
});

test("admin notices table refreshes when route-provided notices change", () => {
  const source = readFileSync("components/admin-notices-table.tsx", "utf8");

  assert.match(source, /const \[items, setItems\] = useState\(initial\)/);
  assert.match(source, /useEffect\(\(\) => \{\s*setItems\(initial\);\s*\}, \[initial\]\)/);
});
