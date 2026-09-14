/**
 * Derives a full brand-25..950 shade scale from a single hex color and applies it as CSS
 * custom property overrides on the document root.
 *
 * This works with zero rebuild because Tailwind v4 compiles color utilities to `var()`
 * references (e.g. `.bg-brand-500 { background-color: var(--color-brand-500) }`) instead of
 * inlining literal values — see the package's src/assets/main.css `@theme` block. Overriding
 * those custom properties at runtime re-themes every component using them instantly.
 */

// Target lightness (%) per step, modeled after the shape of the package's own default brand
// scale and Tailwind's default palettes. Saturation and hue come from the picked color; only
// lightness varies across steps, which is an approximation — it won't reproduce a designer-tuned
// scale exactly, but it's enough to prove the theming mechanism works end to end.
const LIGHTNESS_STEPS: ReadonlyArray<readonly [string, number]> = [
  ['25', 97],
  ['50', 95],
  ['100', 91],
  ['200', 82],
  ['300', 71],
  ['400', 60],
  ['500', 50],
  ['600', 42],
  ['700', 35],
  ['800', 27],
  ['900', 20],
  ['950', 12],
]

function hexToHsl(hex: string): [h: number, s: number, l: number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2

  let h = 0
  let s = 0
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      default:
        h = (r - g) / d + 4
    }
    h /= 6
  }

  return [h * 360, s * 100, l * 100]
}

function hslToHex(h: number, s: number, l: number): string {
  const sN = s / 100
  const lN = l / 100
  const c = (1 - Math.abs(2 * lN - 1)) * sN
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = lN - c / 2

  let [r, g, b] = [0, 0, 0]
  if (h < 60) [r, g, b] = [c, x, 0]
  else if (h < 120) [r, g, b] = [x, c, 0]
  else if (h < 180) [r, g, b] = [0, c, x]
  else if (h < 240) [r, g, b] = [0, x, c]
  else if (h < 300) [r, g, b] = [x, 0, c]
  else [r, g, b] = [c, 0, x]

  const toHex = (v: number) =>
    Math.round((v + m) * 255)
      .toString(16)
      .padStart(2, '0')

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

export function applyBrandColor(hex: string) {
  const [h, s] = hexToHsl(hex)
  const root = document.documentElement
  for (const [step, l] of LIGHTNESS_STEPS) {
    root.style.setProperty(`--color-brand-${step}`, hslToHex(h, s, l))
  }
}

export function resetBrandColor() {
  const root = document.documentElement
  for (const [step] of LIGHTNESS_STEPS) {
    root.style.removeProperty(`--color-brand-${step}`)
  }
}
