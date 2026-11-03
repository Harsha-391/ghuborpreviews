import { pageMetadata } from "../../utils/seo";

// The page itself is a client component, so its metadata lives here.
export const metadata = pageMetadata({
  title: "Shipping Policy",
  description: "Ghubor ships pan-India and internationally from Jaipur. Orders are processed in 3–5 business days; see delivery timelines by region.",
  path: "/shipping-policy",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
