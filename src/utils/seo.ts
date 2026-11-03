// Single source of facts for metadata, structured data and llms.txt.
// Every fact here is stated visibly on the site (footer, policy pages, brand
// story). Do not add claims the site does not make: structured data that
// describes invisible or untrue things is penalised by search engines.
import { Product } from "../data/products";
import { priceNumber } from "./serverProducts";

export const SITE_URL = "https://www.ghubor.com";
export const SITE_NAME = "Ghubor";
export const SITE_TAGLINE = "Armor for the modern Gibbor. Wearable scripture.";
export const SITE_DESCRIPTION =
  "Armor for the modern Gibbor. Wearable scripture. Fighting battles nobody sees. Forged in the dark, speaking in fragments, bound to become skin.";
export const BRAND_STORY =
  "Derived from the Hebrew Gibbor, a mighty warrior, hero, Ghubor makes wearable scripture for people fighting battles nobody sees.";

export const BUSINESS = {
  legalName: "Unite Fashion",
  email: "support@ghubor.com",
  instagram: "https://instagram.com/ghubor.clothing",
  locality: "Jaipur",
  region: "Rajasthan",
  country: "IN",
  supportHours: "Mon–Sat, 10am–6pm IST",
  replyTime: "within 24–48 hours",
  processing: "3–5 business days",
  delivery: "Pan-India and international, tracked",
  returnWindowDays: 7,
  runSize: "64 hand-numbered pieces per silhouette",
} as const;

export const absoluteUrl = (path: string) => (path.startsWith("http") ? path : `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`);

/** "VIGILANTE SCRIP TEE" -> "Vigilante Scrip Tee" for titles. */
export const titleCase = (s: string) =>
  s.toLowerCase().replace(/(^|[\s(\-/])([a-z])/g, (_m, sep: string, c: string) => sep + c.toUpperCase());

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    legalName: BUSINESS.legalName,
    url: SITE_URL,
    logo: absoluteUrl("/logo-black.png"),
    description: SITE_DESCRIPTION,
    slogan: SITE_TAGLINE,
    email: BUSINESS.email,
    sameAs: [BUSINESS.instagram],
    address: {
      "@type": "PostalAddress",
      addressLocality: BUSINESS.locality,
      addressRegion: BUSINESS.region,
      addressCountry: BUSINESS.country,
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: BUSINESS.email,
      availableLanguage: "English",
      hoursAvailable: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "10:00",
        closes: "18:00",
      },
    },
    hasMerchantReturnPolicy: returnPolicyJsonLd(),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    publisher: { "@id": `${SITE_URL}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/shop?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

function returnPolicyJsonLd() {
  return {
    "@type": "MerchantReturnPolicy",
    applicableCountry: BUSINESS.country,
    returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
    merchantReturnDays: BUSINESS.returnWindowDays,
    merchantReturnLink: absoluteUrl("/return-policy"),
  };
}

/** Product images in display order, absolute URLs, de-duplicated. */
export function productImages(p: Product): string[] {
  const gallery = p.imagesLight?.length ? p.imagesLight : p.imagesDark;
  const urls = gallery?.length
    ? gallery.map((g) => g.url)
    : [p.image, p.backImage, ...(p.galleryLight?.length ? p.galleryLight : p.galleryDark || [])];
  return Array.from(new Set(urls.filter((u): u is string => !!u))).map(absoluteUrl);
}

export function productDescription(p: Product): string {
  const text = (p.description || p.fullDescription || "").replace(/\s+/g, " ").trim();
  return text || `${titleCase(p.title)} by ${SITE_NAME}. ${SITE_TAGLINE}`;
}

export function productJsonLd(p: Product) {
  const price = priceNumber(p.price);
  const url = absoluteUrl(`/shop/${p.id}`);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name: titleCase(p.title),
    description: productDescription(p),
    image: productImages(p),
    sku: p.id,
    url,
    ...(p.category ? { category: p.category } : {}),
    brand: { "@type": "Brand", name: SITE_NAME },
    ...(price
      ? {
          offers: {
            "@type": "Offer",
            url,
            price,
            priceCurrency: "INR",
            itemCondition: "https://schema.org/NewCondition",
            seller: { "@id": `${SITE_URL}/#organization` },
            hasMerchantReturnPolicy: returnPolicyJsonLd(),
          },
        }
      : {}),
  };
}

/** Per-page metadata: unique title, description, canonical URL and social cards. */
export function pageMetadata({
  title,
  description,
  path,
  image,
  noindex = false,
}: {
  title?: string;
  description: string;
  path: string;
  image?: { url: string; alt: string; width?: number; height?: number };
  noindex?: boolean;
}): import("next").Metadata {
  // A page's openGraph/twitter objects replace the root layout's rather than
  // merging with them, so every page states the full set here.
  const shareImage = image ?? DEFAULT_SHARE_IMAGE;
  const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "en_IN",
      url: path,
      title: fullTitle,
      description,
      images: [shareImage],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [shareImage.url] },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

export const DEFAULT_TITLE = "Ghubor | Armor for the Modern Gibbor";
export const DEFAULT_SHARE_IMAGE = { url: "/images/hero-light.webp", width: 1024, height: 1024, alt: "Ghubor Covenant Drop I" };
