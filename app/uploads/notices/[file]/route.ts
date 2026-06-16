import { promises as fs } from "fs";
import { NextResponse } from "next/server";
import { getLocalNoticeUploadPath } from "@/lib/local-upload-path";

type RouteContext = {
  params: Promise<{
    file: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { file } = await context.params;

  try {
    const filePath = getLocalNoticeUploadPath(file);
    const body = await fs.readFile(filePath);

    return new NextResponse(body, {
      headers: {
        "cache-control": "public, max-age=31536000, immutable",
        "content-type": getImageContentType(file)
      }
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}

function getImageContentType(fileName: string) {
  const extension = fileName.split(".").pop()?.toLowerCase();

  switch (extension) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "gif":
      return "image/gif";
    case "webp":
      return "image/webp";
    case "svg":
      return "image/svg+xml";
    default:
      return "image/png";
  }
}
