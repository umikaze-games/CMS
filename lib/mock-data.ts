import type { GameTitle, Notice, NoticeCategory } from "@/lib/types";

const important = "\u91cd\u8981";
const maintenance = "\u30e1\u30f3\u30c6\u30ca\u30f3\u30b9";
const event = "\u30a4\u30d9\u30f3\u30c8";
const campaign = "\u30ad\u30e3\u30f3\u30da\u30fc\u30f3";
const update = "\u30a2\u30c3\u30d7\u30c7\u30fc\u30c8";
const bug = "\u4e0d\u5177\u5408";
const other = "\u305d\u306e\u4ed6";

export const gameTitles: GameTitle[] = [
  { id: "stella-quest", name: "Stella Quest" },
  { id: "pixel-arena", name: "Pixel Arena" },
  { id: "dragon-frontier", name: "Dragon Frontier" }
];

export const noticeCategories: NoticeCategory[] = [
  { id: "important", name: important, color: "#e11d48", sortOrder: 1 },
  { id: "maintenance", name: maintenance, color: "#2563eb", sortOrder: 2 },
  { id: "event", name: event, color: "#059669", sortOrder: 3 },
  { id: "campaign", name: campaign, color: "#d97706", sortOrder: 4 },
  { id: "update", name: update, color: "#7c3aed", sortOrder: 5 },
  { id: "bug", name: bug, color: "#be123c", sortOrder: 6 },
  { id: "other", name: other, color: "#475467", sortOrder: 7 }
];

export const notices: Notice[] = [
  {
    id: "maintenance-20260526",
    gameId: "stella-quest",
    categoryId: "important",
    title: "\u30e1\u30f3\u30c6\u30ca\u30f3\u30b9\u306e\u304a\u77e5\u3089\u305b",
    body:
      "\u30b5\u30fc\u30d3\u30b9\u54c1\u8cea\u5411\u4e0a\u306e\u305f\u3081\u3001\u4e0b\u8a18\u65e5\u7a0b\u3067\u30e1\u30f3\u30c6\u30ca\u30f3\u30b9\u3092\u5b9f\u65bd\u3057\u307e\u3059\u3002\n\n\u671f\u9593\u4e2d\u306f\u4e00\u90e8\u6a5f\u80fd\u3092\u3054\u5229\u7528\u3044\u305f\u3060\u3051\u306a\u3044\u5834\u5408\u304c\u3042\u308a\u307e\u3059\u3002\u3054\u4e0d\u4fbf\u3092\u304a\u304b\u3051\u3057\u307e\u3059\u304c\u3001\u3054\u7406\u89e3\u306e\u307b\u3069\u3088\u308d\u3057\u304f\u304a\u9858\u3044\u3044\u305f\u3057\u307e\u3059\u3002",
    bannerImage:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    status: "published",
    isPinned: true,
    publishAt: "2026-05-26T09:00:00+09:00",
    newBadgeStartAt: null,
    newBadgeEndAt: null,
    createdAt: "2026-05-20T10:00:00+09:00",
    updatedAt: "2026-05-24T14:30:00+09:00",
    sortOrder: 1
  },
  {
    id: "event-20260525",
    gameId: "stella-quest",
    categoryId: "event",
    title: "\u65b0\u30a4\u30d9\u30f3\u30c8\u958b\u50ac\uff01",
    body:
      "\u671f\u9593\u9650\u5b9a\u30a4\u30d9\u30f3\u30c8\u3092\u958b\u50ac\u3057\u307e\u3059\u3002\u30a4\u30d9\u30f3\u30c8\u9650\u5b9a\u5831\u916c\u3084\u7279\u5225\u30df\u30c3\u30b7\u30e7\u30f3\u3092\u7528\u610f\u3057\u3066\u3044\u307e\u3059\u306e\u3067\u3001\u305c\u3072\u3054\u53c2\u52a0\u304f\u3060\u3055\u3044\u3002",
    bannerImage:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80",
    status: "published",
    isPinned: false,
    publishAt: "2026-05-25T12:00:00+09:00",
    newBadgeStartAt: null,
    newBadgeEndAt: null,
    createdAt: "2026-05-21T16:00:00+09:00",
    updatedAt: "2026-05-25T12:00:00+09:00",
    sortOrder: 10
  },
  {
    id: "campaign-20260524",
    gameId: "stella-quest",
    categoryId: "campaign",
    title: "\u4e8b\u524d\u767b\u9332\u5831\u916c\u516c\u958b",
    body:
      "\u4e8b\u524d\u767b\u9332\u8005\u6570\u306e\u9054\u6210\u306b\u5fdc\u3058\u305f\u5831\u916c\u5185\u5bb9\u3092\u516c\u958b\u3057\u307e\u3057\u305f\u3002\u6b63\u5f0f\u30b5\u30fc\u30d3\u30b9\u958b\u59cb\u5f8c\u3001\u5bfe\u8c61\u306e\u7686\u3055\u307e\u306b\u9806\u6b21\u914d\u5e03\u3057\u307e\u3059\u3002",
    bannerImage:
      "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80",
    status: "published",
    isPinned: false,
    publishAt: "2026-05-24T18:00:00+09:00",
    newBadgeStartAt: null,
    newBadgeEndAt: null,
    createdAt: "2026-05-18T11:00:00+09:00",
    updatedAt: "2026-05-24T18:00:00+09:00",
    sortOrder: 20
  },
  {
    id: "update-20260522",
    gameId: "stella-quest",
    categoryId: "update",
    title: "\u30a2\u30d7\u30ea\u30d0\u30fc\u30b8\u30e7\u30f3 1.2.0 \u914d\u4fe1",
    body:
      "\u65b0\u6a5f\u80fd\u306e\u8ffd\u52a0\u3068\u4e00\u90e8\u8868\u793a\u306e\u6539\u5584\u3092\u884c\u3044\u307e\u3057\u305f\u3002\u30b9\u30c8\u30a2\u3088\u308a\u6700\u65b0\u7248\u3078\u30a2\u30c3\u30d7\u30c7\u30fc\u30c8\u3057\u3066\u3054\u5229\u7528\u304f\u3060\u3055\u3044\u3002",
    bannerImage: null,
    status: "published",
    isPinned: false,
    publishAt: "2026-05-22T10:00:00+09:00",
    newBadgeStartAt: null,
    newBadgeEndAt: null,
    createdAt: "2026-05-20T09:00:00+09:00",
    updatedAt: "2026-05-22T10:00:00+09:00",
    sortOrder: 30
  },
  {
    id: "draft-sample",
    gameId: "stella-quest",
    categoryId: "other",
    title: "\u4e0b\u66f8\u304d\u30b5\u30f3\u30d7\u30eb",
    body: "\u7ba1\u7406\u753b\u9762\u306e\u72b6\u614b\u8868\u793a\u78ba\u8a8d\u7528\u3067\u3059\u3002\u516c\u5f0f\u30b5\u30a4\u30c8\u5074\u306b\u306f\u8868\u793a\u3055\u308c\u307e\u305b\u3093\u3002",
    bannerImage: null,
    status: "draft",
    isPinned: false,
    publishAt: "2026-06-10T10:00:00+09:00",
    newBadgeStartAt: null,
    newBadgeEndAt: null,
    createdAt: "2026-06-01T10:00:00+09:00",
    updatedAt: "2026-06-01T10:00:00+09:00",
    sortOrder: 99
  }
];
