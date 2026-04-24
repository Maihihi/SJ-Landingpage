# Infralink Landing Page — Project Guide for Claude

## Project Overview
Single-file landing page for **Infralink** (digital infrastructure platform).
- **File:** `~/sj-draft-landing/index.html` — all CSS + HTML + JS in one file
- **Stack:** Pure HTML/CSS/JS, no framework
- **Local preview:** `python3 -m http.server 8000 --directory /Users/linh/sj-draft-landing`
- **Remote:** `https://github.com/Maihihi/SJ-Landingpage.git` (branch: main)
- **Vercel:** `https://sj-draft-landing.vercel.app`

## Deployment Rules
- **Default:** All changes stay on localhost only — do NOT push to GitHub or Vercel unless user explicitly says so
- **To deploy:** `git add index.html logos/ && git commit -m "..." && git push && vercel --prod --yes`

## File Structure
```
sj-draft-landing/
├── index.html              ← single source of truth (all CSS + HTML + JS)
├── city-hero-2.png         ← hero background image
├── Section Solution 1.png  ← solution section 1 background
├── Section Solution 2.png  ← solution section 2 background
├── Section Solution 3.png  ← solution section 3 background
├── Image left.png          ← What section col 01 image (752×606px)
├── Image center.png        ← What section col 02 image (752×606px)
├── Image right.png         ← What section col 03 image (752×606px)
├── logos/                  ← partner logo PNGs (downloaded from Figma MCP)
│   ├── logo50.png          ← Aetos
│   ├── logo51.png          ← Frasers Hospitality
│   ├── logo53.png          ← NCS
│   ├── logo54.png          ← MPA Singapore
│   ├── logo55.png          ← Changi Airport
│   ├── logo56.png          ← Republic of Singapore Navy
│   └── what-bg.png         ← What section col 02/03 bg layer
├── CLAUDE.md               ← this file
└── SESSION_NOTES.md        ← per-session change log
```

## Page Sections (top → bottom)

### 1. Hero
- Full-width, 980px tall, dark bg `#111111`, **no border-bottom**
- Nav: glassmorphism pill, 1280px wide, centered
- Visual: `city-hero-2.png` centered, parallax on scroll (`scrollY * 0.22`)
- H1: "digital backbone for physical infrastructure"
- Subtitle: "Backed by years of industry experience, we deliver digital solutions built for real-world operations." (598px wide, 2 lines)

### 2. Marquee (scroll-driven, two-phase)
- **Wrapper height:** `--mq-h + --mq-travel` (980 + 2400 = 3380px on desktop)
- **Text:** "We Make Cities Come Alive" — mixed case, 240px font
- **Phase 1** (0 → `--mq-p1` = 600px scroll): text slides UP from below viewport to vertical center
- **Phase 2** (`--mq-p1` → `--mq-travel`): text slides LEFT from X=0 to X=−textWidth
- **Color trigger:** when "Cities" left edge hits viewport left → bg → `#0C38A2`
- **Breakpoints:** `--mq-p1` / `--mq-travel` / `--mq-font` / `--mq-ls` scale at ≤900px and ≤480px

### 3. Solution Stack (3 sticky sections)
- **Pattern:** sozo21-style sticky stack — each section wrapped in a `.solution-stack-item`
  - Items 1 & 2: `height: 180vh` (100vh section + 80vh scroll room for next section to slide up)
  - Item 3 (last): `height: 100vh` (no extra room — entry-based parallax instead)
- **`.solution-section`:** `position: sticky; top: 0; height: 100vh`
- **`.solution-bg`:** `position: absolute; height: 160%; top: -30%` — oversized for parallax travel
- **Parallax:** separate `<script>` block near `</body>` (NOT inside main IIFE)
  - Sections 1&2: `progress = -rect.top / inViewDist` (scroll-driven)
  - Section 3: `progress = 1 - rect.top / viewH` (entry-driven, no scroll room)
  - BG: `translateY(progress * -12%)`
  - Info: `translateY(240 + progress * -800px)` — starts 240px below, moves fast upward
- **No hover effect** on `.solution-info` — was removed, parallax replaces it

### 4. What We've Done
- Background `#111111`, 3 columns × 927px tall, `overflow: hidden`
- Left border line `rgba(255,255,255,0.15)` on each column
- Staggered numbered headers: col 01 = 148px, col 02 = 314px, col 03 = 174px
- Images: `Image left/center/right.png` (752×606px) in 303px-tall white containers, `object-fit: cover`
- Parallax (separate `<script>` block): text and image in col 01/03 move independently
  - Col 01 text UP ±200px, image UP ±520px
  - Col 02 fixed
  - Col 03 text DOWN ±280px, image DOWN ±720px
- Note: "FACILTIY" typo in col 03 title is **intentional** (preserved from Figma)

