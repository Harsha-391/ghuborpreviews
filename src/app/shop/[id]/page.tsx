import { notFound } from "next/navigation";
import JsonLd from "../../../components/JsonLd";
import ProductView from "./ProductView";
import { getStorefrontProduct, getStorefrontProducts } from "../../../utils/serverProducts";
import { pageMetadata, productDescription, productImages, productJsonLd, titleCase } from "../../../utils/seo";

type Params = { params: Promise<{ id: string }> };

// Every published product is pre-built at deploy time and refreshed at most
// every 5 minutes; products added later are built on their first visit.
export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  const products = await getStorefrontProducts();
  return (products ?? []).map((p) => ({ id: p.id }));
}

const clip = (text: string, max: number) =>
  text.length <= max ? text : `${text.slice(0, text.lastIndexOf(" ", max - 1) > 0 ? text.lastIndexOf(" ", max - 1) : max - 1)}…`;

export async function generateMetadata({ params }: Params) {
  const { id } = await params;
  const product = await getStorefrontProduct(id);
  if (!product || product === "not-found") {
    return pageMetadata({ title: "Product", description: "A Ghubor garment.", path: `/shop/${id}`, noindex: product === "not-found" });
  }
  const name = titleCase(product.title);
  const price = product.mrp ? `${product.price} (MRP ${product.mrp})` : product.price;
  const image = productImages(product)[0];
  return pageMetadata({
    title: name,
    description: clip(`${name}, ${price}. ${productDescription(product)}`, 155),
    path: `/shop/${id}`,
    image: image ? { url: image, alt: name } : undefined,
  });
}

export default async function ProductPage({ params }: Params) {
  const { id } = await params;
  const product = await getStorefrontProduct(id);
  if (product === "not-found") notFound();

  return (
    <>
      {product && <JsonLd data={productJsonLd(product)} />}
      <ProductView initialProduct={product} />
    </>
  );
}
