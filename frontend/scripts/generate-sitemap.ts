import { writeFileSync, mkdirSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { PAGES } from '../src/pages.config'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.resolve(__dirname, '../public')
const target = path.join(publicDir, 'sitemap.xml')
const baseUrl = process.env.SITEMAP_BASE_URL ?? 'https://hospital.local'

const uniquePaths = new Set<string>(['/'])

PAGES.forEach((page) => {
  uniquePaths.add(page.path)
})

const additional = ['/privacy-policy', '/terms', '/login', '/online-services', '/sitemap']
additional.forEach((item) => uniquePaths.add(item))

const entries = Array.from(uniquePaths)
  .sort((a, b) => a.localeCompare(b))
  .map((url) => {
    const loc = new URL(url, baseUrl).href
    const priority = url === '/' ? '1.0' : url.startsWith('/internal') ? '0.3' : '0.6'
    return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${priority}</priority>\n  </url>`
  })
  .join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`

mkdirSync(publicDir, { recursive: true })
writeFileSync(target, xml)

console.log(`Generated sitemap with ${uniquePaths.size} entries at ${target}`)
