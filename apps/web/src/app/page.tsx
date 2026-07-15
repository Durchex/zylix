import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ProductGrid, ProductGridEmpty } from "@/components/storefront/ProductGrid";
import { serverApiRequest } from "@/lib/server-api";
import type { PaginatedResult, ProductSummary } from "@/types/product";

const FEATURED_CATEGORIES = [
  { name: "Smartphones", slug: "smartphones" },
  { name: "Laptops", slug: "laptops" },
  { name: "Gaming", slug: "gaming" },
  { name: "Smartwatches", slug: "smartwatches" },
  { name: "Accessories", slug: "accessories" },
  { name: "Home Electronics", slug: "home-electronics" },
];

async function ProductSection({
  title,
  href,
  query,
}: {
  title: string;
  href: string;
  query: string;
}) {
  const result = await serverApiRequest<PaginatedResult<ProductSummary>>(
    `/products${query}`,
    { tags: ["products"] },
  );
  const products = result?.items ?? [];

  return (
    <section className="py-12">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight text-ink-900">{title}</h2>
        <Link href={href} className="text-sm font-medium text-brand-600 hover:underline">
          View all
        </Link>
      </div>
      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <ProductGridEmpty message="Catalog coming soon — check back shortly." />
      )}
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <section className="bg-ink-900 text-white">
        <Container className="flex flex-col items-start gap-6 py-20 sm:py-28">
          <p className="text-sm uppercase tracking-[0.3em] text-brand-400">Zylix</p>
          <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-6xl">
            Technology Made Simple.
          </h1>
          <p className="max-w-xl text-neutral-300">
            Premium smartphones, laptops, gaming gear, and home electronics — curated,
            authenticated, and delivered across Nigeria.
          </p>
          <Link href="/shop">
            <Button size="lg">Shop the collection</Button>
          </Link>
        </Container>
      </section>

      <Container>
        <section className="py-12">
          <h2 className="mb-6 text-2xl font-semibold tracking-tight text-ink-900">
            Shop by category
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {FEATURED_CATEGORIES.map((category) => (
              <Link
                key={category.slug}
                href={`/shop/${category.slug}`}
                className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white p-6 text-center text-sm font-medium text-ink-900 hover:border-brand-300 hover:shadow-soft"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </section>

        <ProductSection title="Featured products" href="/shop?featured=true" query="?featured=true&pageSize=8" />
        <ProductSection title="New arrivals" href="/new-arrivals" query="?sort=newest&pageSize=8" />
      </Container>
    </>
  );
}
