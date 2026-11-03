# Prompt for Claude Code — Ghubor minimal homepage redesign

Copy everything below the line into Claude Code, run from the repo root on a feature branch.

---

You are implementing the Ghubor homepage minimal redesign and performance pass.

**Read first, in this order:** `CLAUDE.md`, then `docs/redesign/PRD.md` (the spec — it wins over anything in this prompt if they disagree). Then read every file in `src/components/` that the homepage renders (`MainLayout`, `Hero`, `Navbar`, `MarqueeBanner`, `FeaturedCarouselSection`, `ProductLineup`, `About`, `Features`, `Reviews`, `Footer`), plus `src/app/layout.tsx`, `src/app/globals.css`, `src/components/ImageConfigContext.tsx`, `src/components/ThemeContext.tsx`, `next.config.ts`.

## Hard constraints

1. **Do not change the wording** of the brand story (`About.tsx`) or the brand pillars (`Features.tsx`). Restyle only. Before finishing, diff every string in those two files against `git show main:<file>` and confirm they are identical.
2. Do not touch checkout, payment, admin, API routes, Firebase config/rules, or `.env*`.
3. No new animation or scroll libraries. The aim is less JavaScript.
4. White / black / `#5C0606` only. No dark mode.
5. Use the reference storefront only as layout inspiration (transparent header with circular icons, full-bleed hero, generous white space, statement band, black footer). Do not copy its copy, names, assets, or exact layout.
6. Animate only `transform` and `opacity`. No `filter: blur`, noise overlays, `animate-pulse`, autoplay sliders, scroll listeners or wheel capture.

## Step 0 — Baseline

- `npm install`, `npm run build`. Save the "First Load JS" table for `/` from the build output.
- `npm run start`, run Lighthouse (mobile + desktop) on `/`, and record LCP, CLS, TBT, Performance score. Keep these numbers for the PR.

## Step 1 — Clean up leftovers and caches

- Delete `.next/`, `node_modules/.cache/`, `tsconfig.tsbuildinfo`; add `*.tsbuildinfo` to `.gitignore`.
- Rewrite `README.md` for this Next.js project (short: what it is, commands, link to `CLAUDE.md`).
- Delete unreferenced Vite/Next starter assets (`src/assets/react.svg`, `src/assets/vite.svg`, `src/assets/hero.png`, `public/{next,vercel,file,globe,window}.svg`) — **grep for each before deleting**.
- Commit: `chore: remove starter leftovers and build caches`.

## Step 2 — Global CSS and providers (the jitter fix)

- In `globals.css`: delete the global `transition:` rule on `body, div, section, …`; delete `html { scroll-behavior: smooth }`; add a `prefers-reduced-motion` block that disables animations/transitions.
- Fix fonts: give Almarai a `variable` in `layout.tsx` and use it in `@theme`/body instead of the raw `'Almarai'` family in the `*` rule; add `font-display: swap` to the local `@font-face` rules (or move them to `next/font/local`).
- `ThemeContext`: site is light-only — remove the dark branch and the `useEffect` that mutates `<html>` classes; keep the hook's API returning `"light"` so `ImageConfigContext` still compiles. Put `className="light"` statically on `<html>` if any CSS relies on it.
- `ImageConfigContext`: first render must use the static defaults; a later CMS URL must not re-key or hard-swap an already-painted image.
- Commit: `perf: remove global transitions, fix font loading, static theme`.

## Step 3 — Header

Rebuild `Navbar.tsx` per PRD §6.1:
- `variant: "transparent" | "solid"` prop (default `"solid"`). Fixed, `grid-cols-[1fr_auto_1fr]`: links left, centered logo, hanging circular icon buttons right (Search, Account, Wishlist, Cart pill with count).
- Transparent → solid switch driven by an `IntersectionObserver` sentinel at the end of the hero; only `background-color`/`color` transition, 200ms.
- Search opens a simple overlay (opacity only) that keeps the existing `/shop?q=` behavior. Mobile menu is a full-screen white sheet (opacity only).
- Keep `cart-updated` / `wishlist-updated` listeners and badge counts. No `animate-pulse`, no `layoutId` spring.
- Update every page that renders `<Navbar absolute={false} />` to the new API (they should get the solid variant). Account for the fixed header height with top padding on non-home pages.
- Commit: `feat: transparent header with hanging icon buttons`.

