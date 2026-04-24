# Session Notes

---

## Sessions 1–3 (archived)
**Status:** Deployed to Vercel after Session 1. Sessions 2–3 on localhost only.

### Summary of completed work
- Hero: subtitle text updated, width fixed (`1440px` → `100%`)
- Marquee: "We Make Cities Come Alive", two-phase animation (rise → slide left), 400px font, two-color triggers (#0C38A2 / #111111), `padding-left: 120px` offset
- Solution stack: 3 sticky sections (sozo21-style), parallax bg, z-index stacking, responsive
- The Value: sticky scroll wrapper, 3 cards animate in from right with −25°→0° rotation

---

## Session 4 — 2026-04-21
**Status:** Deployed to Vercel (commit `68015b4`)

### Completed
#### "What We've Done" section (rebuilt from Figma node 54:1546)
- 3 columns, each **927px tall** (fixed height per Figma)
- Left border line (`rgba(255,255,255,0.15)`) on each column
- Staggered numbered headers: col 01 = 148px, col 02 = 314px, col 03 = 174px
- Content per column:
  - Col 01: "Green Building Initiative" / CITIES & DISTRICTS / `Image left.png`
  - Col 02: "SECURITY OPS" / DEFENSE & SECURITY / `Image center.png` + "View all usecases" button
  - Col 03: "FACILTIY OPS MANAGEMENT" (typo preserved from Figma) / TRANSPORT / `Image right.png`
- Images: 752×606px local files, `object-fit: cover` in 303px-tall white containers
- Parallax JS: col 01 UP ±80px, col 02 fixed, col 03 DOWN ±60px

#### "Logo / Partners" section (new)
- Background `#131313`, heading + "FROM DATA → TO MANAGEMENT" row
- Two rows of partner logo tiles (226×144px, `#1f1f1f`, 8px radius, 16px gap)
- Logo images sourced from Figma Dektop Bridge plugin as `localhost:3845`

---

## Session 5 — 2026-04-21
**Status:** Deployed to Vercel (commit `68015b4`)

### Completed
- What section parallax upgraded: text and image in each column move independently
- Solution section parallax added for `.solution-info` (info box slides independently of bg)
- Footer built (Figma node 24:6289): logo, tagline, nav columns, divider, copyright, social icons
- Value section height: 980px → 1140px (more breathing room below cards)
- Font audit: nav links, buttons → JetBrains Mono; footer body → Aptos Regular (matches Figma)
- Margin audit: all sections confirmed ≥ 80px from edges

---

## Session 6 — 2026-04-22
**Status:** Deployed to Vercel (commits `0a4dacd`, `e53adba`, latest unlabeled)

### Completed

#### Logo images — fixed production blocker
- Downloaded all 6 partner logos + 1 What-section bg image from Figma MCP directly
- Saved to `logos/` folder: `logo50.png`, `logo51.png`, `logo53.png`, `logo54.png`, `logo55.png`, `logo56.png`, `what-bg.png`
- Replaced all `localhost:3845` URLs in `index.html` with `logos/` local paths
- Deployed to Vercel — logo section now works in production

#### Solution section parallax — rebuilt from scratch
- **Removed** hover effect (`translateY(-5px)` + `transition`) on `.solution-info` entirely
- **Root cause found**: original parallax was inside main IIFE gated by `if (reduceMotion) return` — if macOS "Reduce Motion" is on, entire parallax block was skipped; also no initial call on page load
- **Fix**: extracted solution parallax into its own `<script>` block near `</body>` (same pattern as value card script), outside the IIFE, called immediately on load
- **Progress calculation**: 
  - Sections 1 & 2 (wrapper `height: 180vh`): `progress = -rect.top / inViewDist` — scroll-driven while sticky
  - Section 3 (wrapper `height: 100vh`, `scrollRange = 0`): `progress = 1 - rect.top / viewH` — entry-driven as section slides in from below
- **Final values**: bg `translateY(progress * -12%)`, info `translateY(240 + progress * -800px)`
  - Info starts 240px BELOW natural position (more entrance travel)
  - Info moves −800px total → clearly faster than bg (depth effect)
  - Bg moves −12% of its height → slow, feels distant

#### Logo section — infinite marquee animation
- Replaced static absolute-positioned rows with CSS marquee animation
- **Row 1**: scrolls RIGHT — `@keyframes logo-right { from -50% to 0 }`
- **Row 2**: scrolls LEFT — `@keyframes logo-left { from 0 to -50% }`
- Each row has **14 tiles** (7 original + 7 duplicate) → seamless loop via 50% translateX trick
- Speed: **28s** per loop
- `.logo-tiles-wrapper` changed from `position: relative; height: 304px` to `flex-col; gap: 16px; overflow: hidden`
- Removed old `position: absolute; left: 189px` offsets from `.logo-row-1` and `.logo-row-2`

#### Hero border removed
- `.hero { border-bottom: 1px ... }` → `border-bottom: 0px` (user request)

### Key decisions (Session 6)
- Solution parallax in separate script block (not inside main IIFE) — avoids `reduceMotion` gate and ensures it runs immediately on page load
- Section 3 uses entry-based progress (not scroll-based) because its wrapper height equals viewport height → no scroll room
- Info offset `+240px` at progress=0 chosen to give text more visual travel distance on entry
- Logo marquee uses pure CSS animation (no JS) — simpler, smoother, GPU-accelerated via `will-change: transform`
- `@keyframes` with 50% translateX trick: track = 2× tiles, move by 50% = one full set → perfectly seamless

---

---

## Session 7 — 2026-04-23
**Status:** Localhost only — NOT deployed to Vercel yet. Uncommitted changes in worktree `bold-hoover-ed7d1e`.

### Completed

#### Marquee section — rebuilt as single-phase horizontal scroll
- **Removed** two-phase animation (Phase 1 rise + Phase 2 slide-left)
- **Removed** `padding-left: 120px` from `.marquee-track`
- **New behavior**: text vertically centered (via flex on `.marquee-section`), slides horizontally from `X = vw` (off-screen right) to `X = vw - 80 - textWidth` (right edge of "Alive" 80px from viewport right edge)
- **Wrapper height**: now computed dynamically in `measureMarquee()` as `window.innerHeight + marqueeTextWidth + 80` (no longer from `--mq-travel` CSS var)
- **CSS vars updated**: `--mq-h: 100vh`, `--mq-travel: 600px` (mostly unused now but kept for mobile breakpoints)
- **Color triggers**: bg toggles `#0C38A2` when "Cities" left edge < vw AND "Alive" left edge >= vw
- **Removed** `easeOutCubicMq`, `SCROLL_TRAVEL`, `PHASE1_TRAVEL` constants — no longer needed

#### Solution section — all effects removed (per user request)
- **Removed** `.solution-stack-item` wrapper divs — 3 `.solution-section` elements are now direct children of `.solution-stack`
- **Removed** `position: sticky`, `height: 180vh`, parallax `<script>` block, bg oversize (`height: 160%; top: -30%`)
- **New CSS**: plain stacked sections, each `position: relative; width: 100%; height: 100vh`
- **`.solution-bg`**: `inset: 0; width/height: 100%` (no parallax transform)
- **`.solution-info`**: `bottom: 100px` (was 80px), no transform
- **Mobile `.solution-gap`** rule added: `display: none` (leftover from intermediate restructure attempt)
- **Leftover**: line 1572 still has `const solutionItems = Array.from(document.querySelectorAll('.solution-stack-item'));` — returns empty array, no error, but should be cleaned up

#### Hero border
- `border-bottom: 0px` (already had this from Session 6, just restated explicitly)

#### Bug fix — Value card animation "disappeared"
- **Symptom**: after marquee rewrite, Value section cards no longer animated in — they appeared already at rest when scrolled into view
- **Root cause**: `marqueeWrapper.style.height` is set dynamically inside `measureMarquee()` (runs after `document.fonts.ready`), which pushes the Value section further down the document. But the Value IIFE cached `wrapperAbsTop = wrapper.getBoundingClientRect().top + window.scrollY` ONCE at script-load time, before fonts resolved → cached value was stale → `scrolledInto` was way larger than actual → cards computed as fully past their animation range
- **Fix**: compute `wrapperTop` fresh inside `update()` each scroll frame instead of caching. Simpler and robust against any future layout shifts above the value section.

### Key decisions (Session 7)

- **Marquee wrapper height is now JS-driven**, not CSS-var driven. This is necessary because the travel distance depends on `scrollWidth` of the text at the actual rendered font size, which CSS can't know at parse time.
- **Solution section has zero scroll effects** — user explicitly asked to remove all parallax/sticky. Don't re-add them without confirmation.
- **Never cache `getBoundingClientRect().top + scrollY`** in scroll handlers if there are dynamically-sized elements above — read it fresh each frame. Pattern applied to Value IIFE; Marquee IIFE already does this (reads `marqueeWrapper.getBoundingClientRect().top` each scroll).
- **Preview server port changed**: `.claude/launch.json` now uses port `8010` (not `8000`) because user's own `python3 -m http.server 8000` was already running and conflicted with Claude Preview tool.

---

## Current state (end of Session 7)
- **localhost**: user's server running at `localhost:8000`; Claude preview server available on `localhost:8010` (if started via preview tool)
- **Vercel**: still on Session 6 state (commit `e53adba`) — Session 7 changes NOT deployed
- **GitHub**: branch `main` last commit `e53adba`. Session 7 work is in worktree `bold-hoover-ed7d1e` on branch `claude/bold-hoover-ed7d1e`, **uncommitted**.
- **Uncommitted diff**: ~420 lines in `index.html` (marquee rebuild + solution effects removal + value wrapperTop fix)

---

## Todo — next session

### Priority 1: Visual QA pass on Session 7 changes
- Open `localhost:8000` (or 8010) and scroll full page
- **Marquee**: verify text starts off-screen right, slides to end with "Alive" 80px from viewport right, bg turns blue between "Cities" appearing and "Alive" appearing
- **Solution**: verify 3 stacked full-viewport sections with NO parallax, NO sticky — just plain scroll
- **Value**: verify 3 cards now animate in from right with rotation (regression fix verification)
- **What** + **Logo marquee**: verify still work (untouched this session)

### Priority 2: Clean up dead code
- Remove stale `solutionItems` reference at `index.html:1572` (main IIFE) — class `.solution-stack-item` no longer exists
- Consider removing `--mq-travel` CSS var if it's truly unused outside mobile breakpoints (audit first)

### Priority 3: Commit + deploy Session 7
- Decide: merge worktree branch back to main, or cherry-pick changes
- `git add index.html && git commit && git push && vercel --prod --yes`

### Priority 4: Carry-over from Session 6
- **What section**: no mobile breakpoints — still needs responsive rework
- **Footer social icons**: `href="#"` placeholders still need real URLs
- **"FACILTIY" typo**: still preserved from Figma — confirm with user

---

## Known bugs / edge cases

- **Cached scroll positions go stale**: any IIFE that caches `getBoundingClientRect().top + scrollY` at script-load time will break if elements above resize dynamically (e.g. marquee wrapper after fonts load). Rule of thumb: read fresh each frame unless you've proven nothing above shifts.
- **Stale `solutionItems` reference** at line 1572 — harmless (returns empty array) but should be removed
- **`.solution-gap` CSS rule** exists at mobile breakpoint but no `.solution-gap` element in DOM — leftover from intermediate restructure, safe to remove
- **"FACILTIY" typo**: preserved from Figma design — confirm with user
- **Preview tool scroll**: `window.scrollTo()` doesn't work in Claude preview iframe — test scroll animations at `localhost:8000` in real browser
- **What section parallax at page load**: col 01 starts +200px up and col 03 +280px down at scroll=0 — correct `p=0` state, not a bug
- **Mobile — What section**: no responsive breakpoints; columns overflow on narrow screens
- **Value section at narrow viewports**: `.value-inner` fixed `width: 1440px`; cards use `left: 789px` absolute — not responsive
- **Footer social icons**: `href="#"` placeholder — need real URLs
- **Logo marquee on mobile**: marquee still runs on mobile (no breakpoint to pause/disable) — may want to reduce speed or pause on mobile
- **Port 8000 conflict**: user runs own `python3 -m http.server 8000`; Claude Preview tool is configured for port 8010 to avoid conflict
