# Tennis Online

一个中文网球装备浏览器，首版聚焦球拍。站点使用 Next.js App Router、TypeScript、Tailwind、Prisma 和 SQLite，支持品牌/特点/规格/价格筛选、详情页和 2-4 支球拍对比。

## 开发

```bash
npm install
Copy-Item .env.example .env
npm run prisma:generate
npm run prisma:push
npm run seed
npm run dev
```

打开 `http://localhost:3000` 查看网站。

## 数据同步

```bash
npm run sync:rackets
```

同步脚本会先写入精选基础数据，再尝试抓取配置来源的商品卡片并更新价格/图片。外部来源失败时不会删除旧数据，`SyncRun` 会记录 `partial_success` 和错误信息。

## 验证

```bash
npm run test
npm run build
```
