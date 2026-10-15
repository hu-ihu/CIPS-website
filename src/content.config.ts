import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';

/**
 * 注意：这里没有显式写 `loader`，而是配合 astro.config.mjs 里的
 * `legacy.collectionsBackwardsCompat: true` 让 Astro 自己为
 * src/content/<collection>/ 生成 glob loader。
 *
 * 原因（上游问题）：Astro 7.4.0 + Vite 8.3.4 下，内容同步会用一个
 * `ssr: { external: [] }` 的临时 Vite 服务器加载本文件；而 `astro/loaders` 的 glob
 * loader 会引入一批 CJS 依赖（yaml、picomatch、tinyglobby、p-limit、piccolore…），
 * 这些依赖会被内联并按 ESM 求值，直接报 `require is not defined`。
 * 由 Astro 自己创建 loader 时，这些包在 Node 原生上下文中加载，不受影响。
 * 上游修复后可以改回显式 `loader: glob(...)` 的写法（见 README 的已知问题一节）。
 */

/**
 * 文章（news / planet）的 front matter。
 * date 统一用 YYYY-MM-DD 字符串，避免 YAML 日期在不同时区下被解析成前一天。
 */
const postSchema = z.object({
  title: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'date 必须是 YYYY-MM-DD'),
  author: z.string().optional(),
  source: z.string().optional(),
  categories: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  /** 旧站沿用下来的固定链接；缺省时按「文件名日期 + slug」推导 */
  permalink: z.string().optional(),
  draft: z.boolean().default(false),
});

const news = defineCollection({
  type: 'content',
  schema: postSchema,
});

const planet = defineCollection({
  type: 'content',
  schema: postSchema,
});

/** Wiki 是站内固定文档，标题来自旧站正文的 H1，已在迁移时提升到 front matter。 */
const wiki = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    permalink: z.string().optional(),
    /** 是否在右侧显示目录 */
    toc: z.boolean().default(true),
  }),
});

export const collections = { news, planet, wiki };
