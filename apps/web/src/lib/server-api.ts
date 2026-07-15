import "server-only";

const API_URL = process.env.API_URL ?? "http://localhost:4000";

interface ServerFetchOptions {
  revalidate?: number | false;
  tags?: string[];
}

/**
 * Server Component / Route Handler fetch helper — talks to the API directly
 * (not through the browser rewrite proxy, since there's no browser here) for
 * public, unauthenticated catalog data so listing/detail pages can be
 * server-rendered for SEO and Core Web Vitals.
 */
export async function serverApiRequest<T>(
  path: string,
  options: ServerFetchOptions = {},
): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}/api/v1${path}`, {
      next: { revalidate: options.revalidate ?? 60, tags: options.tags },
    });

    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}
