# Infralink Landing Page — Project Guide for Claude

## Project Overview
Single-file landing page for **Infralink** (digital infrastructure platform).
- **Main file:** `~/sj-draft-landing/index.html` — all CSS + HTML + inline JS in one file
- **Animation module:** `~/sj-draft-landing/js/animations.js` — GSAP-based scroll effects (opt-in via data attributes)
- **Stack:** Pure HTML/CSS/vanilla JS + GSAP 3.12.5 (CDN) + ScrollTrigger
- **Local preview (Claude tooling):** `npx http-server -p 8010 -c-1` via `.claude/launch.json` → `localhost:8010`
- **Local preview (user):** may also run own `python3 -m http.server 8000`
- **Remote:** `https://github.com/Maihihi/SJ-Landingpage.git` (branch: main)
- **Vercel:** `https://sj-draft-landing.vercel.app`
- **Repo path:** `/Users/mai/Documents/15_SJ Landing page/sj-draft-landing`

## Deployment Rules
- **Default:** All changes stay on localhost only — do NOT push to GitHub or Vercel unless user explicitly says so
- **To deploy:** `git add index.html js/ *.png && git commit -m "..." && git push && vercel --prod --yes`

## File Structure
```
sj-draft-landing/
├── index.html              ← single source of truth (all CSS + HTML + inline JS)
├── js/
│   └── animations.js       ← GSAP scroll effects (data-attribute opt-in)
├── city-hero-2.png         ← hero background image
├── Solution 1.png          ← solution section 1 background (via <img> + data-parallax)
├── Solution 2.png          ← solution section 2 background
├── Solution 3.png          ← solution section 3 background
├── Image left.png          ← What section col 01 image (752×606 px)
├── Image center.png        ← What section col 02 image (752×606 px)
├── Image right.png         ← What section col 03 image (752×606 px)
├── Logo 2.png              ← Infralink logo (icon + wordmark combined, 340×88 px)
├── logos/                  ← partner logo PNGs (downloaded from Figma MCP)
│   ├── logo50.png          ← Aetos
│   ├── logo51.png          ← Frasers Hospitality
│   ├── logo53.png          ← NCS
│   ├── logo54.png          ← MPA Singapore
│   ├── logo55.png          ← Changi Airport
│   ├── logo56.png          ← Republic of Singapore Navy
│   └── what-bg.png         ← (legacy, unused after Session 8 refactor)
├── .claude/launch.json     ← preview-server config (npx http-server on port 8010)
├── CLAUDE.md               ← this file
└── SESSION_NOTES.md        ← per-session change log
```

## Page Sections (top → bottom)

### 1. Hero
- Full-width, 980px tall, dark bg `#111111`, no border-bottom
- Nav: glassmorphism pill, 1280px wide, centered
- Nav logo: `<img src="Logo 2.png" class="nav-logo-img">` (height 44 px, no separate SVG/wordmark)
- Visual: `city-hero-2.png` centered, parallax on scroll (`scrollY * 0.22`, legacy inline JS in main IIFE)
- H1: "digital backbone for physical infrastructure"
- Subtitle: "Backed by years of industry experience, we deliver digital solutions built for real-world operations."

### 2. Marquee (scroll-driven horizontal slide)
- **Wrapper height:** computed dynamically in JS `measureMarquee()` (`vh + textWidth + 80`)
- **Text:** "We Make Cities Come Alive" — mixed case (no CSS uppercase), 240px font
- Text slides from `X = vw` (off-screen right) to `X = vw − 80 − textWidth` ("Alive" ends 80px from viewport right)
- **Color trigger:** bg flips to `#0C38A2` when "Cities" left edge < vw AND "Alive" left edge ≥ vw
- **No border-bottom** (removed in Session 8 — was showing as 1 px line above Solution 1)

### 3. Solution Stack (3 plain sections — NO sticky, NO legacy parallax)
- 3 direct children of `.solution-stack`, each `.solution-section { position: relative; width: 100%; height: 100vh }`
- `.solution-bg` uses **`data-parallax`** + child `<img src="Solution N.png">` — animated by `initParallax()` in `js/animations.js` (`scale 1.45`, `yPercent ±18.75%`, scrub)
- CSS override: `.solution-bg[data-parallax] { position: absolute }` (higher specificity than generic `[data-parallax] { position: relative }`)
- **No overlay** — `.solution-overlay` divs + CSS rule removed in Session 8; images show at full brightness
- `.solution-info`:
  - `position: absolute; left: 80px; bottom: 80px` — **always 80px from viewport left at all breakpoints** (responsive-safe, no `max(80, calc(...))`)
  - Mobile ≤480 `right: 20px`; tablet ≤900 `left: 80px !important; width: calc(100% − 160px)`
