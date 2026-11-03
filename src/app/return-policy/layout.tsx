import { pageMetadata } from "../../utils/seo";

// The page itself is a client component, so its metadata lives here.
export const metadata = pageMetadata({
  title: "Return Policy",
  description: "Return a Ghubor order within 7 days of delivery: how to get a Return Authorization Number, inspection, and refund or exchange timelines.",
  path: "/return-policy",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
