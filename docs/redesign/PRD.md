# PRD — Ghubor Homepage: Minimal Redesign & Performance Pass

| | |
|---|---|
| **Status** | Draft — ready for implementation |
| **Owner** | Harsha (Ghubor) |
| **Date** | 2026-11-03 |
| **Branch** | `claude/website-minimal-redesign-33e3ec` |
| **Stack** | Next.js 15 (App Router) · React 19 · Tailwind v4 · framer-motion 12 · Firebase · ogl (WebGL) |

---

## 1. Summary

Turn the Ghubor homepage into a **short, minimal, editorial preview** of the brand: a transparent header that floats over a full-bleed hero, a calm product rail, and the existing brand story and pillars — nothing else competing for attention. At the same time, remove the jitter and the 2–3 second "settling" period on first load so the page feels native: instant first paint, 60/120 fps scrolling, no layout shift.

Visual inspiration is the long-scroll editorial layout of a premium athleisure storefront (full-bleed photography, generous white space, thin type, circular translucent header icons, category tiles, a statement block, a black footer). **It is inspiration only — do not copy its layout pixel-for-pixel, its copy, its naming, or its assets.** Everything is expressed in Ghubor's own voice, palette and imagery.

## 2. Goals

1. **Minimal look** — fewer sections, more white space, fewer effects. White / deep-red (`#5C0606`) / black only.
2. **Transparent header with "hanging" icons** — header sits on top of the hero with no background; utility icons (search, account, wishlist, cart) are circular translucent buttons that appear to hang off the right side.
3. **New hero/banner** — one full-bleed image, one line of copy, one CTA. No zoom-in intro, no staggered multi-second fade.
4. **Replace the sliding animation** — remove the WebGL liquid carousel and the coupon marquee from the homepage; replace with a native, CSS-only horizontal product rail (scroll-snap) that the user drives.
5. **Kill the jitter and the 2–3 s load** — measurable targets in §7.
6. **Preserve the brand story and pillars verbatim** (see §4).
7. **Clean out stale code, caches and leftovers** (see §6.5).

## 3. Non-goals

- No changes to checkout, cart, payment, admin, auth, API routes, Firestore rules, or DHL/Razorpay integrations.
- No new CMS fields or Firestore schema changes.
- No dark mode (it was removed intentionally — do not reintroduce).
- No rewrite of `/shop` or `/shop/[id]` beyond picking up the new shared header.
- No new heavy dependencies (no Lenis/Locomotive/GSAP/Swiper). The goal is *less* JS.

## 4. What must NOT change (content lock)

These texts and structures are the brand guideline as it lives in the code today. Keep the **wording exactly**; only restyle them.

**Brand story** — `src/components/About.tsx`
- Eyebrow: "The Mythos & Foundation"
- Heading: "Derived from the Hebrew Gibbor, *a mighty warrior, hero,* Ghubor makes wearable scripture for people fighting battles nobody sees." (middle segment stays serif italic in brand red)
- Body: "Ghubor makes wearable scripture for the silent battles nobody else sees. Each garment stands as a concrete testament of struggle, faith, and transcendence—meticulously engineered to feel like armor, constructed to become second skin."
- Pillar summary: Struggle — "The weight of human" · Faith — "Belief without proof" · Transcendence — "Armor becomes skin"

**Brand pillars** — `src/components/Features.tsx`
- Eyebrow: "THE SIGNATURE PILLARS"
- Header: "Wearable scripture forged for silent battles." / "Dark. Sacred. Spare. Speaks in fragments."
- Cards (titles, numbering, every checklist line, link labels): 01. Armored Build · 02. Hidden Inscriptions · 03. Archival Relics, plus the "Artifact Showcase / Sacred silhouettes." media card.
- Pillar images via `getImageUrl("struggle" | "faith" | "transcendence")`.

**Site-wide**
- Metadata title/description in `src/app/layout.tsx`, the tagline "Armor for the modern Gibbor. Wearable scripture.", the CTA "ENTER THE RITUAL", logos in `/public`, Meta Pixel script.
- Product data source: `fetchStorefrontProducts()` (`src/utils/cms.ts`), wishlist/cart events (`wishlist-updated`, `cart-updated`), localStorage keys `ghubor-cart`, `ghubor-wishlist`.
- Admin-editable images: `ImageConfigContext` slot ids (`hero`, `struggle`, `faith`, `transcendence`, …) must keep working.