- **H2 text is hard-coded UPPERCASE in HTML** (not CSS `text-transform`): "VISUALIZE YOUR WORLD DIGITALLY" / "SEE EVERYTHING, IN REAL TIME" / "DELIVER PROJECTS WITH CLARITY"
- H2: Aptos SemiBold 62px / line-height 1.1 / **letter-spacing 0** (not −1px) / max-width 672px
- Tags + desc: JetBrains Mono 16px / lh 1.6
- **No text-stagger, no fade-in** on H2/tags/desc — user wants them visible immediately

### 4. What We've Done (counter-parallax grid)
- Background `#111111`, 3 columns × 927px tall, `.what-columns` has `overflow: hidden` (via `data-parallax-grid` CSS rule)
- **No more independent text/image parallax** — replaced by counter-parallax grid effect in Session 8
- Grid applied via `data-parallax-grid` on `.what-columns` + `data-parallax-col` on each `.what-col-body`
- Only the `.what-col-body` (text + image cluster) drifts; `.what-col-header` (numbers 01/02/03) stays fixed
- Direction alternates: col 01 UP, col 02 DOWN, col 03 UP — all with same magnitude (`SHIFT = 10%` in `animations.js`)
- **Border line**: `border-left: 1px solid #484848` applied to `.what-col-header` only (not full column) — matches Figma (vertical line spans header height only: 148 / 314 / 174 px)
- Staggered numbered headers: col 01 = 148px, col 02 = 314px, col 03 = 174px
- Images: `Image left/center/right.png` (752×606px) in 303px-tall white containers, `object-fit: cover`
- **Text content (current, matches Figma)**:
  - Col 01: "FACILTIY OPS MANAGEMENT" ("FACILTIY" typo preserved from Figma) / "Keeping our cities on track — today, and for generations."
  - Col 02: "SECURITY OPS" / "Watching over the places people trust every day." / button "View all use cases"
  - Col 03: "CROWD MANAGEMENT" / "Keeping places running, day after day."
- `.what-col-cat` (description) color `#b4b4b4`, no uppercase (was previously uppercase category labels)
- `.what-heading` letter-spacing `0` (not −1px)

### 5. Logo / Partners
- Background `#131313`, full-width, `padding: 80px 0`, `overflow: hidden`
- Heading: "YEARS OF PROJECTS, / PARTNERSHIP AND TRUST" (32px Aptos SemiBold, 80px padding)
- **Subtitle row**: "FROM DATA ——► TO MANAGEMENT"
  - Full viewport width (`width: 100%; padding: 0 80px; box-sizing: border-box`) — **no `max-width`** → "TO MANAGEMENT" always 80px from viewport right
  - Arrow = CSS line (flex:1, 1px tall) + absolute-positioned SVG chevron at right (exact 9-point filled path exported from Figma, color `#808080`)
  - Line runs UNDER the chevron's open V all the way to the tip (matches Figma layering)
  - Draw animation: `.logo-subtitle-arrow-wrap` uses `clip-path: inset(0 100% 0 0)` → `inset(0 0 0 0)` over 1.4 s cubic-bezier — reveals left→right as single arrow drawing
  - "TO MANAGEMENT" text has separate 0.7 s fade-in with delay 1.0 s
  - Animation triggered by `.sub-visible` class added via IntersectionObserver (threshold 0.5) — see inline `<script>` at bottom of HTML
- **Two marquee rows** (CSS animation, no JS):
  - Row 1: scrolls **RIGHT** — `@keyframes logo-right { from -50% to 0 }`
  - Row 2: scrolls **LEFT** — `@keyframes logo-left { from 0 to -50% }`
  - Each row: 14 tiles (7 originals + 7 duplicates) for seamless loop
  - Tile size: 226×144px, bg `#1f1f1f`, 8px radius, 16px gap
  - Speed: 28s per loop, `will-change: transform`

### 6. The Value (scroll-driven card slide-in)
- Dark section `#111111`, **1140px** sticky section
- Wrapper height dynamic: `calc(1140px + max(300px, 1247px - 100vh))` — scales so sticky releases right as card 3 settles. Formula derived from `(N-1)·CARD_TRAVEL·STAGGER + CARD_TRAVEL + ENTRY_OFFSET = 2·500·(2/3) + 500 + 80 = 1247`.
- Left side (`.value-left`): `top: 240px; left: 80px; width: 639px; gap: 80px` (heading → desc gap)
- **Heading**: "Every day, we help cities **move**, **grow**, and **thrive**." — **8 spans** alternating `.value-h2-white` / `.value-h2-gray` per Figma styled ranges
- H2: 62px Aptos SemiBold / letter-spacing 0 / uppercase via CSS
- Desc: JetBrains Mono 16px / `max-width: 396px` / color `#7b7b7b`
- Right side: 3 cards animate in from right-bottom with **per-card rotation**:
  - Card 1: −30° → 0°
  - Card 2: **+30° → 0° (opposite direction — swings in from other side)**
  - Card 3: −30° → 0°
  - `startRot` set per-card in the `cards[]` array in the inline `<script>`
