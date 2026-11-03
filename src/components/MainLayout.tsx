import Navbar from "./Navbar";
import Hero from "./Hero";
import LatestDrop from "./LatestDrop";
import About from "./About";
import Features from "./Features";
import StatementBand from "./StatementBand";
import ProductRow from "./ProductRow";
import Reviews from "./Reviews";
import Footer from "./Footer";
import { Product } from "../data/products";

// Server Component. Interactive pieces (header, product rail, reviews slider,
// reveal-on-scroll, pillar video, CMS images) are client leaves inside it.
export default function MainLayout({ products }: { products: Product[] | null }) {
  return (
    <div className="min-h-screen bg-white text-text-page selection:bg-primary selection:text-white">
      <Navbar variant="transparent" />

      <main>
        <Hero />
        <LatestDrop initialProducts={products} />
        <About />
        <Features />
        <StatementBand />
        <ProductRow initialProducts={products} />
        <Reviews />
      </main>

      <Footer />
    </div>
  );
}
