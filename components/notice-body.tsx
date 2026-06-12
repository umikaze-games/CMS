const imagePattern = /^!\[(.*?)\]\((.*?)\)$/;
const htmlPattern = /<(?:p|div|span|strong|b|table|tbody|tr|td|th|img|br|font|strike|s|u)[\s>]/i;

type NoticeBodyProps = {
  body: string;
};

export function NoticeBody({ body }: NoticeBodyProps) {
  if (htmlPattern.test(body)) {
    return (
      <div
        className="notice-rich-body"
        dangerouslySetInnerHTML={{ __html: normalizeLegacyImages(body) }}
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

        return <p key={`${line}-${index}`}>{line}</p>;
      })}
    </div>
  );
}

function normalizeLegacyImages(body: string) {
  return body.replace(
    /!\[(.*?)\]\((.*?)\)/g,
    '<img src="$2" alt="$1" class="notice-inline-image">'
  );
}
