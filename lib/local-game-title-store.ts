import { promises as fs } from "fs";
import path from "path";
import { dedupeGames } from "@/lib/admin-game-titles";
import { gameTitles as seedGameTitles } from "@/lib/mock-data";
import type { GameTitle } from "@/lib/types";

const storePath = path.join(process.cwd(), ".local-game-titles.json");

export async function getLocalGameTitles() {
  return readStore();
}

export async function saveLocalGameTitles(games: GameTitle[]) {
  const nextGames = dedupeGames(games);
  await writeStore(nextGames);
  return nextGames;
}

async function readStore() {
  try {
    const content = await fs.readFile(storePath, "utf8");
    return dedupeGames(JSON.parse(content) as GameTitle[]);
  } catch (error) {
    if (!isNotFoundError(error)) {
      throw error;
    }

    await writeStore(seedGameTitles);
    return [...seedGameTitles];
  }
}

async function writeStore(games: GameTitle[]) {
  await fs.writeFile(storePath, JSON.stringify(games, null, 2), "utf8");
}

function isNotFoundError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === "ENOENT"
  );
}
