# お知らせ CMS

公式サイトに表示するお知らせ一覧・詳細と、管理画面で投稿する CMS を分けた Next.js 構成です。

## 画面

- 公式サイト側：`/notices`
- お知らせ詳細：`/notices/[id]`
- 管理者ログイン：`/admin/login`
- お知らせ管理：`/admin/notices`
- 新規作成：`/admin/notices/new`
- 編集：`/admin/notices/[id]/edit`

## 主な機能

- カテゴリー絞り込み
- 画像バナー表示
- 重要なお知らせの上部固定表示
- 公開日・更新日表示
- タイトル、本文、カテゴリー、画像、公開状態、予約公開、固定表示、表示順の入力
- Supabase Storage への画像アップロード API

## セットアップ

```bash
npm install
npm run dev
```

PowerShell で `npm` が実行ポリシーに止められる場合は、Windows の `npm.cmd` を使ってください。

```bash
npm.cmd install
npm.cmd run dev
```

## Supabase

1. Supabase プロジェクトを作成します。
2. `supabase/schema.sql` を Supabase SQL Editor で実行します。
3. `.env.example` を `.env.local` にコピーして値を入れます。
4. 管理 API は `SUPABASE_SERVICE_ROLE_KEY` を使うため、ブラウザに公開しないでください。

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

現時点の一覧・詳細表示は `lib/mock-data.ts` のサンプルデータを読んでいます。実 DB 表示に切り替える場合は、`lib/notices.ts` の取得処理を Supabase クエリに差し替えます。

## DB 構成

`notices`

- `id`
- `category_id`
- `title`
- `body`
- `banner_image`
- `status`
- `is_pinned`
- `publish_at`
- `sort_order`
- `created_at`
- `updated_at`

`notice_categories`

- `id`
- `name`
- `color`
- `sort_order`
- `created_at`
- `updated_at`
