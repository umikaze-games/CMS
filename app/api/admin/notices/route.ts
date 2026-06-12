import { NextResponse } from "next/server";
import { createLocalNotice } from "@/lib/local-notice-store";
import { readNoticeFormData, slugifyFileName } from "@/lib/notice-form";
import { supabaseAdmin } from "@/lib/supabase-admin";

const saveFailed = "\u4fdd\u5b58\u306b\u5931\u6557\u3057\u307e\u3057\u305f\u3002";

export async function POST(request: Request) {
  if (!supabaseAdmin) {
    try {
      const formData = await request.formData();
      const values = readNoticeFormData(formData);
      const bannerImage = values.banner ? await fileToDataUrl(values.banner) : null;
      const notice = await createLocalNotice({
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
      return NextResponse.json({ id: notice.id, local: true });
    } catch (error) {
      return NextResponse.json(
        { message: error instanceof Error ? error.message : saveFailed },
        { status: 400 }
      );
    }
  }

  try {
    const formData = await request.formData();
    const values = readNoticeFormData(formData);
    let bannerImage: string | null = null;

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
        .eq("game_id", values.gameId);
    }

    const { data, error } = await supabaseAdmin
      .from("notices")
      .insert({
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
        sort_order: values.sortOrder
      })
      .select("id")
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ id: data.id });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : saveFailed },
      { status: 400 }
    );
  }
}

async function fileToDataUrl(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  return `data:${file.type || "image/png"};base64,${buffer.toString("base64")}`;
}
