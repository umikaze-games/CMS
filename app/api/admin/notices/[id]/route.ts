import { NextResponse } from "next/server";
import {
  deleteLocalNotice,
  updateLocalNotice,
  updateLocalNoticeStatus
} from "@/lib/local-notice-store";
import { readNoticeFormData, slugifyFileName } from "@/lib/notice-form";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { NoticeStatus } from "@/lib/types";

const updateFailed = "\u66f4\u65b0\u306b\u5931\u6557\u3057\u307e\u3057\u305f\u3002";
const invalidStatus = "\u516c\u958b\u72b6\u614b\u304c\u6b63\u3057\u304f\u3042\u308a\u307e\u305b\u3093\u3002";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PUT(request: Request, context: RouteContext) {
  if (!supabaseAdmin) {
    const { id } = await context.params;
    try {
      const formData = await request.formData();
      const values = readNoticeFormData(formData);
      const currentBannerImage = String(formData.get("current_banner_image") ?? "") || null;
      const bannerImage = values.banner ? await fileToDataUrl(values.banner) : currentBannerImage;
      await updateLocalNotice(id, {
        gameId: values.gameId,
        categoryId: values.categoryId,
        title: values.title,
        body: values.body,
        bannerImage,
        status: values.status,
        isPinned: values.isPinned,
        publishAt: values.publishAt,
        newBadgeStartAt: values.newBadgeStartAt,
        newBadgeEndAt: values.newBadgeEndAt,
        sortOrder: values.sortOrder
      });
      return NextResponse.json({ id, local: true });
    } catch (error) {
      return NextResponse.json(
        { message: error instanceof Error ? error.message : updateFailed },
        { status: 400 }
      );
    }
  }

  try {
    const { id } = await context.params;
    const formData = await request.formData();
    const values = readNoticeFormData(formData);
    let bannerImage = String(formData.get("current_banner_image") ?? "") || null;

    if (values.banner) {
      const fileName = slugifyFileName(values.banner.name);
      const filePath = `notices/${fileName}`;
      const { error: uploadError } = await supabaseAdmin.storage
        .from("notice-banners")
        .upload(filePath, values.banner, {
          contentType: values.banner.type,
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabaseAdmin.storage.from("notice-banners").getPublicUrl(filePath);
      bannerImage = data.publicUrl;
    }

    if (values.isPinned) {
      await supabaseAdmin
        .from("notices")
        .update({ is_pinned: false })
        .eq("game_id", values.gameId)
        .neq("id", id);
    }

    const { error } = await supabaseAdmin
      .from("notices")
      .update({
        game_id: values.gameId,
        category_id: values.categoryId,
        title: values.title,
        body: values.body,
        banner_image: bannerImage,
        status: values.status,
        is_pinned: values.isPinned,
        publish_at: values.publishAt,
        new_badge_start_at: values.newBadgeStartAt,
        new_badge_end_at: values.newBadgeEndAt,
        sort_order: values.sortOrder,
        updated_at: new Date().toISOString()
      })
      .eq("id", id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ id });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : updateFailed },
      { status: 400 }
    );
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const body = (await request.json().catch(() => null)) as { status?: NoticeStatus } | null;
  const status = body?.status;

  if (!status || !["draft", "published", "hidden"].includes(status)) {
    return NextResponse.json({ message: invalidStatus }, { status: 400 });
  }

  if (!supabaseAdmin) {
    await updateLocalNoticeStatus(id, status);
    return NextResponse.json({ id, status, local: true });
  }

  const { error } = await supabaseAdmin
    .from("notices")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  return NextResponse.json({ id, status });
}

export async function DELETE(_request: Request, context: RouteContext) {
  if (!supabaseAdmin) {
    const { id } = await context.params;
    await deleteLocalNotice(id);
    return NextResponse.json({ id, local: true });
  }

  const { id } = await context.params;
  const { error } = await supabaseAdmin.from("notices").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  return NextResponse.json({ id });
}

async function fileToDataUrl(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  return `data:${file.type || "image/png"};base64,${buffer.toString("base64")}`;
}
