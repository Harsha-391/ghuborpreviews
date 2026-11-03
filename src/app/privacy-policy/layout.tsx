import { pageMetadata } from "../../utils/seo";

// The page itself is a client component, so its metadata lives here.
export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How Ghubor collects, uses and protects your personal information when you shop at ghubor.com.",
  path: "/privacy-policy",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
