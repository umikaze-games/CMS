export type NoticeStatus = "draft" | "published" | "hidden";

export type NoticeCategory = {
  id: string;
  name: string;
  color: string;
  sortOrder: number;
};

export type GameTitle = {
  id: string;
  name: string;
};

export type Notice = {
  id: string;
  gameId: string;
  categoryId: string;
  title: string;
  body: string;
  bannerImage: string | null;
  status: NoticeStatus;
  isPinned: boolean;
  publishAt: string;
  newBadgeStartAt: string | null;
  newBadgeEndAt: string | null;
  createdAt: string;
  updatedAt: string;
  sortOrder: number;
};

export type NoticeWithCategory = Notice & {
  category: NoticeCategory;
};
