/**
 * 站点级配置。
 *
 * 待补充项（见 README「需要补充的信息」）：
 * - icp.number / police.number：ICP 备案号与公安备案号
 * - repository：如果 git.nyist 上的组织/仓库名不是 cips/cips-website，请一并修改
 */
export const SITE = {
  title: 'CIPS @ NYIST',
  name: 'NYIST-CIPS',
  subtitle: '南阳理工学院-计算机与信息化处理协会',
  description:
    '南阳理工学院-计算机与信息化处理协会（CIPS @ NYIST）——由在校 GNU/Linux 爱好者发起并组成的团体，旨在搭建信息交流共享的平台，宣传自由软件的价值，推广自由软件的应用。',
  url: 'https://cips.nyist.edu.cn',
  locale: 'zh-CN',
  email: 'cips@nyist.edu.cn',
  address: '河南省南阳市长江路 80 号 南阳理工学院 东南校区 13 教 211 室',
  /** 主仓库（git.nyist 上的 GitLab） */
  repository: 'https://git.nyist.edu.cn/cips/cips-website',
  gitlab: 'https://git.nyist.edu.cn/',
  mirrors: 'https://mirror.nyist.edu.cn/',
  icp: {
    number: '豫ICP备（待补充）号',
    url: 'https://beian.miit.gov.cn/',
  },
  police: {
    number: '豫公网安备（待补充）号',
    url: 'https://beian.mps.gov.cn/',
  },
} as const;

/** 顶部主导航 */
export const MAIN_NAV = [
  { title: 'Wiki', url: '/wiki/' },
  { title: 'News', url: '/news/' },
  { title: 'Planet', url: '/planet/' },
  { title: '代码托管', url: SITE.gitlab, external: true },
  { title: '镜像站', url: SITE.mirrors, external: true },
] as const;

/** Wiki 左侧导航，对应旧站 _data/navigation.yml 的 wiki 段 */
export const WIKI_NAV = [
  {
    title: 'CIPS @ NYIST',
    children: [
      { title: 'CIPS 首页', url: '/' },
      { title: 'CIPS 新闻', url: '/news/' },
      { title: '友情链接', url: '/wiki/cips/links/' },
      { title: '开源软件镜像', url: '/wiki/server/mirrors/' },
    ],
  },
  {
    title: '活动',
    children: [
      { title: 'CIPS 活动', url: '/wiki/cips/events/' },
      { title: '邮件列表', url: '/wiki/cips/mailinglist/' },
    ],
  },
  {
    title: '服务',
    children: [
      { title: '镜像站', url: '/wiki/cips/services/mirrors/' },
      { title: 'Git 服务', url: '/wiki/cips/services/gitlab/' },
      { title: 'PXE 服务', url: '/wiki/cips/services/pxe/' },
    ],
  },
  {
    title: '联系',
    children: [
      { title: 'CIPS 负责人', url: '/wiki/cips/person-in-charge/' },
      { title: '联系我们', url: '/wiki/cips/contact/' },
      { title: '加入我们', url: '/wiki/cips/contribute/' },
    ],
  },
] as const;

/** 页脚快捷链接，对应旧站 _includes/footer.html */
export const FOOTER_LINKS = [
  { title: '关于我们', url: '/wiki/intro/' },
  { title: '联系我们', url: '/wiki/cips/contact/' },
  { title: '加入我们', url: '/wiki/cips/contribute/' },
  { title: 'RSS 订阅', url: '/feed/' },
  { title: '本站仓库', url: SITE.repository, external: true },
] as const;

/** 首页 / 404 页的服务入口磁贴，对应旧站 _pages/index.html 的 lug-nav */
export const SERVICE_TILES = {
  left: [
    { title: '开源镜像站', url: SITE.mirrors, color: 'red', external: true },
    { title: 'IPTV', url: 'https://iptv.nyist.edu.cn/', color: 'green', external: true },
    { title: 'PXE', url: 'https://pxe.nyist.edu.cn/', color: 'blue', external: true },
    { title: '更多服务', url: '/wiki/cips/services/', color: 'yellow' },
  ],
  right: [
    { title: '活动日历', url: '/wiki/cips/events/calendar/', color: 'red' },
    { title: '联系我们', url: '/wiki/cips/contact/', color: 'green' },
    { title: '捐赠我们', url: '/wiki/cips/finance/donate/', color: 'blue' },
    { title: '友情链接', url: '/wiki/cips/links/', color: 'yellow' },
  ],
} as const;

/** 首页右侧协会简介（取自旧站首页文案） */
export const HOME_ABOUT = [
  '南阳理工学院-计算机与信息化处理协会是由南阳理工学院在校的 GNU/Linux 爱好者发起并组成的团体，旨在搭建信息交流共享的平台，宣传自由软件的价值，提高自由软件社区文化氛围，推广自由软件的应用。',
  '当前，由协会正在建设和运维管理的物理服务器集群 8 台，大型高性能集群一个，约提供高达 150TB 的高性能存储空间，大多数数字基建应用部署基于这些硬件设施。协会不会将活动发展范围设限于计算机与软件学院，而是面向全校各学院各专业，共同交流协作，促进各行业中的信息化应用发展，同时协助信息化建设与管理中心帮助学校各单位进行信息化转型，协会也因此使命得名：计算机与信息化处理协会。',
] as const;
