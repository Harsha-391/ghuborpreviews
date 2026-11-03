import { pageMetadata } from "../../utils/seo";

// The page itself is a client component, so its metadata lives here.
export const metadata = pageMetadata({
  title: "Your Account",
  description: "Your Ghubor account, orders and saved details.",
  path: "/profile",
  noindex: true,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
