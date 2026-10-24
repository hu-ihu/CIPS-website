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
  /* 首页 / 404 服务磁贴用的彩色图标：旧站这里是 Font Awesome Pro 的彩色与双色调图标
     （Pro 的路径数据不能复制），这里按同样的配色与造型自绘。 */

  /** 磁贴：开源镜像站（Tux） */
  'tile-mirror':
    '<path d="M12 2.4c-2.5 0-4 1.8-4 4.1 0 .7.1 1.4.3 2-1.7 1.4-2.9 3.7-3.4 6.2-.3 1.5-.4 3-.3 4.1 0 .5.4.9.9.9h13c.5 0 .9-.4.9-.9.1-1.1 0-2.6-.3-4.1-.5-2.5-1.7-4.8-3.4-6.2.2-.6.3-1.3.3-2 0-2.3-1.5-4.1-4-4.1Z" fill="#1d1d1b" stroke="none"/><path d="M12 11.2c-1.8 0-2.9 2.4-3.1 5.1-.1 1.2 0 2.3.1 3.1h6c.1-.8.2-1.9.1-3.1-.2-2.7-1.3-5.1-3.1-5.1Z" fill="#ffffff" stroke="none"/><circle cx="10.5" cy="6.7" r="1.35" fill="#ffffff" stroke="none"/><circle cx="10.65" cy="6.9" r=".62" fill="#1d1d1b" stroke="none"/><circle cx="13.5" cy="6.7" r="1.35" fill="#ffffff" stroke="none"/><circle cx="13.35" cy="6.9" r=".62" fill="#1d1d1b" stroke="none"/><path d="M11.15 8.5h1.7l-.85 1.65z" fill="#f6a800" stroke="none"/><ellipse cx="9.7" cy="20.9" rx="1.7" ry=".95" fill="#f6a800" stroke="none"/><ellipse cx="14.3" cy="20.9" rx="1.7" ry=".95" fill="#f6a800" stroke="none"/>',
  /** 磁贴：IPTV */
  'tile-iptv':
    '<rect x="2.2" y="4.6" width="19.6" height="12.6" rx="2.4" fill="#757575" stroke="none"/><rect x="4.4" y="6.8" width="15.2" height="8.2" rx="1" fill="#e2e2e2" stroke="none"/><rect x="11.3" y="17.2" width="1.4" height="2.6" fill="#757575" stroke="none"/><rect x="8.6" y="19.8" width="6.8" height="1.9" rx=".95" fill="#757575" stroke="none"/>',
  /** 磁贴：PXE（光盘） */
  'tile-pxe':
    '<circle cx="12" cy="12" r="9.4" fill="#4a4a4a" stroke="none"/><circle cx="12" cy="12" r="3.3" fill="#f2f2f2" stroke="none"/><circle cx="12" cy="12" r="1.15" fill="#4a4a4a" stroke="none"/><path d="M6.6 7.9a6.8 6.8 0 0 1 3.3-2.5" stroke="#bdbdbd" stroke-width="1.2" fill="none" stroke-linecap="round"/>',
  /** 磁贴：更多服务 */
  'tile-more':
    '<circle cx="12" cy="12" r="9.4" fill="#3d3d3d" stroke="none"/><path d="M10.2 7.8 14.4 12l-4.2 4.2" stroke="#ffffff" stroke-width="1.9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  /** 活动日历 */
  calendar:
    '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18"/><path d="M8 3v4M16 3v4"/><path d="M7.5 14h.01M12 14h.01M16.5 14h.01M7.5 17.5h.01M12 17.5h.01"/>',
  /** 磁贴：活动日历（双色调） */
  'tile-calendar':
    '<rect x="2.6" y="4.2" width="18.8" height="16.8" rx="2.6" fill="#ef6a55" stroke="none"/><rect x="4.6" y="9.4" width="14.8" height="9.2" rx="1.3" fill="#ffffff" stroke="none"/><rect x="7.6" y="2.4" width="1.8" height="3.6" rx=".9" fill="#b8432f" stroke="none"/><rect x="14.6" y="2.4" width="1.8" height="3.6" rx=".9" fill="#b8432f" stroke="none"/><circle cx="8.4" cy="12.3" r=".85" fill="#ef6a55" stroke="none"/><circle cx="12" cy="12.3" r=".85" fill="#ef6a55" stroke="none"/><circle cx="15.6" cy="12.3" r=".85" fill="#ef6a55" stroke="none"/><circle cx="8.4" cy="15.5" r=".85" fill="#ef6a55" stroke="none"/><circle cx="12" cy="15.5" r=".85" fill="#ef6a55" stroke="none"/>',
  /** 磁贴：联系我们（双色对话气泡） */
  'tile-contact':
    '<path d="M9.2 3.4c-3.6 0-6.5 2.4-6.5 5.4 0 1.7 1 3.2 2.6 4.2l-.7 2.7 3-1.6c.5.1 1.1.2 1.6.2 3.6 0 6.5-2.4 6.5-5.5S12.8 3.4 9.2 3.4Z" fill="#a9c98a" stroke="none"/><path d="M15.4 7.4c3.3 0 6 2.2 6 5 0 1.6-1 3-2.5 3.9l.6 2.5-2.7-1.4c-.4.1-.9.1-1.4.1-3.3 0-6-2.2-6-5.1s2.7-5 6-5Z" fill="#6d9c3f" stroke="none"/>',
  /** 磁贴：捐赠我们（双色调大拇指） */
  'tile-donate':
    '<rect x="2.6" y="10.8" width="3.4" height="9.8" rx="1" fill="#2f6fa8" stroke="none"/><path d="M7 12.1 11.2 4.4a1.9 1.9 0 0 1 3.4 1.4l-.6 4.4h5a1.9 1.9 0 0 1 1.9 2.2l-.9 6a1.9 1.9 0 0 1-1.9 1.6H7Z" fill="#5b9bd5" stroke="none"/>',
  /** 磁贴：友情链接（双色链条） */
  'tile-links':
    '<path d="M10.3 13.7a3.6 3.6 0 0 0 5.1 0l2.8-2.8a3.6 3.6 0 0 0-5.1-5.1l-1 1" stroke="#c9a227" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M13.7 10.3a3.6 3.6 0 0 0-5.1 0l-2.8 2.8a3.6 3.6 0 0 0 5.1 5.1l1-1" stroke="#e0bd4a" stroke-width="2.2" fill="none" stroke-linecap="round"/>',
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
