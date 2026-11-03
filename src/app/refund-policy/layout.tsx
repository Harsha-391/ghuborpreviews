import { pageMetadata } from "../../utils/seo";

// The page itself is a client component, so its metadata lives here.
export const metadata = pageMetadata({
  title: "Refund Policy",
  description: "Ghubor refunds: request within 7 days of delivery; approved refunds are processed within 7–10 business days to the original payment method.",
  path: "/refund-policy",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