## Step 4 — Hero

Rebuild `Hero.tsx` per PRD §6.2:
- `100svh`, full-bleed `next/image` (`priority`, `fetchPriority="high"`, `sizes="100vw"`, blur placeholder). Navbar is no longer nested inside it.
- Bottom-left content: "COVENANT DROP I" eyebrow, "Armor for the modern Gibbor. Wearable scripture." headline, "ENTER THE RITUAL" CTA → `/shop`.
- Remove the scale-in, all motion delays, the blur blobs, noise overlay, empty glyph div, and bouncing scroll hint. Hero text is visible on first paint.
- CSS gradient scrims for legibility (top for the header, bottom for the copy).
- Remove `MarqueeBanner` from `MainLayout`. On `/shop` and `/shop/[id]`, replace it with a static, non-animated promo line (or leave the component there unchanged and note it in the PR — ask me if unsure).
- Commit: `feat: minimal full-bleed hero, remove homepage marquee`.

## Step 5 — Replace the sliding carousel with a native rail

- Remove `FeaturedCarouselSection` from the homepage. Build a single "Latest Drop" rail (merge `ProductLineup` into it) per PRD §6.3: CSS scroll-snap, `overscroll-behavior-x: contain`, no autoplay, desktop prev/next buttons using `scrollBy`, keyboard focusable.
- One `fetchStorefrontProducts()` call for the homepage. Fixed-size skeleton cards while loading — zero layout shift.
- If nothing else imports them, delete `FeaturedCarouselSection.tsx`, `FlexCarousel.jsx/.css/.d.ts`, the `src/app/demodesign/` page, and `npm uninstall ogl`.
- Commit: `feat: native scroll-snap product rail, drop WebGL carousel`.

## Step 6 — Brand story, pillars, statement, reviews, footer

- `About.tsx`: remove card shell, shadow and blur blobs; plain centered section with generous spacing; replace word-by-word pull-up with one section fade (opacity + 12px translate, once). **Copy unchanged.**
- `Features.tsx`: flat grid, hairline borders, no shadows/noise/blobs; one opacity entrance per card (≤60ms stagger). Video card: `preload="none"`, poster, play only while in view, poster-only under reduced motion. **Copy unchanged.**
- Add a black statement band reusing the existing line "Dark. Sacred. Spare. Speaks in fragments." (no new copy).
- Restyle `Reviews` and `Footer` (black, white text) to the minimal system without changing behavior.
- Make `src/app/page.tsx` / `MainLayout` a Server Component; keep client components to the interactive leaves.
- Delete now-unused helpers (`WordsPullUp*`, `AnimatedWord`, `.edge-fade-mask`, marquee keyframes, noise classes) only after grepping for usages.
- Commit: `style: minimal brand story, pillars and footer`.

## Step 7 — Verify

- `npm run lint` and `npm run build` pass.
- `npm run start`; check `/` at 1440px and 375px: header transparent over hero, solid after; icons readable; rail scrolls natively and never blocks vertical scroll; nothing shifts while products load; reduced-motion shows a static page.
- DevTools Performance: record a full scroll of `/` — no long frames on desktop, nothing > 50ms at 4× CPU throttle.
- Lighthouse again; compare to Step 0. Targets: LCP ≤ 1.8 s mobile, CLS ≤ 0.02, TBT ≤ 150 ms, Performance ≥ 90 mobile, first-load JS for `/` ≥ 30% smaller.
- Smoke-test `/shop`, `/shop/[id]`, `/cart`, `/login`, `/checkout` still render with the new header and cart counts update.
- String-diff `About.tsx` and `Features.tsx` copy against `main`.

## Deliverable

Push the branch and open a PR titled `Minimal homepage redesign + performance pass`. In the description include: what changed per section, files deleted, the before/after metrics table, and screenshots (desktop + mobile, top of page and mid-scroll). List anything from the PRD you skipped and why. Stop and ask me before deleting `MarqueeBanner.tsx` or changing anything outside the homepage beyond the header swap.
