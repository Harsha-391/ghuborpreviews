import { pageMetadata } from "../../utils/seo";

// The page itself is a client component, so its metadata lives here.
export const metadata = pageMetadata({
  title: "About",
  description: "Derived from the Hebrew Gibbor, a mighty warrior, hero. Ghubor makes wearable scripture: limited, hand-numbered garments from Jaipur, India.",
  path: "/about",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
