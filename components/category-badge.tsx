import type { NoticeCategory } from "@/lib/types";

const importantLabel = "\u91cd\u8981";

type CategoryBadgeProps = {
  category: NoticeCategory;
  isPinned?: boolean;
};

export function CategoryBadge({ category, isPinned = false }: CategoryBadgeProps) {
  return (
    <span
      className="inline-flex h-7 w-28 items-center justify-center whitespace-nowrap rounded-md px-3 text-xs font-black uppercase tracking-normal"
      style={{
        color: isPinned ? "#be123c" : category.color,
        backgroundColor: isPinned ? "rgba(255, 241, 242, 0.96)" : `${category.color}12`
      }}
    >
      {isPinned ? importantLabel : category.name}
    </span>
  );
}
