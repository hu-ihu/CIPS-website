import type { IconName } from '../utils/icons';

/**
 * 站点级配置。
 *
 * 备案号沿用 nyist.edu.cn 主站（cips.nyist.edu.cn 是其子域），数值取自学校官网
 * www.nyist.edu.cn 页脚。仍需确认：repository 是否就是 git.nyist 上的 cips/cips-website。
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
  /** 默认社交分享图（1200×630） */
  ogImage: '/static/og-default.jpg',
  icp: {
    number: '豫ICP备05011695号',
    url: 'https://beian.miit.gov.cn/',
  },
  police: {
    number: '豫公网安备 41130202000350号',
    url: 'http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=41130202000350',
  },
} as const;

export interface NavItem {
  title: string;
  url: string;
  /** 图标名，见 src/utils/icons.ts */
  icon: IconName;
  /** 站外链接（新窗口打开） */
  external?: boolean;
}

export interface NavGroup {
  title: string;
  children: NavItem[];
}

export type TileColor = 'red' | 'green' | 'blue' | 'yellow';

export interface Tile extends NavItem {
  color: TileColor;
}

/**
 * 顶部主导航。
 * 旧站是「Wiki / News / Planet / GitHub / Mirrors」，本站把 GitHub 换成了
 * git.nyist 的 GitLab（代码托管），镜像站保持原样。
 */
export const MAIN_NAV: NavItem[] = [
  { title: 'Wiki', url: '/wiki/', icon: 'book' },
  { title: 'News', url: '/news/', icon: 'newspaper' },
  { title: 'Planet', url: '/planet/', icon: 'planet' },
  { title: '代码托管', url: SITE.gitlab, icon: 'git-branch', external: true },
  { title: '镜像站', url: SITE.mirrors, icon: 'server', external: true },
];

/** Wiki 左侧导航，对应旧站 _data/navigation.yml 的 wiki 段 */
export const WIKI_NAV: NavGroup[] = [
  {
    title: 'CIPS @ NYIST',
    children: [
      { title: 'CIPS 首页', url: '/', icon: 'home' },
      { title: 'CIPS 新闻', url: '/news/', icon: 'newspaper' },
      { title: '友情链接', url: '/wiki/cips/links/', icon: 'link' },
      { title: '开源软件镜像', url: '/wiki/server/mirrors/', icon: 'database' },
    ],
  },
  {
    title: '活动',
    children: [
      { title: 'CIPS 活动', url: '/wiki/cips/events/', icon: 'sparkles' },
      { title: '邮件列表', url: '/wiki/cips/mailinglist/', icon: 'envelope' },
    ],
  },
  {
    title: '服务',
    children: [
      { title: '镜像站', url: '/wiki/cips/services/mirrors/', icon: 'server' },
      { title: 'Git 服务', url: '/wiki/cips/services/gitlab/', icon: 'git-branch' },
      { title: 'PXE 服务', url: '/wiki/cips/services/pxe/', icon: 'deploy' },
    ],
  },
  {
    title: '联系',
    children: [
      { title: 'CIPS 负责人', url: '/wiki/cips/person-in-charge/', icon: 'user' },
      { title: '联系我们', url: '/wiki/cips/contact/', icon: 'phone' },
      { title: '加入我们', url: '/wiki/cips/contribute/', icon: 'users' },
    ],
  },
];

/** 页脚快捷链接，对应旧站 _includes/footer.html */
export const FOOTER_LINKS: NavItem[] = [
  { title: '关于我们', url: '/wiki/intro/', icon: 'id-card' },
  { title: '联系我们', url: '/wiki/cips/contact/', icon: 'phone' },
  { title: '加入我们', url: '/wiki/cips/contribute/', icon: 'users' },
  { title: 'RSS 订阅', url: '/feed/', icon: 'rss' },
  { title: '本站仓库', url: SITE.repository, icon: 'git-branch', external: true },
];

/**
 * 首页 / 404 页的服务入口磁贴，对应旧站 _pages/index.html 的 lug-nav。
 * 图标沿用旧站的语义（企鹅=开源镜像站、电视=IPTV、光盘=PXE…），
 * 但换成自绘 SVG（旧站用的 Font Awesome Pro 图标不能复制）。
 */
export const SERVICE_TILES: { left: Tile[]; right: Tile[] } = {
  left: [
    { title: '开源镜像站', url: SITE.mirrors, icon: 'penguin', color: 'red', external: true },
    { title: 'IPTV', url: 'https://iptv.nyist.edu.cn/', icon: 'tv', color: 'green', external: true },
    { title: 'PXE', url: 'https://pxe.nyist.edu.cn/', icon: 'disc', color: 'blue', external: true },
    { title: '更多服务', url: '/wiki/cips/services/', icon: 'chevron-right', color: 'yellow' },
  ],
  right: [
    { title: '活动日历', url: '/wiki/cips/events/calendar/', icon: 'calendar', color: 'red' },
    { title: '联系我们', url: '/wiki/cips/contact/', icon: 'comments', color: 'green' },
    { title: '捐赠我们', url: '/wiki/cips/finance/donate/', icon: 'thumbs-up', color: 'blue' },
    { title: '友情链接', url: '/wiki/cips/links/', icon: 'link', color: 'yellow' },
  ],
};

/** 首页右侧协会简介（取自旧站首页文案） */
export const HOME_ABOUT = [
  '南阳理工学院-计算机与信息化处理协会是由南阳理工学院在校的 GNU/Linux 爱好者发起并组成的团体，旨在搭建信息交流共享的平台，宣传自由软件的价值，提高自由软件社区文化氛围，推广自由软件的应用。',
  '当前，由协会正在建设和运维管理的物理服务器集群 8 台，大型高性能集群一个，约提供高达 150TB 的高性能存储空间，大多数数字基建应用部署基于这些硬件设施。协会不会将活动发展范围设限于计算机与软件学院，而是面向全校各学院各专业，共同交流协作，促进各行业中的信息化应用发展，同时协助信息化建设与管理中心帮助学校各单位进行信息化转型，协会也因此使命得名：计算机与信息化处理协会。',
] as const;
