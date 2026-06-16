import path from "path";

const uploadUrlPrefix = "/uploads/notices/";
const uploadDirSegments = ["public", "uploads", "notices"];

export function getLocalNoticeUploadUrl(fileName: string) {
  return `${uploadUrlPrefix}${fileName}`;
}

export function getLocalNoticeUploadDir() {
  return path.join(process.cwd(), ...uploadDirSegments);
}

export function getLocalNoticeUploadPath(fileName: string) {
  const safeName = path.basename(fileName);
  return path.join(getLocalNoticeUploadDir(), safeName);
}

export function isLocalNoticeUploadUrl(value: string) {
  return value.startsWith(uploadUrlPrefix);
}
