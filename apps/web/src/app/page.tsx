import { Suspense } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ProductGrid, ProductGridEmpty, ProductGridSkeleton } from "@/components/storefront/ProductGrid";
import { FadeIn } from "@/components/motion/FadeIn";
import { serverApiRequest } from "@/lib/server-api";
import type { PaginatedResult, ProductSummary } from "@/types/product";

const CATEGORY_ICON_PATHS: Record<string, string> = {
  smartphones: "M8 3h8a1 1 0 011 1v16a1 1 0 01-1 1H8a1 1 0 01-1-1V4a1 1 0 011-1zM10.5 18h3",
  laptops: "M4 5h16v10H4zM2 17h20l-2 3H4z",
  gaming:
    "M6 8h12a3 3 0 013 3v2a3 3 0 01-3 3h-2l-1.5 2h-5L8 16H6a3 3 0 01-3-3v-2a3 3 0 013-3zM8 11v2M7 12h2M15.5 11h.01M17.5 12.5h.01",
  smartwatches: "M8 8h8v8H8zM9 4h6v4H9zM9 16h6v4H9z",
  accessories: "M6 11a6 6 0 0112 0v3M5 11h1.5v4H5zM17.5 11H19v4h-1.5z",
  "home-electronics": "M4 5h16v10H4zM10 18h4",
};

const FEATURED_CATEGORIES = [
  { name: "Smartphones", slug: "smartphones" },
  { name: "Laptops", slug: "laptops" },
  { name: "Gaming", slug: "gaming" },
  { name: "Smartwatches", slug: "smartwatches" },
  { name: "Accessories", slug: "accessories" },
  { name: "Home Electronics", slug: "home-electronics" },
];

async function ProductSectionContent({ query }: { query: string }) {
  const result = await serverApiRequest<PaginatedResult<ProductSummary>>(
    `/products${query}`,
    { tags: ["products"] },
  );
  const products = result?.items ?? [];

  return products.length > 0 ? (
    <ProductGrid products={products} />
  ) : (
    <ProductGridEmpty message="Catalog coming soon — check back shortly." />
  );
}

function ProductSection({
  title,
  href,
  query,
}: {
  title: string;
  href: string;
  query: string;
}) {
  return (
    <FadeIn>
      <section className="py-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight text-ink-900 dark:text-neutral-50">
            {title}
          </h2>
          <Link
            href={href}
            className="text-sm font-medium text-brand-600 hover:underline dark:text-accent-400"
          >
            View all
          </Link>
        </div>
        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductSectionContent query={query} />
        </Suspense>
      </section>
    </FadeIn>
  );
}

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-ink-900 text-white">
        <div className="absolute inset-0 bg-gradient-brand opacity-90" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-radial-glow" aria-hidden="true" />
        <Container className="relative flex flex-col items-start gap-6 py-20 sm:py-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-white/90 backdrop-blur animate-fade-in">
            Technology Made Simple
          </span>
          <h1 className="max-w-2xl text-4xl font-bold tracking-tight animate-fade-in-up sm:text-6xl">
            Premium tech, delivered across Nigeria.
          </h1>
          <p className="max-w-xl text-white/80 animate-fade-in-up [animation-delay:100ms]">
            Curated, authenticated smartphones, laptops, gaming gear, and home electronics —
            from a store built for the way you actually shop.
          </p>
          <div className="flex flex-wrap gap-3 animate-fade-in-up [animation-delay:200ms]">
            <Link href="/shop">
              <Button size="lg" variant="outline" className="border-white/30 bg-white text-ink-900 hover:bg-white/90">
                Shop the collection
              </Button>
            </Link>
            <Link href="/deals">
              <Button size="lg" variant="ghost" className="text-white hover:bg-white/10">
                See today&apos;s deals
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      <Container>
        <section className="py-12">
          <FadeIn>
            <h2 className="mb-6 text-2xl font-semibold tracking-tight text-ink-900 dark:text-neutral-50">
              Shop by category
            </h2>
          </FadeIn>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {FEATURED_CATEGORIES.map((category, i) => (
              <FadeIn key={category.slug} delay={i * 0.05}>
                <Link
                  href={`/shop/${category.slug}`}
                  className="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-neutral-200 bg-white p-6 text-center text-sm font-medium text-ink-900 transition-all hover:-translate-y-1 hover:border-brand-300 hover:shadow-glow dark:border-surface-800 dark:bg-surface-900 dark:text-neutral-100 dark:hover:border-accent-500/40 dark:hover:shadow-glow-dark"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 text-brand-600 transition-colors group-hover:bg-gradient-brand group-hover:text-white dark:bg-surface-800 dark:text-accent-400">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d={CATEGORY_ICON_PATHS[category.slug]} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {category.name}
                </Link>
              </FadeIn>
            ))}
          </div>
        </section>

        <ProductSection title="Featured products" href="/shop?featured=true" query="?featured=true&pageSize=8" />
        <ProductSection title="New arrivals" href="/new-arrivals" query="?sort=newest&pageSize=8" />
      </Container>
    </>
  );
}
