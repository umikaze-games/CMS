import type { GameTitle } from "@/lib/types";

const storageKey = "admin-game-titles";
const changeEventName = "admin-game-titles-change";

export function normalizeGameName(name: string) {
  return name.trim().replace(/\s+/g, " ").toLocaleLowerCase();
}

export function hasGameName(games: GameTitle[], name: string, ignoreIndex?: number) {
  const normalized = normalizeGameName(name);
  return games.some(
    (game, index) => index !== ignoreIndex && normalizeGameName(game.name) === normalized
  );
}

export function dedupeGames(games: GameTitle[]) {
  const seen = new Set<string>();
  return games.filter((game) => {
    const normalized = normalizeGameName(game.name);
    if (!normalized || seen.has(normalized)) {
      return false;
    }
    seen.add(normalized);
    return true;
  });
}

export function createGameId(name: string) {
  const slug = name
    .trim()
    .toLocaleLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const suffix =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : String(Date.now());

  return `${slug || "game"}-${suffix}`;
}

export function loadGameTitles(defaultGames: GameTitle[]) {
  if (typeof window === "undefined") {
    return dedupeGames(defaultGames);
  }

  try {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) {
      return dedupeGames(defaultGames);
    }

    const parsed = JSON.parse(saved) as GameTitle[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return dedupeGames(defaultGames);
    }

    return dedupeGames(parsed);
  } catch {
    return dedupeGames(defaultGames);
  }
}

export function saveGameTitles(games: GameTitle[]) {
  if (typeof window === "undefined") {
    return;
  }

  const nextGames = dedupeGames(games);
  window.localStorage.setItem(storageKey, JSON.stringify(nextGames));
  window.dispatchEvent(new Event(changeEventName));
}

export function subscribeGameTitlesChange(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === storageKey) {
      callback();
    }
  };

  window.addEventListener(changeEventName, callback);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(changeEventName, callback);
    window.removeEventListener("storage", handleStorage);
  };
}
