import { defineConfig } from 'vitepress'
import fs from 'node:fs'
import path from 'node:path'

// Resolve docs root relative to this config file
const DOCS_ROOT = path.resolve(__dirname, '..')

// 轻量 frontmatter 解析：读取文档首部的 --- 块并转为键值
function parseFrontmatter(filePath: string): Record<string, any> {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8')
    if (!raw.startsWith('---')) return {}
    const end = raw.indexOf('\n---', 3)
    if (end === -1) return {}
    const fm = raw.slice(3, end).trim().split('\n')
    const obj: Record<string, any> = {}
    for (const line of fm) {
      const m = line.match(/^([A-Za-z0-9_]+)\s*:\s*(.*)$/)
      if (m) {
        const key = m[1]
        let val: any = m[2]
        if (val === 'true') val = true
        else if (val === 'false') val = false
        else if (!isNaN(Number(val))) val = Number(val)
        obj[key] = val
      }
    }
    return obj
  } catch { return {} }
}

function cmpNatural(a: string, b: string) {
  // 自然排序（数字感知），中文按本地比较
  return a.localeCompare(b, 'zh-Hans-CN-u-nu-hanidec', { numeric: true, sensitivity: 'base' })
}

export default defineConfig({
  lang: 'zh-CN',
  title: 'NambuWiki',
  description: 'NambuWiki 文档与设定集',
  cleanUrls: true,
  lastUpdated: true,
  head: [
    // 使用指定的 PNG 作为站点 favicon
    ['link', { rel: 'icon', href: '/images/ic_nambu_docs.png', type: 'image/png' }],
    // PWA: Web App Manifest + 主题色
    ['link', { rel: 'manifest', href: '/manifest.webmanifest' }],
    // Use background colors for system UI bars according to color scheme
    ['meta', { name: 'theme-color', content: '#FFFCFB', media: '(prefers-color-scheme: light)' }],
    ['meta', { name: 'theme-color', content: '#1A1111', media: '(prefers-color-scheme: dark)' }],
    // iOS 添加触控图标
    ['link', { rel: 'apple-touch-icon', href: '/images/apple-touch-icon.png' }]
  ],
  markdown: {
    theme: {
      light: 'material-theme-lighter',
      dark: 'material-theme-darker'
    }
  },
  // 使用 VitePress 的公共资源目录
  vite: {
    publicDir: path.resolve(__dirname, 'public')
  },
  themeConfig: {
    logo: '/images/ic_nambu_docs.png',
    outline: [2, 4],
    search: {
      provider: 'local'
    },
    footer: {
      message: 'NambuWiki 文档与设定集',
      copyright: '© NambuWiki Contributors'
    },
    socialLinks: [],
    nav: buildNav(),
    sidebar: buildSidebar()
  }
})

function buildNav() {
  // 自动从 docs 下的一级目录生成导航（含首页）
  const nav: { text: string; link: string }[] = [{ text: '首页', link: '/' }]
  const items: { text: string; link: string }[] = []
  const topDirs = fs.readdirSync(DOCS_ROOT, { withFileTypes: true })
  for (const d of topDirs) {
    if (d.isDirectory() && !d.name.startsWith('.')) {
      // 将 history 归入 Wiki，不在顶级导航中单列
      if (d.name === 'history') continue
      const indexMd = path.join(DOCS_ROOT, d.name, 'index.md')
      // 允许通过 frontmatter 隐藏目录，但标题一律采用文件夹名
      const fm = fs.existsSync(indexMd) ? parseFrontmatter(indexMd) : {}
      if (fm.hidden || fm.draft) continue
      const text = formatName(d.name)
      items.push({ text, link: `/${d.name}/` })
    }
  }

  // 排序：wiki 优先，public 最后，其余按自然排序
  const rank = (link: string) => {
    if (link === '/wiki/') return 0
    if (link === '/public/') return 9999
    return 100
  }
  items.sort((a, b) => {
    const ra = rank(a.link)
    const rb = rank(b.link)
    if (ra !== rb) return ra - rb
    return cmpNatural(a.text, b.text)
  })

  nav.push(...items)
  return nav
}