## 5. Current state & problems (audit)

| # | Area | File(s) | Problem |
|---|---|---|---|
| P1 | Global CSS transitions | `src/app/globals.css` | `body, div, section, a, p, span, … { transition: background-color .4s, color .4s, box-shadow .4s … }` on **every element**. Any class/hydration change animates thousands of nodes → paint storms, the "flash" on load, scroll jank. Leftover from the removed dark-mode toggle. |
| P2 | Hero intro | `src/components/Hero.tsx` | Full-bleed image animates `scale 1.1→1` over **2.5 s**; text/CTA fade in with delays up to 0.6 s + 1.2 s. This *is* the "2–3 s loading" feeling. |
| P3 | Blur blobs | `Hero.tsx`, `About.tsx`, `Features.tsx` | 10+ absolutely-positioned divs with `filter: blur(55–140px)` plus SVG `feTurbulence` noise overlays. Very expensive to rasterize and re-composite while scrolling. |
| P4 | Marquee banner | `src/components/MarqueeBanner.tsx` | Measures width after mount, then injects `<style>` keyframes → visible jump; fetches coupons from Firestore after paint → text swap. Also used on `/shop` and `/shop/[id]`. |
| P5 | WebGL carousel | `FeaturedCarouselSection.tsx`, `FlexCarousel.jsx` (1,276 lines), `FlexCarousel.css`, `ogl` | Full WebGL renderer + RAF loop for an auto-sliding strip; returns `null` until products load → layout shift; history of scroll-blocking bugs (see recent commits). |
| P6 | Duplicate client fetches | `FeaturedCarouselSection.tsx`, `ProductLineup.tsx` | Both call `fetchStorefrontProducts()` on mount; both render `null` until data arrives → two layout shifts below the hero. |
| P7 | Header | `src/components/Navbar.tsx` | Rendered *inside* the hero section, gradient + `backdrop-blur-md` + border over the photo; mono 10px links; pulsing badges (`animate-pulse`); spring `layoutId` indicator. Busy, not minimal. |
| P8 | Image source swap | `ImageConfigContext.tsx`, `ThemeContext.tsx` | Hero URL resolves from defaults → localStorage → Firestore, and theme class is applied in `useEffect`. The hero `src` can change after first paint → re-download + flash. |
| P9 | Fonts | `layout.tsx`, `globals.css` | `next/font` Almarai is applied via class, but `* { font-family: 'Almarai', … }` names the raw family, which next/font does not register under that name → fallback font then swap (FOUT). Custom `@font-face` blocks have no `font-display`. |
| P10 | Smooth-scroll | `globals.css` | `html { scroll-behavior: smooth }` fights native scroll restoration and anchor jumps; keep native. |
| P11 | Pillars entrance | `Features.tsx`, `WordsPullUpMultiStyle.tsx` | Word-by-word pull-up + staggered scale-in cards + autoplay remote video; heavy for a section that should read calmly. |
| P12 | Leftovers | repo root | Vite README, `src/assets/{react,vite}.svg`, `src/assets/hero.png`, `public/{next,vercel,file,globe,window}.svg`, committed `tsconfig.tsbuildinfo`, `animate-marquee` utilities, unused `ThemeContext` dark branch, `/demodesign` playground page. |

## 6. Requirements

### 6.1 Header — transparent, with hanging icons

- **Position:** `fixed` top, full width, `z-50`, height 64px mobile / 80px desktop. Rendered **once**, outside the hero (homepage) — not nested in a section.
- **Layout:** three-column grid `grid-cols-[1fr_auto_1fr]`:
  - Left: text links `Shop`, `About` (desktop); hamburger (mobile).
  - Center: Ghubor logo (`/logo-white.svg` over the hero, `/logo-black.svg` once solid).
  - Right: **hanging icon cluster** — circular 40px buttons for Search, Account, Wishlist, and a pill-shaped Cart button showing the count.
