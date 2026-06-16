const japanTimeZone = "Asia/Tokyo";
const timezonePattern = /(?:Z|[+-]\d{2}:\d{2})$/;
const datetimeLocalPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2})?$/;

export function normalizeJapanDateTime(value: string) {
  if (!datetimeLocalPattern.test(value) || timezonePattern.test(value)) {
    return value;
  }

  return `${value.length === 16 ? `${value}:00` : value}+09:00`;
}

export function parseNoticeDateTime(value: string) {
  return new Date(normalizeJapanDateTime(value));
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: japanTimeZone
  })
    .format(parseNoticeDateTime(value))
    .replaceAll("/", ".");
}

export function formatDateWithTime(value: string) {
  const date = parseNoticeDateTime(value);
  const dateText = formatDate(value);
  const timeText = new Intl.DateTimeFormat("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: japanTimeZone
  }).format(date);

  return `${dateText} ${timeText}`;
}

export function formatDateTimeLocal(value: string) {
  return formatJapanDateTimeLocal(parseNoticeDateTime(value));
}

export function addDaysLocalDateTime(value: string, days: number) {
  const date = parseNoticeDateTime(value);
  date.setUTCDate(date.getUTCDate() + days);
  return formatJapanDateTimeLocal(date);
}

export function getNewBadgeRange(publishAt: string, startAt?: string | null, endAt?: string | null) {
  const start = startAt || publishAt;
  const end = endAt || addDaysLocalDateTime(start, 7);
  return { start, end };
}

export function isNoticeNew(
  notice: {
    status?: string;
    publishAt: string;
    newBadgeStartAt?: string | null;
    newBadgeEndAt?: string | null;
  },
  now = new Date()
) {
  const publishTime = parseNoticeDateTime(notice.publishAt).getTime();
  const currentTime = now.getTime();

  if (notice.status && notice.status !== "published") {
    return false;
  }

  if (publishTime > currentTime) {
    return false;
  }

  const range = getNewBadgeRange(notice.publishAt, notice.newBadgeStartAt, notice.newBadgeEndAt);
  return (
    parseNoticeDateTime(range.start).getTime() <= currentTime &&
    currentTime < parseNoticeDateTime(range.end).getTime()
  );
}

function formatJapanDateTimeLocal(date: Date) {
  const parts = new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: japanTimeZone
  }).formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value ?? "";

  return `${part("year")}-${part("month")}-${part("day")}T${part("hour")}:${part("minute")}`;
}
