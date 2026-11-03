import MainLayout from "../components/MainLayout";
import JsonLd from "../components/JsonLd";
import { getStorefrontProducts, toCardProduct } from "../utils/serverProducts";
import { organizationJsonLd, pageMetadata, SITE_DESCRIPTION, websiteJsonLd } from "../utils/seo";

// Static page, regenerated at most every 5 minutes, so product cards are in
// the HTML on the first response instead of waiting for Firebase in the browser.
export const revalidate = 300;

export const metadata = pageMetadata({ description: SITE_DESCRIPTION, path: "/" });

export default async function Home() {
  const products = await getStorefrontProducts();
  return (
    <>
      <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
      <MainLayout products={products ? products.map(toCardProduct) : null} />
    </>
  );
}
