import { NextResponse } from "next/server";
import { dedupeGames } from "@/lib/admin-game-titles";
import { getLocalGameTitles, saveLocalGameTitles } from "@/lib/local-game-title-store";
import { deleteLocalNoticesByGameIds } from "@/lib/local-notice-store";
import { getGameTitles } from "@/lib/notices";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { GameTitle } from "@/lib/types";

const saveFailed = "\u30b2\u30fc\u30e0\u30bf\u30a4\u30c8\u30eb\u306e\u4fdd\u5b58\u306b\u5931\u6557\u3057\u307e\u3057\u305f\u3002";
const invalidGames = "\u30b2\u30fc\u30e0\u30bf\u30a4\u30c8\u30eb\u304c\u6b63\u3057\u304f\u3042\u308a\u307e\u305b\u3093\u3002";

export async function GET() {
  return NextResponse.json({ games: await getGameTitles() });
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as { games?: unknown } | null;
    const games = readGameTitles(body?.games);

    if (games.length === 0) {
      return NextResponse.json({ message: invalidGames }, { status: 400 });
    }

    if (!supabaseAdmin) {
      const currentGames = await getLocalGameTitles();
      const deleteIds = getDeletedGameIds(currentGames, games);
      await deleteLocalNoticesByGameIds(deleteIds);
      return NextResponse.json({ games: await saveLocalGameTitles(games), local: true });
    }

    const rows = games.map((game) => ({
      id: game.id,
      name: game.name,
      updated_at: new Date().toISOString()
    }));

    const { error: upsertError } = await supabaseAdmin.from("game_titles").upsert(rows);

    if (upsertError) {
      throw upsertError;
    }

    const { data: existingRows, error: existingError } = await supabaseAdmin
      .from("game_titles")
      .select("id");

    if (existingError) {
      throw existingError;
    }

    const nextIds = new Set(games.map((game) => game.id));
    const deleteIds =
      existingRows?.map((row) => String(row.id)).filter((id) => !nextIds.has(id)) ?? [];

    if (deleteIds.length > 0) {
      const { error: noticeDeleteError } = await supabaseAdmin
        .from("notices")
        .delete()
        .in("game_id", deleteIds);

      if (noticeDeleteError) {
        throw noticeDeleteError;
      }

      const { error: deleteError } = await supabaseAdmin
        .from("game_titles")
        .delete()
        .in("id", deleteIds);

      if (deleteError) {
        throw deleteError;
      }
    }

    return NextResponse.json({ games });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : saveFailed },
      { status: 400 }
    );
  }
}

function getDeletedGameIds(currentGames: GameTitle[], nextGames: GameTitle[]) {
  const nextIds = new Set(nextGames.map((game) => game.id));
  return currentGames.map((game) => game.id).filter((id) => !nextIds.has(id));
}

function readGameTitles(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return dedupeGames(
    value.flatMap((item): GameTitle[] => {
      if (!item || typeof item !== "object") {
        return [];
      }

      const id = "id" in item ? String(item.id).trim() : "";
      const name = "name" in item ? String(item.name).trim() : "";

      if (!id || !name) {
        return [];
      }

      return [{ id, name }];
    })
  );
}
