import Link from "next/link";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

// A missing or unpublished product answers with a real 404 (good for search
// engines), using the same message the page showed before.
export default function ProductNotFound() {
  return (
    <div className="min-h-screen bg-bg-page text-text-page">
      <Navbar />
      <main className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
        <h1 className="font-serif italic text-3xl text-primary mb-4">Artifact Lost in the Dust</h1>
        <p className="text-text-muted mb-8 max-w-sm">The artifact you are seeking does not exist or has been retired from the sanctuary.</p>
        <Link href="/shop" className="text-xs tracking-widest uppercase border border-primary/20 hover:border-primary text-primary px-6 py-3 rounded-full transition-colors">
          Return to Archives
        </Link>
      </main>
      <Footer />
    </div>
  );
}
