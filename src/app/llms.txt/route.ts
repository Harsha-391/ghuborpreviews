import { getStorefrontProducts } from "../../utils/serverProducts";
import { absoluteUrl, BRAND_STORY, BUSINESS, SITE_NAME, SITE_TAGLINE, titleCase } from "../../utils/seo";

// llms.txt: a plain-language summary of the business for AI assistants.
// Facts only, all of them stated on the site itself; the catalogue is live.
export const revalidate = 300; // keep in step with PRODUCTS_REVALIDATE (must be a literal)

export async function GET() {
  const products = (await getStorefrontProducts()) ?? [];
  const catalogue = products.length
    ? products
        .map((p) => `- [${titleCase(p.title)}](${absoluteUrl(`/shop/${p.id}`)}): ${p.price}${p.mrp ? ` (MRP ${p.mrp})` : ""}`)
        .join("\n")
    : `- See ${absoluteUrl("/shop")}`;

  const body = `# ${SITE_NAME}

> ${SITE_TAGLINE} ${SITE_NAME} is a faith-inspired apparel brand from ${BUSINESS.locality}, India, selling graphic T-shirts online at ${absoluteUrl("/")}.

${BRAND_STORY}

## What we sell
Graphic T-shirts released in limited drops of ${BUSINESS.runSize}. Prices are in Indian rupees (INR).

${catalogue}

## Ordering and delivery
- Processing: ${BUSINESS.processing} after payment confirmation.
- Delivery: ${BUSINESS.delivery}. Timelines by region: ${absoluteUrl("/shipping-policy")}
- Returns: within ${BUSINESS.returnWindowDays} days of delivery. Details: ${absoluteUrl("/return-policy")}
- Refunds: ${absoluteUrl("/refund-policy")}

## Contact
- Email: ${BUSINESS.email} (${BUSINESS.supportHours}; replies ${BUSINESS.replyTime})
- Instagram: ${BUSINESS.instagram}
- Registered business: ${BUSINESS.legalName}, ${BUSINESS.locality}, ${BUSINESS.region}, India

## Key pages
- Shop: ${absoluteUrl("/shop")}
- About: ${absoluteUrl("/about")}
- Privacy policy: ${absoluteUrl("/privacy-policy")}
`;

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
