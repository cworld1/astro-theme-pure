/**
 * Changelog Data
 * 
 * 更新日志数据文件
 * 
 * 如何添加新的更新条目：
 * 1. 在数组最前面添加新条目（新的在上面）
 * 2. 填写 date（日期）、category（类型）、zh（中文）、en（英文）
 * 3. 支持 HTML 标签来丰富内容展示
 * 
 * Category 类型说明：
 * - feature: 新功能 ✨
 * - fix: 修复 🐛
 * - content: 内容更新 📝
 * - ui: UI改进 🎨
 * - performance: 性能优化 ⚡
 */

export type ChangelogCategory = 'feature' | 'fix' | 'content' | 'ui' | 'performance'

export interface ChangelogEntry {
    date: string // 格式：YYYY-MM-DD
    category: ChangelogCategory
    zh: string // 中文描述，支持 HTML
    en: string // 英文描述，支持 HTML
}

/**
 * 更新日志条目
 * 请按时间从新到旧排序（最新的在最上面）
 */
export const changelogEntries: ChangelogEntry[] = [
    {
        date: '2026-01-12',
        category: 'content',
        zh: '📝 <b>新增文章：</b> 发布了《交易记录：TCL科技被迫减仓75%，8%大涨清仓》。',
        en: '📝 <b>New Article:</b> Published "Trading Log: Forced to Cut 75% of TCL Position, Then Exit on 8% Rally".'
    },
    {
        date: '2026-01-12',
        category: 'feature',
        zh: '✨ <b>新增更新日志页面：</b> 使用时间线组件展示网站的所有更新记录，方便追踪网站的发展历程。',
        en: '✨ <b>Added Changelog Page:</b> Display all website updates using timeline component to easily track the site\'s evolution.'
    },
    {
        date: '2026-01-12',
        category: 'ui',
        zh: '🎨 <b>首页 Header 布局调整：</b> 修改了首页 Header 栏的布局，优化视觉体验。',
        en: '🎨 <b>Homepage Header Layout:</b> Modified the homepage header layout for better visual experience.'
    },
    {
        date: '2026-01-12',
        category: 'content',
        zh: '📝 <b>文章更新：</b> 更新了文章《网站Favicon 终极解决方案》。',
        en: '📝 <b>Article Update:</b> Updated the article "The Ultimate Favicon Solution for Websites".'
    },
    {
        date: '2026-01-09',
        category: 'feature',
        zh: '💝 <b>实现捐赠弹窗：</b> 在文章页面底部添加赞赏功能，支持支付宝、微信支付以及国际支付平台。',
        en: '💝 <b>Implemented Donation Modal:</b> Added donation feature at article bottom, supporting Alipay, WeChat Pay and international payment platforms.'
    },
    {
        date: '2026-01-08',
        category: 'ui',
        zh: '🎨 <b>优化移动端导航：</b> 改进了移动端菜单的交互体验，修复了重叠和响应问题。',
        en: '🎨 <b>Optimized Mobile Navigation:</b> Improved mobile menu interaction experience, fixed overlap and responsiveness issues.'
    },
    {
        date: '2026-01-07',
        category: 'feature',
        zh: '📊 <b>Mermaid 图表复制功能：</b> 支持将 Mermaid 图表一键复制为图片，集成自定义 Toast 通知。',
        en: '📊 <b>Mermaid Copy Feature:</b> Support one-click copy Mermaid diagrams as images with custom Toast notifications.'
    },
    {
        date: '2026-01-07',
        category: 'ui',
        zh: '✨ <b>头部菜单动画：</b> 为导航菜单添加了优雅的弹跳悬停效果。',
        en: '✨ <b>Header Menu Animation:</b> Added elegant bounce hover effect to navigation menu.'
    },
    {
        date: '2026-01-05',
        category: 'feature',
        zh: '🌐 <b>评论系统优化：</b> 针对中国大陆用户优化了评论系统的可访问性。',
        en: '🌐 <b>Comment System Optimization:</b> Optimized comment system accessibility for mainland China users.'
    },
    {
        date: '2026-01-05',
        category: 'ui',
        zh: '🎨 <b>UI 主题重构：</b> 全面升级为 Gradientshub 风格，采用渐变背景和毛玻璃效果。',
        en: '🎨 <b>UI Theme Refactor:</b> Completely upgraded to Gradientshub style with gradient backgrounds and glassmorphism effects.'
    },
    {
        date: '2026-01-02',
        category: 'content',
        zh: '📝 <b>发布 Mermaid 示例文章：</b> 添加了包含 Mermaid 图表的双语示例文章。',
        en: '📝 <b>Published Mermaid Example Article:</b> Added bilingual example articles with Mermaid diagrams.'
    },
    {
        date: '2026-01-02',
        category: 'feature',
        zh: '🌍 <b>完善国际化支持：</b> 实现了完整的双语路由和内容本地化系统。',
        en: '🌍 <b>Enhanced i18n Support:</b> Implemented complete bilingual routing and content localization system.'
    },
    {
        date: '2026-01-02',
        category: 'feature',
        zh: '📈 <b>文章浏览量统计：</b> 集成浏览量统计功能，在首页和博客列表页显示。',
        en: '📈 <b>Article View Count:</b> Integrated view count feature, displayed on homepage and blog list.'
    },
    {
        date: '2025-12-30',
        category: 'feature',
        zh: '🌐 <b>语言选择器改进：</b> 将文字切换器替换为图标，优化了用户体验。',
        en: '🌐 <b>Language Picker Improvement:</b> Replaced text switcher with icon for better UX.'
    },
    {
        date: '2025-12-30',
        category: 'feature',
        zh: '🎉 <b>项目启动：</b> 建立了这个基于 Astro Theme Pure 的个人网站。',
        en: '🎉 <b>Project Launch:</b> Established this personal website based on Astro Theme Pure.'
    }
]