- **Stagger timing**: `start = i * CARD_TRAVEL * STAGGER` where `STAGGER = 2/3` — card N+1 starts when card N is 2/3 of the way through its travel (not after it finishes)
- **Linear easing (no `easeOutCubic`)** — avoids "dead tail" where cubic leaves the section feeling stuck for ~30% of the scroll
- Cards: 447px wide, `left: 789px`, `TOP_OFFSET = 150` (match Figma card1 y=150), stacked with 46px gap, `CARD_TRAVEL = 500` px, `OFF_X = 900` px, `ENTRY_OFFSET = 80` px
- Card animation: scroll-driven in separate inline `<script>` block near `</body>`

### 7. Footer
- Background `#111111`, `min-height: 452px`, `padding: 80px`, `flex-col; justify-content: flex-end`
- Top row: `<img src="Logo 2.png" class="footer-logo-img">` (height 44 px) | Company & Products nav columns
  - **No more** `.footer-logo-icon` container (44×44 `#262626` bg) or `.footer-wordmark` span — replaced by single PNG
- Divider: 1px `rgba(255,255,255,0.15)`
- Bottom row: copyright (Aptos Regular, `#b4b4b4`) | Instagram + LinkedIn inline SVG icons
- Social links: `href="#"` placeholder — need real URLs before public launch
- Tagline: "Real Impact, Made Together"

## Key CSS Variables
```css
:root {
  --color-primary: #1257fd;
  --color-primary-dark: #0c38a2;
  --color-bg: #111111;
  --mq-h: 100vh;        /* marquee section height */
  --mq-travel: 600px;   /* mostly unused after Session 7 marquee rewrite */
  --mq-font: 240px;
  --mq-ls: -4px;
}
```

## GSAP Animation System (`js/animations.js`)

### Loading
GSAP 3.12.5 + ScrollTrigger loaded via CDN in `<head>` with `defer`:
```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js" defer></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js" defer></script>
<script src="js/animations.js" defer></script>
```

### Three opt-in effects — all triggered by data attributes, no JS edits needed

#### 1. Text stagger — `[data-stagger="word"]`
- Word-by-word fade-in + translateY from below
- Trigger: `top 85%`, `toggleActions: "play none none reverse"`
- Duration 0.8s, stagger 0.03s, ease `power2.out`
- Uses `splitWords()` helper which **replaces innerHTML** — do NOT apply to elements with styled child spans (e.g. `.value-h2` with 8 colored spans will be destroyed)
- Sets `aria-label` on the element so screen readers read the original full text; split words are `aria-hidden`
- **Currently applied on:** nothing (was tested on Solution H2, then removed per user request)

#### 2. Image parallax — `[data-parallax]`
- Single `<img>` or `<video>` child required
- Scrub parallax `yPercent: -18.75 → +18.75` (scrub: true, ease: none)
- Trigger: `top bottom` → `bottom top`
- Requires parent `overflow: hidden` (applied via `[data-parallax]` CSS rule)
- Child media needs `transform: scale(1.45)` in CSS to prevent edge reveal (rule: scale ≥ 1 + 2 × max|yPercent|/100)
- **Currently applied on:** 3 × `.solution-bg` (Solution 1/2/3 backgrounds)

#### 3. Counter-parallax grid — `[data-parallax-grid]` + `[data-parallax-col]`
- Container gets `data-parallax-grid`; direct column children get `data-parallax-col`
- All columns drift the same distance (`SHIFT = 10%` in `initCounterParallaxGrid`); direction alternates by index (0,2,4 drift UP, 1,3,5 drift DOWN)
- Scrub (trigger: `top bottom` → `bottom top`), ease: none
- Container needs `overflow: hidden` (applied via `[data-parallax-grid]` CSS rule)
- Columns get `will-change: transform` automatically (via `[data-parallax-col]` CSS rule)
- **Currently applied on:** `.what-columns` (3 × `.what-col-body` targets)
- **To tune speed:** edit `const SHIFT = 10;` in `initCounterParallaxGrid()` — single knob, no per-column tweaks

### Boot + refresh
```js
document.addEventListener('DOMContentLoaded', () => {
  initTextStagger();
  initParallax();
  initCounterParallaxGrid();
});
window.addEventListener('load', () => ScrollTrigger.refresh());
```

## Legacy JS (inline in `index.html`)

