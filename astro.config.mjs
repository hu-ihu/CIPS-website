import { defineConfig } from 'astro/config';

// 纯静态站点：`npm run build` 直接产出可部署的 dist/，不引入任何 UI 框架。
// 产物由 CI 强推到 pages 分支（见 .gitlab-ci.yml），CD 侧监听该分支即可。
export default defineConfig({
  site: 'https://cips.nyist.edu.cn',
  output: 'static',
  // 旧站所有 URL 都是目录式并以 / 结尾（/wiki/cips/contact/），保持一致以免外链失效。
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  legacy: {
    // 让 Astro 自己为 src/content/<collection>/ 生成 glob loader，避免
    // `astro/loaders` 把 CJS 依赖带进内容同步用的临时 Vite 服务器。
    // 详见 src/content.config.ts 顶部的说明。
    collectionsBackwardsCompat: true,
  },
});
