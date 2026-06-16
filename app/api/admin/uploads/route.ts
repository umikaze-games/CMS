import { NextResponse } from "next/server";
import { validateAdminBannerFile } from "@/lib/admin-upload";
import { saveLocalBannerFile } from "@/lib/local-banner-store";
import { slugifyFileName } from "@/lib/notice-form";
import { supabaseAdmin } from "@/lib/supabase-admin";

const uploadFailed = "\u753b\u50cf\u306e\u30a2\u30c3\u30d7\u30ed\u30fc\u30c9\u306b\u5931\u6557\u3057\u307e\u3057\u305f\u3002";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const image = formData.get("image");
    const imageFile = image instanceof File && image.size > 0 ? image : null;
    const validationError = validateAdminBannerFile(imageFile);

    if (!imageFile) {
      throw new Error(uploadFailed);
    }

    if (validationError) {
      throw new Error(validationError);
    }

    if (!supabaseAdmin) {
      const url = await saveLocalBannerFile(imageFile);
      return NextResponse.json({ url, local: true });
    }

    const fileName = slugifyFileName(imageFile.name);
    const filePath = `inline/${fileName}`;
    const { error: uploadError } = await supabaseAdmin.storage
      .from("notice-banners")
      .upload(filePath, imageFile, {
        contentType: imageFile.type,
        upsert: false
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabaseAdmin.storage.from("notice-banners").getPublicUrl(filePath);
    return NextResponse.json({ url: data.publicUrl });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : uploadFailed },
      { status: 400 }
    );
  }
}
