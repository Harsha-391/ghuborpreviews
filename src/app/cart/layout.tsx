import { pageMetadata } from "../../utils/seo";

// The page itself is a client component, so its metadata lives here.
export const metadata = pageMetadata({
  title: "Cart",
  description: "Your Ghubor cart.",
  path: "/cart",
  noindex: true,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
