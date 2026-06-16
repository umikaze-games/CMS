"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AdminSelect } from "@/components/admin-select";
import { loadGameTitles, subscribeGameTitlesChange } from "@/lib/admin-game-titles";
import type { GameTitle } from "@/lib/types";

const gameLabel = "\u30b2\u30fc\u30e0\u30bf\u30a4\u30c8\u30eb";
const allGamesLabel = "\u5168\u90e8";
const allGamesValue = "all";

type AdminGameSwitcherProps = {
  games: GameTitle[];
  currentGameId?: string;
  includeAllGames?: boolean;
};

export function AdminGameSwitcher({
  games,
  currentGameId,
  includeAllGames = false
}: AdminGameSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [gameItems, setGameItems] = useState(games);
  const value = useMemo(() => {
    if (includeAllGames && currentGameId === allGamesValue) {
      return allGamesValue;
    }

    if (currentGameId && gameItems.some((game) => game.id === currentGameId)) {
      return currentGameId;
    }

    return gameItems[0]?.id ?? "";
  }, [currentGameId, gameItems]);

  useEffect(() => {
    const syncGames = () => setGameItems(loadGameTitles(games));
    syncGames();
    return subscribeGameTitlesChange(syncGames);
  }, [games]);

  useEffect(() => {
    if (!value || value === currentGameId) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set("game", value);
    router.replace(`${pathname}?${params.toString()}`);
  }, [currentGameId, pathname, router, searchParams, value]);

  function handleChange(gameId: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("game", gameId);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="py-3">
      <AdminSelect
        label={gameLabel}
        name="sidebar_game_id"
        value={value}
        onChange={handleChange}
        options={[
          ...(includeAllGames ? [{ label: allGamesLabel, value: allGamesValue }] : []),
          ...gameItems.map((game) => ({ label: game.name, value: game.id }))
        ]}
      />
    </div>
  );
}