function buildSidebar() {
  // 从 docs 下每个一级目录扫描其内容，自动生成分组与链接
  const sidebar: Record<string, any[]> = {}
  const topDirs = fs.readdirSync(DOCS_ROOT, { withFileTypes: true })
  for (const d of topDirs) {
    if (d.isDirectory() && !d.name.startsWith('.')) {
      const base = `/${d.name}/`
      const dirPath = path.join(DOCS_ROOT, d.name)
      const groups = scanFolder(dirPath, d.name)
      // 如果存在 index.md，则在最前面添加“总览”
      const overviewPath = path.join(dirPath, 'index.md')
      if (fs.existsSync(overviewPath)) {
        const fm = parseFrontmatter(overviewPath)
        const overviewText = fm.title || '总览'
        groups.unshift({ text: overviewText, link: `/${d.name}/` })
      }
      sidebar[base] = groups
    }
  }
  // 目录结构已迁移到 /wiki/history 下，不再需要合并逻辑
  return sidebar
}

function scanFolder(dirPath: string, baseName: string, relPfx = ''): any[] {
  const groups: any[] = []
  const entries = fs.readdirSync(dirPath, { withFileTypes: true })

  // 收集当前目录下的 md 文件
  const mdFiles: { text: string; link: string }[] = []
  for (const e of entries) {
    if (e.isFile() && e.name.endsWith('.md') && e.name.toLowerCase() !== 'readme.md' && e.name.toLowerCase() !== 'index.md') {
      const fileRel = path.posix.join(relPfx, e.name.replace(/\.md$/, ''))
      const fullPath = path.join(dirPath, e.name)
      const fm = parseFrontmatter(fullPath)
      if (fm.hidden || fm.draft) continue
      const fallback = formatName(e.name.replace(/\.md$/, ''))
      const text = getFileTitle(fullPath, fallback)
      mdFiles.push({ text, link: `/${baseName}/${fileRel}` })
    }
  }
  if (mdFiles.length) {
    mdFiles.sort((a, b) => cmpNatural(a.text, b.text))
    const groupText = getDirTitle(dirPath)
    const dirFm = getDirIndexFrontmatter(dirPath)
    const collapsed = dirFm?.collapsed === true
    groups.push({ text: groupText, collapsed, items: mdFiles.map(({ text, link }) => ({ text, link })) })
  }

  // 递归子目录，合并为更多分组
  for (const e of entries) {
    if (e.isDirectory()) {
      const childDir = path.join(dirPath, e.name)
      const childRel = path.posix.join(relPfx, e.name)
      const childGroups = scanFolder(childDir, baseName, childRel)
      groups.push(...childGroups)
    }
  }

  return groups
}

function getDirIndexFrontmatter(dirPath: string): Record<string, any> | null {
  const idx = path.join(dirPath, 'index.md')
  if (fs.existsSync(idx)) return parseFrontmatter(idx)
  return null
}

function getDirTitle(dirPath: string): string {
  const idx = path.join(dirPath, 'index.md')
  const fallback = formatName(dirPath.split(path.sep).slice(-1)[0])
  return getFileTitle(idx, fallback)
}

function getFileTitle(filePath: string, fallback: string): string {
  try {
    if (!fs.existsSync(filePath)) return fallback
    const raw = fs.readFileSync(filePath, 'utf-8')
    const m = raw.match(/^#\s+(.+)$/m)
    if (m) return m[1].trim()
    return fallback
  } catch { return fallback }
}

function formatName(name: string) {
  // 下划线转空格，并按单词首字母大写；保留中文原样
  return name
    .split('/').slice(-1)[0]
    .split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}
