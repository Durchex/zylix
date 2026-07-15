"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Rating } from "@/components/ui/Rating";
import { PriceTag } from "@/components/ui/PriceTag";
import { useWishlistStore } from "@/store/wishlist.store";
import { useCompareStore } from "@/store/compare.store";
import { cn } from "@/lib/utils";
import type { ProductSummary } from "@/types/product";

export function ProductCard({ product }: { product: ProductSummary }) {
  const inWishlist = useWishlistStore((s) => s.has(product.id));
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const inCompare = useCompareStore((s) => s.has(product.id));
  const toggleCompare = useCompareStore((s) => s.toggle);
  const compareFull = useCompareStore((s) => s.isFull());

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-shadow hover:shadow-elevated">
      <button
        type="button"
        onClick={() => toggleWishlist(product.id)}
        aria-pressed={inWishlist}
        aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-ink-900 shadow-soft hover:bg-white"
      >
        <svg
          viewBox="0 0 20 20"
          className={cn("h-4 w-4", inWishlist ? "fill-brand-500 text-brand-500" : "fill-none text-neutral-500")}
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M10 17s-6.5-4-6.5-8.5a3.8 3.8 0 016.5-2.6A3.8 3.8 0 0116.5 8.5C16.5 13 10 17 10 17z" />
        </svg>
      </button>

      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square bg-neutral-50">
          {product.primaryImage ? (
            <Image
              src={product.primaryImage.url}
              alt={product.primaryImage.altText ?? product.name}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              className="object-contain p-6"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-neutral-400">
              No image
            </div>
          )}
          {product.isFeatured && (
            <Badge variant="brand" className="absolute left-3 top-3">
              Featured
            </Badge>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
          {product.brand}
        </p>
        <Link href={`/products/${product.slug}`}>
          <h3 className="line-clamp-2 text-sm font-medium text-ink-900 hover:text-brand-600">
            {product.name}
          </h3>
        </Link>
        <Rating value={Number(product.avgRating)} count={product.reviewCount} className="mt-0.5" />
        <PriceTag
          amount={Number(product.basePrice)}
          compareAtAmount={product.compareAtPrice ? Number(product.compareAtPrice) : null}
          currency={product.currency}
          className="mt-1"
        />

        <button
          type="button"
          onClick={() => toggleCompare(product.id)}
          disabled={!inCompare && compareFull}
          className={cn(
            "mt-2 self-start text-xs font-medium underline-offset-2 hover:underline disabled:cursor-not-allowed disabled:text-neutral-300 disabled:no-underline",
            inCompare ? "text-brand-600" : "text-neutral-500",
          )}
        >
          {inCompare ? "Remove from compare" : "Add to compare"}
        </button>
      </div>
    </div>
  );
}
