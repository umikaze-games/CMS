import { promises as fs } from "fs";
import { createHash } from "crypto";
import {
  getLocalNoticeUploadDir,
  getLocalNoticeUploadPath,
  getLocalNoticeUploadUrl
} from "./local-upload-path";
import type { Notice } from "./types";

const dataUrlPattern = /^data:([^;,]+)?(?:;[^,]*)?;base64,(.+)$/;

export async function saveLocalBannerFile(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = createUploadFileName(file.name, file.type, buffer);
  await writeUploadFile(fileName, buffer);
  return getLocalNoticeUploadUrl(fileName);
}

export async function migrateLocalBannerDataUrls(items: Notice[]) {
  let changed = false;
  const migratedItems: Notice[] = [];

  for (const item of items) {
    const migratedBanner = await migrateDataUrl(item.id, item.bannerImage);
    if (migratedBanner !== item.bannerImage) {
      changed = true;
      migratedItems.push({ ...item, bannerImage: migratedBanner });
    } else {
      migratedItems.push(item);
    }
  }

  return { items: migratedItems, changed };
}

function createUploadFileName(originalName: string, mimeType: string, buffer: Buffer) {
  const extension = getExtension(originalName, mimeType);
  const baseName = originalName
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const hash = createHash("sha256").update(buffer).digest("hex").slice(0, 12);

  return `${baseName || "banner"}-${Date.now()}-${hash}.${extension}`;
}

async function migrateDataUrl(noticeId: string, value: string | null) {
  if (!value?.startsWith("data:image/")) {
    return value;
  }

  const parsed = parseDataUrl(value);
  if (!parsed) {
    return value;
  }

  const hash = createHash("sha256").update(parsed.buffer).digest("hex").slice(0, 12);
  const fileName = `${sanitizeNoticeId(noticeId)}-${hash}.${getExtension("", parsed.mimeType)}`;
  await writeUploadFile(fileName, parsed.buffer);
  return getLocalNoticeUploadUrl(fileName);
}

function parseDataUrl(value: string) {
  const match = value.match(dataUrlPattern);
  if (!match) {
    return null;
  }

  return {
    mimeType: match[1] || "image/png",
    buffer: Buffer.from(match[2], "base64")
  };
}

async function writeUploadFile(fileName: string, buffer: Buffer) {
  await fs.mkdir(getLocalNoticeUploadDir(), { recursive: true });
  await fs.writeFile(getLocalNoticeUploadPath(fileName), buffer);
}

function getExtension(originalName: string, mimeType: string) {
  const originalExtension = originalName.split(".").pop()?.toLowerCase();
  if (originalExtension && /^[a-z0-9]+$/.test(originalExtension)) {
    return originalExtension === "jpeg" ? "jpg" : originalExtension;
  }

  switch (mimeType) {
    case "image/jpeg":
      return "jpg";
    case "image/gif":
      return "gif";
    case "image/webp":
      return "webp";
    case "image/svg+xml":
      return "svg";
    default:
      return "png";
  }
}

function sanitizeNoticeId(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "notice";
}
