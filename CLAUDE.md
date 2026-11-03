# CLAUDE.md — Ghubor storefront

Ghubor is a faith-inspired apparel brand ("Armor for the modern Gibbor. Wearable scripture."). This repo is the storefront: Next.js 15 App Router, React 19, TypeScript, Tailwind CSS v4, framer-motion, Firebase (Auth, Firestore, Storage), Razorpay and DHL API routes.

Active work: **minimal homepage redesign + performance pass**. Spec: [docs/redesign/PRD.md](docs/redesign/PRD.md). Execution prompt: [docs/redesign/CLAUDE_CODE_PROMPT.md](docs/redesign/CLAUDE_CODE_PROMPT.md).

## Commands

```bash
npm install
npm run dev        # dev server, http://localhost:3000
npm run build      # production build — run before every PR
npm run start      # serve the production build (used by .claude/launch.json "ghubor-prod")
npm run lint
```

Measure performance only against `npm run build && npm run start`, never `next dev`.

Clean caches when behavior looks stale: delete `.next/`, `node_modules/.cache/`, `tsconfig.tsbuildinfo`, then rebuild.

## Layout

- `src/app/` — routes. `page.tsx` (home) renders `components/MainLayout.tsx`. Other routes: `shop`, `shop/[id]`, `cart`, `checkout`, `payment`, `login`, `profile`, `wishlist`, `about`, `admin`, policy pages, `api/{dhl,razorpay}`.
- `src/components/` — homepage sections (`Hero`, `About` = brand story, `Features` = brand pillars, `ProductLineup`, `Reviews`, `Footer`), shared `Navbar`, contexts (`AuthContext`, `ThemeContext`, `ImageConfigContext`).
- `src/utils/` — `cms.ts` (Firestore reads: `fetchStorefrontProducts`, `fetchActiveCoupons`), `store.ts` (cart/wishlist in localStorage), `firebase.ts`, `analytics.ts`.
- `src/app/globals.css` — design tokens (`:root` + Tailwind `@theme`), local fonts.
- `public/images/` — hero, pillar and detail images (`.webp`, served with `immutable` cache headers).

## Brand rules (non-negotiable)

- Palette: white `#FFFFFF`, black `#0A0A0A`/`#000`, deep red `--color-primary: #5C0606`. Light only — **no dark mode**.
- Type: Almarai (sans, body), Instrument Serif italic (`font-serif`, accents/headlines). Local display fonts `EnglishTowne`, `ITGravenorth` only for rare accents.
- Voice: sparse, sacred, fragmentary. Never invent new marketing copy; reuse existing strings.
- **Brand story (`About.tsx`) and brand pillars (`Features.tsx`) copy is locked.** Restyle freely, but do not edit, shorten or reorder the words. See PRD §4 for the exact strings.
- Minimal look: lots of white space, hairline borders, no drop shadows, no blur blobs, no noise textures.

## Performance rules

- Animate only `transform` and `opacity`. Never animate `filter`, `box-shadow`, size, or position properties.
- No global `transition` rules on element selectors. Add transitions per component.
- No `filter: blur()` decorative layers, no `feTurbulence` noise overlays.
- No scroll event listeners for UI state — use `IntersectionObserver`.
- No WebGL for decoration. Horizontal rails and slideshows are native scroll containers (CSS `scroll-snap` where it fits), never a JS-translated track.
- Autoplay is allowed only on those native scrollers (product card photos, the homepage Netflix row), and only while on screen; it pauses on hover, focus, touch and drag, and is off under `prefers-reduced-motion`. Mouse drag goes through `useDragScroll`; touch uses native scrolling.
- Never intercept wheel/touch scroll on the page.
- Hero image is the LCP: `next/image` with `priority`, `sizes="100vw"`, and no entrance animation that delays it.
- Every image below the fold has explicit `sizes` and a fixed aspect-ratio box (zero CLS). Show skeletons of the final size while Firestore data loads.
- Respect `prefers-reduced-motion`.
- `will-change` only while an element is actively animating.
- Prefer Server Components; keep `"use client"` to the smallest interactive leaf.
- Firebase loads lazily. Public pages (and anything in the root layout, Navbar, product cards) must not statically import `firebase/*`, `utils/firebase`, `utils/cms` or `utils/analytics`; use `loadFirebase()` from `utils/loadFirebase` or a dynamic `import()`. Checkout/admin may keep static imports.
- Product listings and product pages are server-rendered from `utils/serverProducts` (Firestore REST, 5-minute cache) so products are in the HTML; client components take them as `initialProducts` and refresh quietly when idle.
- Images: AVIF then WebP at quality 75 (`next.config.ts`). Only quality 75 is allowed; add a value to `images.qualities` before using another.
- When replacing a file in `public/images/`, give it a new name — those paths are cached `immutable` for a year.

## Conventions

- TypeScript + function components; Tailwind utility classes; tokens via `bg-bg-page`, `text-text-page`, `text-primary`, `border-border-theme`.
- Icons: `lucide-react`, 18px, `strokeWidth={1.5}`.
- Cart/wishlist UI listens to `window` events `cart-updated` and `wishlist-updated`; keep emitting/listening to these.
- Admin-editable images go through `useImageConfig().getImageUrl(slotId, fallback)`; keep slot ids stable.
- Keep comments sparse and explanatory (why, not what), matching existing files.

## Do not touch without being asked

- `src/app/api/**`, `src/app/checkout/**`, `src/app/payment/**`, `src/app/admin/**`, `src/utils/firebase.ts`, `src/utils/verifyAdmin.ts`, `firestore.rules`, `storage.rules`, `firebase.json`, `.env*`.
- The Meta Pixel script in `src/app/layout.tsx`.

## SEO

- Facts used in metadata, JSON-LD and `/llms.txt` live in `src/utils/seo.ts`. Only state what the site itself says; never mark up content that is not visible or not true (no invented ratings or reviews).
- Every route has a unique title (template `%s | Ghubor`), description and canonical URL. Client pages get theirs from a sibling `layout.tsx`.
- `sitemap.ts` and `llms.txt/route.ts` are generated from the live catalogue; `public/robots.txt` allows all crawlers (including AI crawlers) and blocks private pages.

## Git

- Work on a feature branch, never commit to `main` directly.
- Commit messages: `type: short summary` (e.g. `perf: drop global transition rule`, `feat: transparent header`).
- Include before/after Lighthouse numbers and mobile + desktop screenshots in redesign PRs.
