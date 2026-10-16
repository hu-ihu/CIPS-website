/**
 * 内联 SVG 图标集（24×24 画布，线性描边风格，颜色跟随 currentColor）。
 *
 * 为什么自绘：旧站用 Font Awesome Pro（`kit-pro.fontawesome.com` 的 kit，以及并未入库的
 * `_extra/fontawesome/`）。其中 `fad` 双色图标与 `fa-star-shooting`、`fa-planet-ringed`、
 * `fa-sparkles`、`fa-users-medical` 等都属于 Pro 专有内容，授权上不能复制其路径数据。
 * 因此这里按新架构自绘一套语义等价的图标：零依赖、无外部 CDN、可随文字颜色变化。
 *
 * 用法见 src/components/Icon.astro。图标内容里需要实心的地方（眼睛、圆点）自行写了
 * fill/stroke 覆盖，其余继承 svg 根节点的描边设置。
 */
export const ICONS = {
  /** Wiki / 文档 */
  book: '<path d="M12 6.5C10.4 4.9 8.3 4.4 5 4.4H4v13.2h1c3.3 0 5.4.5 7 2.1 1.6-1.6 3.7-2.1 7-2.1h1V4.4h-1c-3.3 0-5.4.5-7 2.1Z"/><path d="M12 6.5v13.2"/>',
  /** News */
  newspaper:
    '<rect x="3.5" y="5" width="12" height="14.5" rx="1.5"/><path d="M15.5 8.5H19a1.5 1.5 0 0 1 1.5 1.5v7.5a2 2 0 0 1-2 2H5.5"/><path d="M6.5 8.5h6M6.5 11.5h6M6.5 14.5h3.5"/>',
  /** Planet（行星 + 环） */
  planet:
    '<circle cx="12" cy="12" r="5"/><ellipse cx="12" cy="12" rx="10" ry="3.6" transform="rotate(-24 12 12)"/>',
  /** 代码托管 / Git 服务 */
  'git-branch':
    '<path d="M6 5.5v9.9"/><circle cx="6" cy="18" r="2.6"/><circle cx="18" cy="6" r="2.6"/><path d="M18 8.6a9.4 9.4 0 0 1-9.4 9.4"/>',
  /** 服务器 / 镜像站 */
  server:
    '<rect x="3" y="4" width="18" height="7" rx="2"/><rect x="3" y="13" width="18" height="7" rx="2"/><path d="M7 7.5h.01M7 16.5h.01"/>',
  /** 首页 */
  home: '<path d="M4 10.4 12 4l8 6.4V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Z"/><path d="M9.5 21v-6.5h5V21"/>',
  /** 链接 / 友情链接 */
  link: '<path d="M10.3 13.7a3.6 3.6 0 0 0 5.1 0l2.8-2.8a3.6 3.6 0 0 0-5.1-5.1l-1 1"/><path d="M13.7 10.3a3.6 3.6 0 0 0-5.1 0l-2.8 2.8a3.6 3.6 0 0 0 5.1 5.1l1-1"/>',
  /** 数据 / 镜像源 */
  database:
    '<ellipse cx="12" cy="6" rx="7.5" ry="3"/><path d="M4.5 6v12c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3V6"/><path d="M4.5 12c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3"/>',
  /** 活动 / 亮点 */
  sparkles:
    '<path d="M10.8 3.6 12.3 7.7 16.4 9.2 12.3 10.7 10.8 14.8 9.3 10.7 5.2 9.2 9.3 7.7Z"/><path d="M17.8 14.4l.9 2.2 2.2.9-2.2.9-.9 2.2-.9-2.2-2.2-.9 2.2-.9Z"/>',
  /** 邮件列表 */
  envelope:
    '<rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="m3.9 7.3 8.1 5.5 8.1-5.5"/>',
  /** PXE / 网络启动部署 */
  deploy:
    '<rect x="3" y="4" width="18" height="6" rx="2"/><path d="M7 7h.01"/><path d="M12 10.5V17"/><path d="m9.3 14.3 2.7 2.7 2.7-2.7"/>',
  /** 负责人 */
  user: '<circle cx="12" cy="8" r="3.5"/><path d="M5 20.5c0-3.4 3.1-5.6 7-5.6s7 2.2 7 5.6"/>',
  /** 联系方式 */
  phone:
    '<path d="M6.4 3.5h3.1l1.4 3.9-2 1.4a11.6 11.6 0 0 0 5.8 5.8l1.4-2 3.9 1.4v3.1a2 2 0 0 1-2.2 2A17.1 17.1 0 0 1 4.4 5.7a2 2 0 0 1 2-2.2Z"/>',
  /** 加入我们 / 群体 */
  users:
    '<circle cx="9.6" cy="8" r="3.2"/><path d="M3.6 20c0-3.1 2.7-5 6-5s6 1.9 6 5"/><path d="M15.9 5.3a3.2 3.2 0 0 1 0 6.1"/><path d="M17.6 15.4c1.9.7 3.3 2.1 3.3 4.6"/>',
  /** 关于我们 */
  'id-card':
    '<rect x="2.5" y="5" width="19" height="14" rx="2"/><circle cx="8" cy="10.8" r="2.2"/><path d="M4.9 16.4c.5-1.6 1.7-2.5 3.1-2.5s2.6.9 3.1 2.5"/><path d="M14.2 9.8h4.3M14.2 13.3h4.3"/>',
  /** RSS 订阅 */
  rss: '<circle cx="5.6" cy="18.4" r="1.6" fill="currentColor" stroke="none"/><path d="M4 12.3a7.7 7.7 0 0 1 7.7 7.7"/><path d="M4 7a13 13 0 0 1 13 13"/>',
  /** 开源镜像站（企鹅） */
  penguin:
    '<circle cx="12" cy="6.8" r="3.6"/><ellipse cx="12" cy="15" rx="5.3" ry="6.6"/><circle cx="10.7" cy="6.4" r=".75" fill="currentColor" stroke="none"/><circle cx="13.3" cy="6.4" r=".75" fill="currentColor" stroke="none"/><path d="M11.3 8.2 12 9.5l.7-1.3Z" fill="currentColor" stroke="none"/><ellipse cx="9.6" cy="21.6" rx="2" ry="1" fill="currentColor" stroke="none"/><ellipse cx="14.4" cy="21.6" rx="2" ry="1" fill="currentColor" stroke="none"/>',
  /** IPTV */
  tv: '<rect x="2.5" y="6.5" width="19" height="12.5" rx="2"/><path d="m8 3.5 4 3 4-3"/><path d="M9 21h6"/>',
  /** PXE 镜像 / 光盘 */
  disc: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2.8"/><path d="M12 5.6a6.4 6.4 0 0 1 5.6 3.2"/>',
  /** 更多服务 */
  'chevron-right': '<circle cx="12" cy="12" r="9"/><path d="m10.4 8.4 3.8 3.6-3.8 3.6"/>',
  /** 活动日历 */
  calendar:
    '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18"/><path d="M8 3v4M16 3v4"/><path d="M7.5 14h.01M12 14h.01M16.5 14h.01M7.5 17.5h.01M12 17.5h.01"/>',
  /** 联系我们（对话） */
  comments:
    '<path d="M20.5 11.8c0 3.9-3.8 7-8.5 7-1 0-2-.1-2.9-.4L4.5 20.5l1.4-3.4a6.7 6.7 0 0 1-2.4-5.3c0-3.9 3.8-7 8.5-7s8.5 3.1 8.5 7Z"/><path d="M8.6 11.4h6.8M8.6 14.2h4"/>',
  /** 捐赠我们 */
  'thumbs-up':
    '<rect x="2.8" y="11" width="5.2" height="9.5" rx="1.6"/><path d="M8 12.2 11.6 4.4a1.7 1.7 0 0 1 3.1 1.2l-.6 4.4h5.2a1.7 1.7 0 0 1 1.7 2l-.9 6.3a1.7 1.7 0 0 1-1.7 1.4H8Z"/>',
  /** 提示 / 警告 */
  alert:
    '<circle cx="12" cy="12" r="9"/><path d="M12 7.6v5.4"/><circle cx="12" cy="16.4" r=".95" fill="currentColor" stroke="none"/>',
  /** 说明 */
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.4"/><circle cx="12" cy="7.6" r=".95" fill="currentColor" stroke="none"/>',
  /** 外部链接 */
  'external-link':
    '<path d="M13.5 4.5h6v6"/><path d="M19.5 4.5 11.5 12.5"/><path d="M18 14.2V18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.8"/>',
} as const;

export type IconName = keyof typeof ICONS;