### 5. Logo / Partners
- Background `#131313`, full-width, `padding: 80px 0`, `overflow: hidden`
- Heading: "YEARS OF PROJECTS, / PARTNERSHIP AND TRUST" (32px Aptos SemiBold, 80px padding)
- Subtitle row: "FROM DATA ——— TO MANAGEMENT" with flex separator line
- **Two marquee rows** (CSS animation, no JS):
  - Row 1: scrolls **RIGHT** — `@keyframes logo-right { from -50% to 0 }`
  - Row 2: scrolls **LEFT** — `@keyframes logo-left { from 0 to -50% }`
  - Each row: 14 tiles (7 originals + 7 duplicates) for seamless loop
  - Tile size: 226×144px, bg `#1f1f1f`, 8px radius, 16px gap
  - Speed: 28s per loop, `will-change: transform`

### 6. The Value
- Dark section `#111111`, **1140px** tall, sticky scroll wrapper (`1140 + 1800 = 2940px` total)
- Left side: heading "The Value" (white + gray) + description
- Right side: 3 cards animate in from right-bottom with rotation (−25° → 0°)
- Cards: 447px wide, `left: 789px`, stacked with 46px gap, top card 140px from top
- Card animation: scroll-driven in separate `<script>` block near `</body>`

### 7. Footer
- Background `#111111`, `min-height: 452px`, `padding: 80px`, `flex-col; justify-content: flex-end`
- Top row: Logo icon (`#262626` bg) + "Infralink" wordmark | Company & Products nav columns
- Divider: 1px `rgba(255,255,255,0.15)`
- Bottom row: copyright (Aptos Regular, `#b4b4b4`) | Instagram + LinkedIn inline SVG icons
- Social links: `href="#"` placeholder — need real URLs before public launch

## Key CSS Variables
```css
:root {
  --color-primary: #1257fd;
  --color-primary-dark: #0c38a2;
  --color-bg: #111111;
  --mq-h: 980px;
  --mq-travel: 2400px;
  --mq-p1: 600px;     /* Phase 1 scroll distance for marquee */
  --mq-font: 240px;
  --mq-ls: -4px;
}
```

## Key JS Patterns

### Script block architecture
There are **3 separate `<script>` blocks** near `</body>`, each independent:
1. **Value card animation** — scroll-driven card slide-in
2. **What section parallax** — text/image move at different rates per column
3. **Solution parallax** — bg slow, info fast, handles entry vs scroll progress

The **main IIFE** (inside `<script>` in `<head>` area) handles: marquee, hero parallax, IntersectionObserver fade-ins. It has `if (reduceMotion) return` which gates hero parallax. **Do NOT put solution/what parallax inside this IIFE** — they must be separate blocks to avoid the reduceMotion gate and to call `update()` immediately on load.

### Parallax patterns
- **Hero:** `scrollY * 0.22` on `.hero-visual`, inside main IIFE (gated by `parallaxReady` + `reduceMotion`)
- **Solution bg:** `translateY(progress * -12%)`, separate block, runs immediately
- **Solution info:** `translateY(240 + progress * -800px)`, same block — +240px offset at start
- **What columns:** text and image elements moved independently at different rates
- **Logo marquee:** pure CSS `@keyframes`, no JS

### Progress calculation patterns
- **Scroll-driven (sections 1&2):** `progress = Math.min(1, Math.max(0, -rect.top / inViewDist))`
- **Entry-driven (section 3):** `progress = Math.min(1, Math.max(0, 1 - rect.top / viewH))`
- **General sticky wrapper:** `rect` = wrapper's `getBoundingClientRect()`, `inViewDist = itemH - viewH`

### Marquee loop pattern
```
track = [A, B, C, D, E, F, G,  A, B, C, D, E, F, G]   ← 2× tiles
animate: translateX(0) → translateX(-50%)               ← left scroll
animate: translateX(-50%) → translateX(0)               ← right scroll
```
50% of track = exactly 1 set → seamless reset on loop.

## Important Notes
- **Do NOT put parallax inside main IIFE** — `if (reduceMotion) return` will kill it silently; use separate script blocks instead
- **Always call `update()` immediately** in separate parallax scripts (not just on scroll) — otherwise initial state is wrong
- **Do NOT use `.anim-observe`** on elements inside sticky scroll wrappers — IntersectionObserver won't trigger correctly
- **Card positions** set in JS via `positionCards()` after measuring `offsetHeight`
- **Hero and solution sections** must be `width: 100%` (not hardcoded 1440px)
- **The `.marquee-text`** does NOT use `text-transform: uppercase` (mixed case title)
- **isMobile()** returns `true` at `window.innerWidth <= 480` — parallax disabled below this
- **Section 3 solution wrapper** is `height: 100vh` (last-child rule) — no scroll room, use entry-based progress
- **Logo images** are in `logos/` — remember to `git add logos/` when deploying
