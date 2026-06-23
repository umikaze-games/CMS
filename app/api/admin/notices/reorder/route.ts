import { NextResponse } from "next/server";
import { reorderLocalNotices } from "@/lib/local-notice-store";
import { supabaseAdmin } from "@/lib/supabase-admin";

const invalidOrder = "\u8868\u793a\u9806\u306e\u30c7\u30fc\u30bf\u304c\u6b63\u3057\u304f\u3042\u308a\u307e\u305b\u3093\u3002";

type ReorderPayload = {
  orderedIds?: unknown;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as ReorderPayload | null;
  const orderedIds = parseOrderedIds(body?.orderedIds);

  if (!orderedIds) {
    return NextResponse.json({ message: invalidOrder }, { status: 400 });
  }

  if (!supabaseAdmin) {
    await reorderLocalNotices(orderedIds);
    return NextResponse.json({ orderedIds, local: true });
  }

  const now = new Date().toISOString();

  for (const [index, id] of orderedIds.entries()) {
    const { error } = await supabaseAdmin
      .from("notices")
      .update({ sort_order: index + 1, updated_at: now })
      .eq("id", id);

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
  }

  return NextResponse.json({ orderedIds });
}

function parseOrderedIds(value: unknown) {
  if (!Array.isArray(value)) {
    return null;
  }

  const orderedIds = value
    .filter((id): id is string => typeof id === "string")
    .map((id) => id.trim())
    .filter(Boolean);

  if (orderedIds.length !== value.length || new Set(orderedIds).size !== orderedIds.length) {
    return null;
  }

  return orderedIds;
}