- **Hanging icon style:** `rounded-full`, `background: rgba(255,255,255,.10)` with a 1px `rgba(255,255,255,.18)` ring over the hero; `rgba(0,0,0,.04)` + `rgba(0,0,0,.08)` ring when solid. Icons 18px, stroke 1.5 (lucide). Optional subtle "hang": icons sit 4–6px lower than the link baseline, as if suspended from the top edge — no physics, no swing animation by default.
- **States:**
  - *Transparent* (top of homepage, over hero): no background, no border, no blur, white text/icons.
  - *Solid* (after scrolling past ~80% of hero height, or on any non-home page): white background, 1px bottom border `--border-color`, black text/icons.
  - Transition: only `background-color` and `color`, 200ms. Driven by an `IntersectionObserver` on a sentinel at the bottom of the hero — **no scroll listeners**, no React state updates per scroll frame.
- **Badges:** cart count inside the pill; wishlist as a static 6px red dot. **No `animate-pulse`.**
- **Search:** clicking Search opens an overlay panel (fade, 150ms) with the existing search → `/shop?q=` behavior. No height animation.
- **Mobile menu:** full-screen white sheet, opacity transition only, links in large thin type. Keep the "GHUBOR © 2026. FOR THE MODERN GIBBOR." line.
- **Accessibility:** every icon button has `aria-label`; visible focus ring; header contrast ≥ 4.5:1 in both states (use a light top-gradient scrim *on the hero image*, not on the header, if the photo is too bright).
- **Other pages:** same component, `variant="solid"` by default, so every page gets the new header without per-page changes beyond the prop.

### 6.2 Hero / banner

- **Remove** `MarqueeBanner` from the homepage. If promo codes are still needed, render them as a single static line *inside the footer* or as a non-animated, server-rendered strip — decision: **remove from homepage; keep on `/shop` only as a static (non-scrolling) line**.
- Hero = `100svh` (fallback `100vh`), full-bleed `next/image` with `priority`, `fetchPriority="high"`, `sizes="100vw"`, `quality≈75`, `placeholder="blur"` using a tiny inline base64 (generate from `public/images/hero.webp`).
- Content bottom-left (desktop) / bottom-centered (mobile):
  - Small eyebrow: "COVENANT DROP I"
  - Headline (serif italic, white): "Armor for the modern Gibbor. Wearable scripture."
  - One CTA: "ENTER THE RITUAL" → `/shop` (keep current pill-with-arrow shape but flatter: no heavy shadow).
- **No** zoom, no blur blobs, no noise overlay, no bouncing "scroll to descend". Hero text is visible in the first paint (rendered on the server, no `initial={{opacity:0}}`). A one-time 400ms opacity fade on the text is allowed **only** if it starts from a visible-enough state that LCP isn't delayed — preferred: no animation at all.
- A soft bottom gradient (`linear-gradient(to top, rgba(0,0,0,.35), transparent 40%)`) for legibility. Plain CSS, no filters.
- The hero image source stays admin-configurable, but the **first render must use the static default** (`/images/hero-light.webp`) and only swap if a different CMS URL arrives — and then crossfade, never hard-swap. Better: resolve the hero URL on the server.

### 6.3 Sliding animation → native product rail

- Delete the WebGL carousel from the homepage (`FeaturedCarouselSection`). Remove `FlexCarousel.*` and the `ogl` dependency if no other route uses them (`/demodesign` does — delete that page too; see §6.5).
- New section **"Latest Drop"** = one horizontal rail:
  - CSS `overflow-x: auto; scroll-snap-type: x mandatory; overscroll-behavior-x: contain;` cards `scroll-snap-align: start`.
  - Card width: 72vw mobile, 30vw tablet, 22vw desktop; aspect 4/5; image `object-cover`, title + price beneath in small caps.
  - Prev/next arrow buttons (desktop only) that call `scrollBy({ left: ±cardWidth, behavior: "smooth" })`.
  - **No autoplay.** No JS-driven translate. No wheel capture. Vertical page scroll must never be intercepted.
  - Hide scrollbar visually but keep it accessible (`scrollbar-width: none` + keyboard focusable rail).
