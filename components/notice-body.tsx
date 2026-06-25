const imagePattern = /^!\[(.*?)\]\((.*?)\)$/;
const htmlPattern = /<(?:p|div|span|strong|b|table|tbody|tr|td|th|img|br|font|strike|s|u)[\s>]/i;
const emojiPattern =
  /(?:[\p{Extended_Pictographic}\u{1f1e6}-\u{1f1ff}](?:\ufe0f|\u{1f3fb}|\u{1f3fc}|\u{1f3fd}|\u{1f3fe}|\u{1f3ff})?(?:\u200d[\p{Extended_Pictographic}\u{1f1e6}-\u{1f1ff}](?:\ufe0f|\u{1f3fb}|\u{1f3fc}|\u{1f3fd}|\u{1f3fe}|\u{1f3ff})?)*)|(?:[#*0-9]\ufe0f?\u20e3)/gu;
const twemojiBaseUrl = "https://cdn.jsdelivr.net/gh/jdecked/twemoji@16.0.1/assets/svg";

type NoticeBodyProps = {
  body: string;
};

export function NoticeBody({ body }: NoticeBodyProps) {
  if (htmlPattern.test(body)) {
    return (
      <div
        className="notice-rich-body"
        dangerouslySetInnerHTML={{ __html: renderTwemojiInHtml(normalizeLegacyImages(body)) }}
      />
    );
  }

  return (
    <div className="grid gap-4">
      {body.split("\n").map((line, index) => {
        const match = line.match(imagePattern);

        if (match) {
          return (
            <img
              key={`${line}-${index}`}
              src={match[2]}
              alt={match[1]}
              className="max-h-[520px] w-full rounded-lg object-contain"
            />
          );
        }

        if (!line.trim()) {
          return <div key={index} className="h-2" />;
        }

        return (
          <p
            key={`${line}-${index}`}
            dangerouslySetInnerHTML={{ __html: renderTwemojiText(line) }}
          />
        );
      })}
    </div>
  );
}

function renderTwemojiInHtml(html: string) {
  return html
    .split(/(<[^>]+>)/g)
    .map((part) => (part.startsWith("<") ? part : renderTwemojiText(part, false)))
    .join("");
}

function renderTwemojiText(value: string, escapePlainText = true) {
  const source = escapePlainText ? escapeText(value) : value;
  return source.replace(emojiPattern, (emoji) => {
    const codePoint = toTwemojiCodePoint(emoji);
    return `<img class="twemoji" alt="${escapeAttribute(emoji)}" src="${twemojiBaseUrl}/${codePoint}.svg">`;
  });
}

function toTwemojiCodePoint(emoji: string) {
  return Array.from(emoji)
    .map((char) => char.codePointAt(0))
    .filter((codePoint): codePoint is number => Boolean(codePoint) && codePoint !== 0xfe0f)
    .map((codePoint) => codePoint.toString(16))
    .join("-");
}

function normalizeLegacyImages(body: string) {
  return body.replace(
    /!\[(.*?)\]\((.*?)\)/g,
    (_match, alt: string, src: string) =>
      `<img src="${escapeAttribute(src)}" alt="${escapeAttribute(alt)}" class="notice-inline-image">`
  );
}

function escapeAttribute(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeText(value: string) {
  return escapeAttribute(value);
}