### Script block architecture
**Inline scripts still exist** for legacy effects — do not migrate unless specifically asked:
1. **Main IIFE** (in `<head>`) — marquee, hero parallax, IntersectionObserver fade-ins (`.anim-observe` + `.sub-visible`). Has `if (reduceMotion) return` gate for hero parallax only.
2. **Value card animation** (near `</body>`) — inline `<script>`, scroll-driven rotation + translate. Uses per-card `startRot` from `cards[]` array.
3. **Logo subtitle row `.sub-visible` trigger** (near `</body>`) — IntersectionObserver adds `.sub-visible` class to trigger the clip-path draw animation.

### Legacy parallax patterns (still in code)
- **Hero**: `scrollY * 0.22` on `.hero-visual`, inside main IIFE (gated by `parallaxReady` + `reduceMotion`)

### Progress calculation patterns (legacy — used by value card script)
- **Card scroll progress**: `adjusted = scrolledInto + (vh − ENTRY_OFFSET)`; per card: `raw = (adjusted − start) / CARD_TRAVEL`, clamped 0–1. `start = i * CARD_TRAVEL * STAGGER`.
- **Read wrapperTop fresh each frame** — do NOT cache `getBoundingClientRect().top + scrollY` at script-load time (marquee resizes dynamically after fonts load → stale cache breaks everything below).

### Marquee loop pattern (logo section)
```
track = [A, B, C, D, E, F, G,  A, B, C, D, E, F, G]   ← 2× tiles
animate: translateX(0) → translateX(-50%)               ← left scroll
animate: translateX(-50%) → translateX(0)               ← right scroll
```
50% of track = exactly 1 set → seamless reset on loop.

## Important Notes

### Design / layout rules
- **Solution H2 is hard-coded UPPERCASE** in HTML (not `text-transform: uppercase`) — user explicitly chose this over Figma's lowercase
- **Solution `.solution-info { left: 80px }`** at every breakpoint — user requirement
- **Solution overlay is permanently removed** — do NOT re-add `.solution-overlay` unless user explicitly asks
- **"FACILTIY" typo lives on col 01** of What section (moved from col 03) — intentional, matches Figma
- **Hero and solution sections** must be `width: 100%` (not hardcoded 1440px)
- **The `.marquee-text`** does NOT use `text-transform: uppercase` (mixed case title)
- **Logo PNG** (`Logo 2.png`) is the single source of truth for Infralink branding — used in both nav and footer, no separate SVG icon+wordmark anywhere

### JS rules
- **GSAP scroll effects go in `js/animations.js`** via data attribute opt-in. Do NOT add new inline `<script>` IIFE blocks for new scroll effects — extend `animations.js` instead.
- **Do NOT put scroll effects inside the main IIFE** — its `if (reduceMotion) return` will silently kill them. Either extend `animations.js` or (if legacy) add a separate `<script>` block near `</body>`.
- **Always call `update()` immediately** in legacy parallax scripts (not just on scroll) — otherwise initial state is wrong.
- **Do NOT use `.anim-observe`** on elements inside sticky scroll wrappers — IntersectionObserver won't trigger correctly.
- **Card positions** in Value section are set in JS via `positionCards()` after measuring `offsetHeight` — don't hardcode.
- **splitWords() destroys child HTML** — never apply `data-stagger="word"` to elements whose styling relies on child spans (e.g. `.value-h2`).
- **Parallax scale-vs-translate contract**: for any `[data-parallax] img`, CSS `transform: scale(X)` must satisfy `X ≥ 1 + 2 × max|yPercent|/100`. Currently `yPercent: ±18.75` → `scale(1.45)`. If one is bumped, bump the other.

### Responsive / breakpoints
- `isMobile()` returns `true` at `window.innerWidth <= 480` — parallax disabled below this
- What section has **no mobile breakpoints** — columns overflow on narrow screens
- Value section is **not responsive** — `.value-inner` fixed `width: 1440px`, cards `left: 789px` absolute
- Solution mobile ≤480 needs visual check: `.solution-info { left: 80px; right: 20px }` — may cramp if viewport is < 360 px

### Deployment
- **Logo images** are in `logos/` — remember `git add logos/` when deploying
- **New Solution images** at root (`Solution 1/2/3.png`) — `git add "Solution 1.png" "Solution 2.png" "Solution 3.png"`
- **`js/animations.js`** — `git add js/`
- User must provide higher-quality versions of `Solution 1/2/3.png` (current ones are heavily compressed and blurry at scale 1.45)

### Preview tool
- `.claude/launch.json` uses `npx http-server -p 8010 -c-1` (not `python3 -m http.server`) — macOS sandboxing blocked the Python version in Claude's runtime
- `preview_screenshot` returns all-black frames in this environment; use `preview_inspect` / `preview_eval` for DOM verification
