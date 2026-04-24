/*
 * GSAP scroll animations for the Infralink landing page.
 *
 * Effects:
 *   1. Text stagger            — [data-stagger="word"]  word-by-word fade-in + rise
 *   2. Image parallax          — [data-parallax]        scale 1.125, ±6.25 % yPercent
 *   3. Counter-parallax grid   — [data-parallax-grid] + [data-parallax-col]
 *                                 alternating up/down column drift tied to scroll
 *
 * All effects are opt-in via data attributes. Apply them to any element
 * in index.html to enable.
 *
 * Notes:
 *   - splitWords() replaces innerHTML, so do NOT apply data-stagger to
 *     elements containing styled <span>s (e.g. .value-h2 with colored
 *     word spans) — the color spans will be destroyed. Use a wrapper or
 *     adapt the split strategy in that case.
 *   - [data-parallax] requires a single <img> or <video> child. Parent
 *     gets overflow:hidden + position:relative via CSS.
 *   - The `gsap` and `ScrollTrigger` globals must be loaded from CDN
 *     before this script runs.
 */

gsap.registerPlugin(ScrollTrigger);

/* ─── Helpers ──────────────────────────────────────────────────────── */

function splitWords(element) {
  const text = element.textContent.trim();
  element.setAttribute('aria-label', text);
  element.innerHTML = text.split(/\s+/)
    .map(w => `<span class="stagger-word" aria-hidden="true">${w}</span>`)
    .join(' ');
  return element.querySelectorAll('.stagger-word');
}

/* ─── Effect 1: Text stagger ──────────────────────────────────────── */

function initTextStagger() {
  document.querySelectorAll('[data-stagger="word"]').forEach(el => {
    const words = splitWords(el);
    gsap.to(words, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.03,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    });
  });
}

/* ─── Effect 2: Image parallax ────────────────────────────────────── */

function initParallax() {
  document.querySelectorAll('[data-parallax]').forEach(el => {
    const media = el.querySelector('img, video');
    if (!media) return;
    gsap.fromTo(
      media,
      { yPercent: -18.75 },
      {
        yPercent: 18.75,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      }
    );
  });
}

/* ─── Effect 3: Counter-parallax grid ─────────────────────────────── */

/*
 * Target pattern:
 *   <div data-parallax-grid>
 *     <div data-parallax-col>...</div>   <- index 0 → drifts UP
 *     <div data-parallax-col>...</div>   <- index 1 → drifts DOWN
 *     <div data-parallax-col>...</div>   <- index 2 → drifts UP
 *     ...
 *   </div>
 *
 * All columns travel the same distance; only the DIRECTION alternates.
 * Tweak `SHIFT` to make the effect stronger/weaker (default ±10 %).
 * Keep the parent tall enough that ±SHIFT % of the column height does not
 * expose empty space inside the grid (`overflow:hidden` on the grid also
 * clips any overflow).
 */
function initCounterParallaxGrid() {
  const SHIFT = 10; // percent — edit this single constant to scale the effect

  document.querySelectorAll('[data-parallax-grid]').forEach(grid => {
    const columns = grid.querySelectorAll('[data-parallax-col]');

    columns.forEach((col, index) => {
      // Index 0, 2, 4… drift UP (negative yPercent progression);
      // Index 1, 3, 5… drift DOWN. All use the same |SHIFT| magnitude.
      const direction = index % 2 === 0 ? -1 : 1;

      gsap.fromTo(
        col,
        { yPercent: -SHIFT * direction },
        {
          yPercent: SHIFT * direction,
          ease: 'none',
          scrollTrigger: {
            trigger: grid,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        }
      );
    });
  });
}

/* ─── Boot ────────────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  initTextStagger();
  initParallax();
  initCounterParallaxGrid();
});

/* Re-measure after images/fonts finish loading to avoid stale trigger
 * positions — especially important for the marquee and solution sections
 * whose heights depend on web-font metrics. */
window.addEventListener('load', () => ScrollTrigger.refresh());
