import { NextResponse } from "next/server";
import { createNoticeTemplate } from "@/lib/notice-templates";
import { getNoticeTemplates, saveNoticeTemplate } from "@/lib/server-notice-templates";

const invalidTemplate =
  "\u30c6\u30f3\u30d7\u30ec\u30fc\u30c8\u306e\u5185\u5bb9\u304c\u6b63\u3057\u304f\u3042\u308a\u307e\u305b\u3093\u3002";
const saveFailed =
  "\u30c6\u30f3\u30d7\u30ec\u30fc\u30c8\u306e\u4fdd\u5b58\u306b\u5931\u6557\u3057\u307e\u3057\u305f\u3002";

export async function GET() {
  return NextResponse.json({ templates: await getNoticeTemplates() });
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as {
      categoryId?: unknown;
      title?: unknown;
      body?: unknown;
    } | null;
    const categoryId = String(body?.categoryId ?? "").trim();

    if (!categoryId) {
      return NextResponse.json({ message: invalidTemplate }, { status: 400 });
    }

    const template = createNoticeTemplate(
      categoryId,
      String(body?.title ?? ""),
      String(body?.body ?? "")
    );
    await saveNoticeTemplate(template);

    return NextResponse.json({ template, templates: await getNoticeTemplates() });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : saveFailed },
      { status: 400 }
    );
  }
}
