import { Suspense } from "react";
import JsonLd from "../../components/JsonLd";
import { ShopView, ShopWithQuery } from "./ShopView";
import { getStorefrontProducts, priceNumber, toCardProduct } from "../../utils/serverProducts";
import { getMarqueeItems } from "../../utils/serverCoupons";
import { absoluteUrl, pageMetadata, titleCase } from "../../utils/seo";

// Static, regenerated at most every 5 minutes: the full grid is in the HTML.
export const revalidate = 300;

export async function generateMetadata() {
  const products = await getStorefrontProducts();
  const prices = (products ?? []).map((p) => priceNumber(p.price)).filter((n): n is number => n !== null);
  const from = prices.length ? ` from ₹${Math.min(...prices).toLocaleString("en-IN")}` : "";
  return pageMetadata({
    title: "Shop Graphic Tees",
    description: `Every garment is an artifact, numbered by hand. Ghubor graphic tees${from}, dispatched from Jaipur with pan-India and international delivery.`,
    path: "/shop",
  });
}

export default async function ShopPage() {
  const [products, initialMarqueeItems] = await Promise.all([getStorefrontProducts(), getMarqueeItems()]);
  const cards = products ? products.map(toCardProduct) : null;

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Sanctuary Offerings",
            itemListElement: (products ?? []).map((p, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: absoluteUrl(`/shop/${p.id}`),
              name: titleCase(p.title),
            })),
          },
        ]}
      />
      {/* The fallback is the full unfiltered grid, so it is what the HTML contains. */}
      <Suspense fallback={<ShopView initialProducts={cards} initialMarqueeItems={initialMarqueeItems} />}>
        <ShopWithQuery initialProducts={cards} initialMarqueeItems={initialMarqueeItems} />
      </Suspense>
    </>
  );
}
