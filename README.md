# Notice CMS

游戏公告发布系统。前台用于展示公告列表和公告详情，后台用于创建、编辑、发布公告。

当前线上地址:

- 前台公告列表: `https://notice.alesgames.com/notices`
- 后台登录: `https://notice.alesgames.com/admin/login`
- 后台公告管理: `https://notice.alesgames.com/admin/notices`

## 当前状态

- 已部署到腾讯云 Ubuntu 服务器。
- 域名 `notice.alesgames.com` 已指向服务器公网 IP。
- Nginx 已做反向代理。
- HTTPS 已通过 Certbot / Let's Encrypt 配置。
- PM2 已托管 Next.js 进程 `notice-cms`，并已设置开机自启。
- 后台登录已接入 `.env.local` 中的管理员账号密码，不再只是 UI 跳转。
- 后台和 `/api/admin/*` 已通过 middleware 做登录保护。
- Supabase 未配置时，公告会保存到服务器本地 `.local-notices.json`。
- Supabase 未配置时，游戏标题会保存到服务器本地 `.local-game-titles.json`。
- 本地上传图片会保存到 `public/uploads/notices/`，并通过 `/uploads/notices/[file]` 访问。

## 主要页面

前台:

- `/`: 自动跳转到 `/notices`
- `/notices`: 公告列表
- `/notices/[id]`: 公告详情

后台:

- `/admin/login`: 管理员登录
- `/admin/notices`: 公告管理
- `/admin/notices/new`: 新建公告
- `/admin/notices/[id]/edit`: 编辑公告
- `/admin/settings`: 设置页面

API:

- `POST /api/admin/auth/login`: 登录
- `POST /api/admin/auth/logout`: 登出
- `POST /api/admin/notices`: 创建公告
- `PUT /api/admin/notices/[id]`: 更新公告
- `PATCH /api/admin/notices/[id]`: 状态更新
- `DELETE /api/admin/notices/[id]`: 删除公告
- `POST /api/admin/uploads`: 上传正文图片
- `GET/PUT /api/admin/game-titles`: 读取/保存游戏标题

## 本地开发

```bash
npm install
npm run dev
```

Windows PowerShell 如果不能直接执行 `npm`，使用:

```bash
npm.cmd install
npm.cmd run dev
```

测试和构建:

```bash
npm test
npm run build
```

## 环境变量

复制 `.env.example` 为 `.env.local`，然后填写真实值。

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_EMAIL=
ADMIN_PASSWORD=
ADMIN_SESSION_SECRET=
ADMIN_COOKIE_SECURE=false
```

说明:

- `ADMIN_EMAIL` 和 `ADMIN_PASSWORD` 是后台登录账号。
- `ADMIN_SESSION_SECRET` 用于签名登录 session，请使用长随机字符串。
- HTTPS 线上环境建议设置 `ADMIN_COOKIE_SECURE=true`。
- `.env.local` 不要提交到 GitHub。
- Supabase 三项为空时，系统使用服务器本地 JSON 文件和本地图片目录运行。

## 服务器同步部署

服务器目录:

```bash
/var/www/notice-cms
```

每次本地修改并推送 GitHub 后，在服务器执行:

```bash
cd /var/www/notice-cms
git pull --ff-only
npm run build
pm2 restart notice-cms --update-env
pm2 save
```

确认当前服务器版本:

```bash
cd /var/www/notice-cms
git rev-parse --short HEAD
pm2 status
```

如果浏览器仍显示旧 UI，先按 `Ctrl + F5` 强制刷新。
如果仍然旧，检查服务器 `git rev-parse --short HEAD` 是否已经是最新 commit。

## 已修复的重要问题

- 后台登录已从纯 UI 改成真实账号密码登录。
- `/admin/*` 和 `/api/admin/*` 已加 middleware 保护。
- Nginx Basic Auth 不建议再叠加使用，避免出现双重登录弹窗。
- 公告发布时间、NEW 标签时间已按东京时间处理。
- 富文本正文的 HTML 摘要会去掉标签，不再在前台露出 `<span>` 等源码。
- 图片上传改为文件路径，不再把大图以 base64 塞进公告 JSON。
- 图片大小限制为 10MB。
- 富文本工具栏的 emoji、图片、颜色、表格弹窗已改成点击按钮打开、点击正文或外部关闭。

## 当前仍需注意

- 如果没有配置 Supabase，公告数据存放在服务器本地 `.local-notices.json`，换服务器或重装前要备份。
- 如果没有配置 Supabase，游戏标题存放在服务器本地 `.local-game-titles.json`，也要备份。
- 如果没有配置 Supabase，上传图片存放在 `public/uploads/notices/`，也需要备份。
- 设置页面里的分类、模板、账号仍有前端本地状态，多设备协作前需要改成数据库保存。
- 正式长期运营建议接入 Supabase PostgreSQL 和 Supabase Storage，避免只依赖服务器本地文件。
