const imageMarkdownPattern = /!\[(.*?)\]\((.*?)\)/g;
const htmlTagPattern = /<[^>]+>/g;
const whitespacePattern = /\s+/g;

const namedEntities: Record<string, string> = {
  amp: "&",
  gt: ">",
  lt: "<",
  nbsp: " ",
  quot: '"',
  apos: "'"
};

export function getNoticeExcerpt(body: string) {
  return decodeHtmlEntities(
    body
      .replace(imageMarkdownPattern, " ")
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/<\/(?:p|div|li|tr|h[1-6])>/gi, " ")
      .replace(htmlTagPattern, " ")
      .replace(whitespacePattern, " ")
      .trim()
  );
}

function decodeHtmlEntities(value: string) {
  return value.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (match, entity: string) => {
    const normalized = entity.toLowerCase();

    if (normalized.startsWith("#x")) {
      return decodeCodePoint(Number.parseInt(normalized.slice(2), 16), match);
    }

    if (normalized.startsWith("#")) {
      return decodeCodePoint(Number.parseInt(normalized.slice(1), 10), match);
    }

    return namedEntities[normalized] ?? match;
  });
}

function decodeCodePoint(value: number, fallback: string) {
  if (!Number.isFinite(value)) {
    return fallback;
  }

  try {
    return String.fromCodePoint(value);
  } catch {
    return fallback;
  }
}
