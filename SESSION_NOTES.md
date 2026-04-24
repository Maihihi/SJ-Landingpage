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

## Session 8 — 2026-04-24
**Status:** Localhost only (port 8010) — NOT deployed to Vercel. Uncommitted.

### Major theme: GSAP scroll-animation system + Figma parity pass

#### New infrastructure: GSAP via CDN + `js/animations.js`
- **Created `js/animations.js`** — opt-in effects triggered by data attributes
- **GSAP 3.12.5 + ScrollTrigger loaded via CDN in `<head>`** (`defer`)
- Three effects available, all activated by data attributes:
  1. `[data-stagger="word"]` → `initTextStagger()` — word-by-word fade-in (currently **not applied** anywhere; removed from solution H2 after test)
  2. `[data-parallax]` → `initParallax()` — applied to the 3 `.solution-bg` images (scale 1.45, yPercent ±18.75%)
  3. `[data-parallax-grid]` + `[data-parallax-col]` → `initCounterParallaxGrid()` — applied to `.what-columns` with 3 `.what-col-body` targets (SHIFT=10% alternating direction)
- All effects share single `ScrollTrigger.refresh()` on `window.load`

#### Solution section — font/spacing + Figma parity + overlay removal
- `.solution-h2`: removed `text-transform: uppercase`, `letter-spacing` `-1px` → `0` (per Figma)
- **Then hard-coded H2 text to UPPERCASE** in HTML per user's explicit request (lines 1622/1643/1666) — user reverted the Figma lowercase after initially agreeing
- `.solution-info { bottom }` `100px` → `80px` (Figma)
- `.solution-info { left }` changed from `max(80px, calc(50% - 640px))` → **`left: 80px`** at all breakpoints (user requirement: always 80px from viewport left, responsive-safe)
- `.solution-desc`: removed `opacity: 0.85`
- **Removed all 3 `.solution-overlay` divs + the CSS rule entirely** — user wanted background images shown without dark tint (A3 option)
- `.solution-section { height }` stayed at `100vh` (tested 810px briefly, reverted)
- `data-parallax` added to each `.solution-bg`; inline `style="background-image:..."` replaced with `<img src="Solution N.png">` child
- CSS override: `.solution-bg[data-parallax] { position: absolute }` — higher specificity than generic `[data-parallax] { position: relative }`
- **3 background images replaced**: old `Section Solution 1/2/3.png` deleted; new `Solution 1/2/3.png` (user provided) in use
  - Orphans `Solution.png` and `Solution-2.png` also deleted
  - Filenames normalized (double-space and plural `s` fixed) before use
- `data-stagger="word"` was briefly applied then removed on all 3 H2 (user reverted)
- Parallax strength escalated over the session: ±6.25 → ±12.5 → **±18.75%** (1.5× the default); CSS `scale` adjusted 1.125 → 1.3 → **1.45** to prevent edge reveal

