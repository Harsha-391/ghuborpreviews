import MarqueeBannerClient from "./MarqueeBannerClient";
import { getMarqueeItems } from "../utils/serverCoupons";

/**
 * Server Component wrapper — fetches active coupons from Firestore at
 * request time so the banner's real promo text is in the first paint,
 * instead of always starting with the hardcoded "NEW DROPS EVERY WEEK"
 * default and swapping client-side after the fact. Only usable from a
 * Server Component tree; ShopView and ProductView are "use client" pages
 * that fetch the same data in their own Server Component page.tsx and
 * render MarqueeBannerClient directly instead, since a Client Component
 * can't render an async Server Component like this one.
 */
export default async function MarqueeBanner() {
  const items = await getMarqueeItems();
  return <MarqueeBannerClient initialItems={items} />;
}