- Merge `ProductLineup` into this: **one** product fetch for the homepage, not two. While loading, render fixed-size skeleton cards (same aspect ratio) so nothing shifts.
- Optional second, minimal block inspired by the reference's category tiles: **"Shop by Pillar"** — three equal tiles (Struggle / Faith / Transcendence) using the existing pillar images, each linking to `/shop`. Only if it doesn't duplicate the Pillars section visually; otherwise skip.

### 6.4 Brand story & pillars (restyle only)

- **About:** remove the card shell, heavy shadow and all four blur blobs. Plain white section, centered, max-width ~880px, generous padding (`py-32`). Keep the multi-style heading (the italic red middle segment). Replace the word-by-word pull-up with a single section-level fade/translate (opacity 0→1, y 12→0, 500ms, once).
- **Pillars:** keep header + all four cards and all copy. Restyle as a flat 4-column grid (2 on tablet, 1 on mobile), hairline borders, no shadows, no noise, no blobs. Card entrance: one opacity transition per card (stagger ≤ 60ms), triggered once.
  - The video card: `preload="none"`, `poster` = a still, play only when in view (IntersectionObserver), pause when out of view. Respect `prefers-reduced-motion` (show poster only).
- **Reviews:** keep, restyle to the minimal system (no new behavior).
- **Brand statement block (new, small):** a full-width black band with one line of brand copy reused verbatim from existing text — e.g. "Dark. Sacred. Spare. Speaks in fragments." — white serif italic, centered. (Inspired by the reference's statement block; no new copy is invented.)
- **Footer:** keep links/content; restyle to black background, white text, minimal columns.

### Final homepage order

1. Header (fixed, transparent → solid)
2. Hero (full-bleed, one line, one CTA)
3. Latest Drop rail (native scroll-snap)
4. Brand story (About) — unchanged copy
5. Signature Pillars (Features) — unchanged copy
6. Brand statement band (black)
7. Reviews
8. Footer (black)

### 6.5 Performance, jitter & cleanup

**Animation rules**
- Animate only `transform` and `opacity`. Never animate `filter`, `box-shadow`, `height`, `width`, `top/left`, or `background` on large areas.
- Delete the global `transition:` rule on `body, div, section, …` in `globals.css`. Add transitions per component where needed.
- Delete all `filter: blur(…)` decorative blobs and `noise-overlay` / `bg-noise` usages on the homepage (and the CSS if unused elsewhere).
- Remove `will-change` everywhere except on an element *while* it animates.
- Remove `html { scroll-behavior: smooth }` (use `behavior: "smooth"` only in the specific `scrollIntoView`/`scrollBy` calls).
- Respect `@media (prefers-reduced-motion: reduce)`: disable all non-essential motion.
- framer-motion: keep it only where a component actually needs it; prefer CSS transitions + a tiny `useInView`/IntersectionObserver hook. Use `LazyMotion` + `domAnimation` if framer stays, to cut bundle size.

**Loading**
- Hero image is the LCP element: server-rendered, `priority`, blur placeholder, no animation gating it.
- Everything below the fold: `loading="lazy"`, explicit `sizes`, fixed aspect boxes (zero CLS).
- Fonts: apply next/font correctly — expose Almarai as a CSS variable (`variable: "--font-almarai"`) and use `var(--font-almarai)` in `@theme`/body instead of the raw `'Almarai'` name; add `font-display: swap` to the three local `@font-face` blocks, and preload only the one used above the fold (if any). Prefer moving them to `next/font/local`.
- Move `ThemeContext` out of the critical path: the site is light-only, so delete the dark-mode branch and the `useEffect` that toggles `html` classes. Set `className="light"` on `<html>` statically if any CSS still depends on it.
- `ImageConfigProvider`: render with static defaults immediately; never block or re-key images on Firestore load; crossfade if a URL actually changes.
- Meta Pixel stays `afterInteractive` (or move to `lazyOnload` if acceptable to marketing).
- Make `src/app/page.tsx` a Server Component; only the header, rail and in-view animations are client islands. `MainLayout` should not be `"use client"` as a whole.

**Cache & leftovers ("remove old cache and other stuff")**
- Delete local build caches before measuring: `.next/`, `node_modules/.cache/`, `tsconfig.tsbuildinfo` (and add `*.tsbuildinfo` to `.gitignore`).
- Remove Vite leftovers: rewrite `README.md` for Next.js; delete `src/assets/react.svg`, `src/assets/vite.svg`, and `src/assets/hero.png` if unreferenced; delete unused `public/{next,vercel,file,globe,window}.svg`.
- Delete `src/app/demodesign/`, `FlexCarousel.jsx/.css/.d.ts`, `FeaturedCarouselSection.tsx`, and uninstall `ogl` once nothing imports them.
- Delete `MarqueeBanner.tsx` only if `/shop` pages are switched to the static promo line; otherwise leave it and just remove it from the homepage.
- Remove now-unused utilities: `--animate-marquee`, `.animate-marquee`, `.edge-fade-mask`, `WordsPullUp*`, `AnimatedWord` (grep before deleting).
- Check for and unregister any stale service worker (there is none in the repo today — confirm in the browser's Application tab and leave no SW behind).
- `/_next/image` and `public/images/*` already send `immutable` cache headers; when replacing an image, **rename the file** (e.g. `hero-v2.webp`) instead of overwriting, so browsers don't serve the old cached one.

## 7. Success metrics (acceptance targets)

Measured on a production build (`npm run build && npm start`), Chrome Lighthouse mobile preset + DevTools Performance, cache disabled for cold-load runs.

| Metric | Target |
|---|---|
| LCP (hero image) | ≤ 1.8 s mobile (simulated 4G), ≤ 1.0 s desktop |
| CLS | ≤ 0.02 (no shifts when products load) |
| INP / TBT | TBT ≤ 150 ms; INP ≤ 100 ms |
| Time until hero text visible | First paint (0 ms animation delay) |
| Scroll smoothness | No long frames (> 16.7 ms) while scrolling the full homepage on a mid-range laptop; no frames > 50 ms on a 4× CPU-throttled run |
| Homepage first-load JS | ≥ 30% smaller than current (record before/after from `next build` output) |
| Lighthouse Performance | ≥ 90 mobile, ≥ 98 desktop |
| Requests before LCP | Hero image + fonts + critical JS only; no Firestore calls block the hero |

## 8. Acceptance checklist

- [ ] Header is transparent over the hero with white logo and circular translucent icons; turns solid white with black icons after the hero; no layout jump on the switch.
- [ ] Header is identical on every page (solid variant), and cart/wishlist counts still update via `cart-updated` / `wishlist-updated`.
- [ ] No marquee and no WebGL carousel on the homepage; `ogl` removed from `package.json` if unused.
- [ ] Product rail scrolls with touch/trackpad natively, snaps to cards, never blocks vertical page scroll, has no autoplay.
- [ ] Brand story and pillars copy is character-for-character identical to §4 (diff the strings).
- [ ] No `filter: blur`, noise overlays, global `transition` rule, or `animate-pulse` remains on the homepage.
- [ ] `prefers-reduced-motion` shows a fully static page.
- [ ] Metrics in §7 met and recorded in the PR description with before/after numbers.
- [ ] `npm run build` and `npm run lint` pass with no new warnings.
- [ ] Checkout, cart, login, admin and `/shop` still work (smoke test).

## 9. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Admin-configured hero image changes after paint | Server-resolve the hero URL or crossfade; never re-key `<Image>`. |
| White header text unreadable on bright hero photos | Top scrim gradient on the hero image (CSS only), and auto-solid state after the hero. |
| Removing `MarqueeBanner` hides active coupons | Keep a static promo line on `/shop`; confirm with owner before deleting the component. |
| Deleting `ThemeContext` breaks `ImageConfigContext` (it reads `theme`) | Keep the context API but hard-wire `theme = "light"`; refactor callers in a follow-up. |
| Font switch changes text metrics | Use `adjustFontFallback` (next/font default) and verify no CLS. |

## 10. Rollout

1. Baseline: record current Lighthouse + bundle numbers on `main`.
2. Implement in the order of the Claude Code prompt (cleanup → global CSS → header → hero → rail → story/pillars → footer).
3. Re-measure, attach numbers and screenshots (desktop + 375px mobile) to the PR.
4. Owner review on a Vercel/Firebase preview URL before merging.