#### What We've Done section — Figma parity + counter-parallax grid
- **Removed entire parallax `<script>` block** (text/image independent movement) — replaced by counter-parallax grid effect
- Removed `will-change: transform` declarations that were specific to that old parallax
- **Border lines fixed**:
  - Moved `border-left` from `.what-col` (full 927px) → `.what-col-header` only (148/314/174 heights) — matches Figma (vertical line only spans header, not body)
  - Color: `rgba(255,255,255,0.15)` → **`#484848`** (Figma's exact rgb(72,72,72))
- `.what-heading` letter-spacing `-1px` → `0`
- **Text content rewritten to match Figma**:
  - Col 01: "Green Building Initiative" / "CITIES & DISTRICTS" → **"FACILTIY OPS MANAGEMENT" / "Keeping our cities on track — today, and for generations."**
  - Col 02: desc "DEFENSE & SECURITY" → **"Watching over the places people trust every day."**; button "View all usecases" → **"View all use cases"**
  - Col 03: "FACILTIY OPS MANAGEMENT" / "TRANSPORT" → **"CROWD MANAGEMENT" / "Keeping places running, day after day."**
  - (NOTE: "FACILTIY" typo now lives on col 01, not col 03 — Figma design moved it)
- `.what-col-cat`: color `#7b7b7b` → `#b4b4b4`, added `text-transform: none` (was relying on uppercased category labels; now it's a descriptive sentence)
- **Counter-parallax grid applied**: `data-parallax-grid` on `.what-columns`, `data-parallax-col` on 3 × `.what-col-body` — only text+image clusters drift; `.what-col-header` (01/02/03 numbers) stays fixed per user's G1b choice

#### Value section — animation rebuild + text rewrite
- **Card rotations changed** per user spec:
  - Card 1: −25° → **−30°**
  - Card 2: −25° → **+30°** (opposite direction)
  - Card 3: −25° → **−30°**
  - Encoded as `startRot` per card in the `cards[]` array
- **Stagger timing changed**: `start = i * CARD_TRAVEL` (sequential, wait full) → **`start = i * CARD_TRAVEL * STAGGER`** with `STAGGER = 2/3` — card N+1 starts when card N is 2/3 through its travel
- **Easing changed**: `easeOutCubic` → **linear (no easing)** — eliminates "dead tail" where cubic produced almost no movement in last 30% of scroll, which felt like the section was "stuck"
- **Wrapper height now viewport-aware**: static `calc(1140px + 1800px)` (= 2940px with 1453 px dead scroll) → **`calc(1140px + max(300px, 1247px - 100vh))`** — scales so sticky releases immediately when card 3 settles. Formula: card 3 end in `adjusted` coords = 1167, so scroll room needed = 1167 − (vh − 80) = 1247 − 100vh.
- `TOP_OFFSET`: `140` → `150` (match Figma card1 y=150)
- **Heading text rewritten** to Figma content:
  - Old: `"The Value of a team that understands the work"` (3 spans white/gray/white)
  - New: `"Every day, we help cities move, grow, and thrive."` — **8 spans** alternating white/gray per Figma's styled ranges
- `.value-h2 { letter-spacing }` `-1px` → `0`
- `.value-left`: `top: 120 → 240`, `gap: 40 → 80`, `width: 560 → 639` (match Figma y=240 from section top)
- `.value-desc`: text rewritten to Figma content; `max-width: 335 → 396`

#### Logo / Partners section
- **Subtitle row positioning fixed**: removed `max-width: 1440px`, added `width: 100%; box-sizing: border-box` → "TO MANAGEMENT" now always 80px from viewport right edge at any width
- **Arrow icon replaced with exact Figma vector**:
  - Old: hand-drawn stroke chevron path
  - New: **2-path filled SVG exported from Figma node `40001048:2184`** — line path + arrowhead path (9-point filled outline), color `#808080`
  - Structure: line = CSS flex div (stretches); chevron = `position: absolute; right: 0` overlaying the line's last 16 px. Line visually passes through the chevron's open V to the tip — matches Figma's layering.
- **Draw animation**: line + chevron wrapped in `.logo-subtitle-arrow-wrap`; `clip-path: inset(0 100% 0 0)` → `inset(0 0 0 0)` over 1.4 s cubic — reveals the whole arrow left→right as one continuous stroke
- "TO MANAGEMENT" text retains its `0.7 s / delay 1.0 s` fade-in (unchanged)
- Color `#808080` matches Figma exactly (old `rgba(255,255,255,0.15)` on `#131313` was too dim — Figma is brighter/solid)

#### Marquee section
- **Removed `border-bottom: 1px solid`** — was showing as unwanted 1 px line above Solution 1
- Removed `border-color` from `transition` property (no longer needed)

#### Logo image (Infralink branding)
- User added `Logo 2.png` (340×88 px, horizontal aspect 3.86 : 1 — icon + wordmark combined)
- **Nav**: removed 30×30 SVG diamond mark + `<span class="logo-wordmark">Infralink</span>` → single `<img src="Logo 2.png" class="nav-logo-img">` (height 44 px)
- **Footer**: removed `.footer-logo-icon` container (44×44 `#262626` bg) + 28×28 SVG + wordmark span → single `<img src="Logo 2.png" class="footer-logo-img">` (height 44 px)
- CSS rules removed: `.logo-wordmark`, `.footer-logo-icon`, `.footer-wordmark` — dead code cleaned

#### Preview tool fix
- `.claude/launch.json`: switched from `python3 -m http.server` → `npx -y http-server -p 8010 -c-1 /Users/mai/Documents/15_SJ Landing page/sj-draft-landing`
- Reason: macOS sandboxing blocked `python3 http.server` from reading `os.getcwd()` in the Claude-owned runtime context. `npx http-server` takes an explicit path argument and works fine.

### Key decisions (Session 8)

- **GSAP + data-attribute pattern is the new standard** for all scroll effects going forward. The old inline `<script>` IIFE per effect is legacy — don't add more of those. To add an effect to any element, add the corresponding data attribute; no JS edit needed.
- **SHIFT in counter-parallax grid is a single knob** — same magnitude for every column, only direction alternates. Do NOT per-column-customize speeds; user explicitly rejected that.
- **Parallax scale-vs-translate rule**: whenever `[data-parallax] img`'s `transform: scale(X)` is set, `X` must be `≥ 1 + 2 × max|yPercent|/100`. Current: yPercent ±18.75 → scale 1.45 (need ≥ 1.375; buffer for subpixel). If yPercent is bumped again, bump scale.
- **`splitWords()` destroys innerHTML** — never apply `data-stagger="word"` to elements whose styling relies on child spans (e.g. `.value-h2` with 8 colored spans). If needed, adapt the splitter.
- **Solution section layering**: user asked for NO overlay, NO scroll effects on text, ONLY background parallax via GSAP. H2 hard-coded UPPERCASE in HTML (not CSS `text-transform`) so the literal DOM text is what shows.
- **Value card sticky timing**: wrapper height is derived from scroll-math (`1247 − 100vh`) — if you ever change `STAGGER` (2/3), `CARD_TRAVEL` (500), or `ENTRY_OFFSET` (80), recompute the formula or the "stuck at card 3" bug returns.
- **Figma arrow implementation**: line is CSS (stretchable), arrowhead is absolute-positioned SVG overlay at right. Both live inside `.logo-subtitle-arrow-wrap` so the single `clip-path` animation reveals them together. Line runs UNDER the arrow's open V all the way to the tip — mirrors Figma's layered paths exactly.
- **Preview_screenshot tool is unreliable in this environment** — returned all-black frames repeatedly despite DOM being correct. Rely on `preview_inspect` / `preview_eval` for verification and ask user to visually confirm in their own browser.

---

## Current state (end of Session 8)

- **localhost**: user's browser at `localhost:8010` (npx http-server via Claude Preview). User's own `python3 -m http.server 8000` may or may not still be running — not required for Claude work.
- **Vercel**: still on Session 6 state (commit `e53adba`). Sessions 7 + 8 both uncommitted and undeployed.
- **GitHub**: `main` branch still at `e53adba`. Session 7 worktree `bold-hoover-ed7d1e` exists with its diff. Session 8 work is in the **main working copy** at `/Users/mai/Documents/15_SJ Landing page/sj-draft-landing`, not in a worktree.
- **Uncommitted files**:
  - `index.html` (large diff — font/spacing, text rewrites, GSAP CDN, new CSS, data-attrs)
  - `js/animations.js` (new file)
  - `.claude/launch.json` (preview server command)
  - `Solution 1.png`, `Solution 2.png`, `Solution 3.png` (new images, renamed from user-provided files)
  - `Logo 2.png` (new logo)
  - Deleted: `Section Solution 1/2/3.png`, `Solution.png`, `Solution-2.png`
- **All three scroll-effects modules registered**:
  - `initTextStagger()` — registered, no targets in DOM currently
  - `initParallax()` — 3 targets (solution bg images)
  - `initCounterParallaxGrid()` — 1 grid, 3 column targets (what section)

---

## Todo — next session

### Priority 1: Visual QA on GSAP effects
Open `localhost:8010` in real browser and verify:
- **Solution bg parallax**: scroll through all 3 sections; images should visibly drift at ±18.75%. If still feels weak, consider bumping SHIFT in `initParallax()` from 18.75 (and scale accordingly).
- **Counter-parallax grid (What section)**: scroll through; col 1 & 3 should drift up, col 2 should drift down. Watch for **empty space** at top/bottom of `.what-col-body` when it shifts — if visible, reduce SHIFT from 10 to 6-8 in `js/animations.js`.
- **Value cards**: scroll into section; all 3 should slide in from bottom-right with alternating rotations (−30°, +30°, −30°); **no stuck/khựng** feeling at the end; cards settle just as sticky releases.
- **Logo subtitle arrow**: scroll to "FROM DATA ——► TO MANAGEMENT" row; arrow should draw left-to-right in one continuous stroke, then "TO MANAGEMENT" fades in.

### Priority 2: Replace Solution background images with higher-quality versions
User said they will "send higher-quality images later." Current `Solution 1/2/3.png` are compressed (808 KB / 3.7 MB / 394 KB — especially Solution 3 is heavily compressed) and look blurry at scale 1.45. When user provides new files:
- Drop into project root with same names → no code changes needed
- If names differ, update 3 `<img src="...">` in HTML
- Files ≥ 3 MB PNG or JPG Q90+ recommended for scale 1.45 sharpness

### Priority 3: Carry-over cleanup from Session 7
- Stale `solutionItems` reference at `index.html:1572` — still there, still harmless, still should be removed
- `--mq-travel` CSS var audit — still pending
- `.solution-gap` CSS rule at mobile breakpoint — still orphaned, still safe to remove

### Priority 4: Commit & deploy
- Session 7 + Session 8 combined diff is large; user should decide whether to squash or split commits
- `git add index.html js/ "Solution 1.png" "Solution 2.png" "Solution 3.png" "Logo 2.png" .claude/launch.json`
- `git rm "Section Solution 1.png" "Section Solution 2.png" "Section Solution 3.png" Solution.png Solution-2.png`
- Commit, push, `vercel --prod --yes`

### Priority 5: Responsive pass (still not done)
- What section: no mobile breakpoints for the new counter-parallax or column layout
- Value section: `.value-inner` fixed `1440px`, cards absolute at `left: 789px` — not responsive
- Logo subtitle arrow: wrap/line uses flex but chevron is `position: absolute; right: 0` — should work on narrow viewports but untested
- Solution `.solution-info { left: 80px }` at mobile ≤480 — needs visual check for cramping (right padding is only 20px currently)

### Priority 6: Footer carry-overs (pre-launch)
- Social icon `href="#"` placeholders → real URLs
- Tagline "Real Impact, Made Together" — confirm it's final

---

## Known bugs / edge cases (Session 8 additions)

- **`preview_screenshot` returns all-black frames** in this environment — use `preview_inspect` / `preview_eval` for DOM verification and ask user to confirm visually.
- **GSAP CDN failure leaves `.stagger-word { opacity: 0 }` elements invisible** — no `.no-js` fallback. If CDN blocks or errors, word-stagger targets disappear entirely. (Currently no word-stagger is applied, so no visible impact, but stay aware.)
- **Parallax edge reveal**: if someone bumps `yPercent` in `initParallax()` without bumping CSS `scale` proportionally (rule: scale ≥ 1 + 2 × max|yPercent|/100), the image edges will flash black/white at parallax extremes.
- **Value wrapper formula is coupled to 3 constants**: `CARD_TRAVEL=500`, `STAGGER=2/3`, `ENTRY_OFFSET=80`. Formula `1247 = (3−1)·CARD_TRAVEL·STAGGER + CARD_TRAVEL + ENTRY_OFFSET = 666.67 + 500 + 80`. Any change to these breaks the no-dead-scroll guarantee until the CSS is re-derived.
- **`splitWords()` destroys HTML** — do not apply `data-stagger="word"` to `.value-h2` or any element whose child spans carry styling.
- **New Solution images heavily compressed** — visibly blurry at scale 1.45 parallax. User acknowledged, will replace.
- **Counter-parallax grid empty-space risk** — `.what-col-body` drifting ±10% could reveal background if col height × SHIFT > available header space (148/314/174 px). Currently safe (body ~779 px, 10 % = 78 px, less than smallest header 148 px), but if SHIFT goes above ~18 it will break.
- **Counter-parallax col 2 drift direction**: col 2 (`#whatCol2`) has a `.what-btn` "View all use cases" at its bottom. When col 2 drifts DOWN (its direction per the alternating rule), the button may partially clip under the `.what-columns` overflow-hidden boundary. Untested.
- **Hero logo PNG**: `Logo 2.png` must be transparent-bg PNG; if it has a white/dark bg, it'll clash with the dark nav (`#111111`) and footer (`#111111`) backgrounds. Confirm with user.
- **No pointer-events on chevron overlay**: already set `pointer-events: none` — any future click handler on the row won't be blocked by the SVG. Don't remove.
- **Preview tool port 8010**: `.claude/launch.json` pins port 8010 via `npx http-server`. If user's own server also tries 8010, conflict. Currently user runs 8000, so OK.
- **All Session 7 edge cases still apply** (see above): stale `solutionItems`, `.solution-gap` orphan CSS, mobile What section, Value non-responsive, etc.
