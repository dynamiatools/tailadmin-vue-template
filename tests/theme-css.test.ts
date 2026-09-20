import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

// vitest runs from the package root (npm test)
const css = (name: string) => readFileSync(resolve(process.cwd(), 'src/assets', name), 'utf8')
const pkg = JSON.parse(readFileSync(resolve(process.cwd(), 'package.json'), 'utf8'))

describe('theme.css / style.css split', () => {
  it('theme.css has no external requests and carries the Tailwind entry + tokens', () => {
    const theme = css('theme.css')
    // (an SVG `xmlns="http://www.w3.org/..."` inside a data URI is not a request)
    expect(theme).not.toMatch(/googleapis|@import\s+url\(|url\(\s*['"]?https?:/)
    expect(theme).toContain("@import 'tailwindcss'")
    expect(theme).toContain('--color-brand-500')
  })

  it('main.css (style.css) keeps loading the font and pulls in theme.css', () => {
    const main = css('main.css')
    expect(main).toContain('fonts.googleapis.com')
    expect(main).toContain("@import './theme.css'")
    // the font @import must stay before any other rule/import that emits CSS
    expect(main.indexOf('fonts.googleapis.com')).toBeLessThan(main.indexOf("@import './theme.css'"))
  })

  it('both are exported', () => {
    expect(pkg.exports['./style.css']).toBe('./src/assets/main.css')
    expect(pkg.exports['./theme.css']).toBe('./src/assets/theme.css')
  })
})
