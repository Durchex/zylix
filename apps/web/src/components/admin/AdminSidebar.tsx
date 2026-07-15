"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/layout/Logo";
import { cn } from "@/lib/utils";

const NAV_SECTIONS: Array<{ title: string; links: Array<{ label: string; href: string }> }> = [
  {
    title: "Overview",
    links: [{ label: "Dashboard", href: "/admin" }],
  },
  {
    title: "Catalog",
    links: [
      { label: "Products", href: "/admin/catalog/products" },
      { label: "Categories", href: "/admin/catalog/categories" },
    ],
  },
  {
    title: "Orders",
    links: [{ label: "All Orders", href: "/admin/orders" }],
  },
  {
    title: "Sellers",
    links: [
      { label: "All Sellers", href: "/admin/sellers" },
      { label: "Applications", href: "/admin/sellers/applications" },
    ],
  },
  {
    title: "People",
    links: [{ label: "Users", href: "/admin/users" }],
  },
  {
    title: "Content",
    links: [{ label: "Blog Posts", href: "/admin/cms/blog" }],
  },
  {
    title: "Security",
    links: [{ label: "Audit Log", href: "/admin/audit-log" }],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-neutral-200 bg-white lg:block">
      <div className="flex h-16 items-center border-b border-neutral-200 px-6">
        <Link href="/admin">
          <Logo />
        </Link>
        <span className="ml-2 rounded-md bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-500">
          Admin
        </span>
      </div>
      <nav className="space-y-6 p-4">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title}>
            <p className="px-2 text-xs font-semibold uppercase tracking-wide text-neutral-400">
              {section.title}
            </p>
            <ul className="mt-2 space-y-1">
              {section.links.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "block rounded-lg px-2 py-1.5 text-sm font-medium",
                        isActive
                          ? "bg-brand-50 text-brand-700"
                          : "text-neutral-700 hover:bg-neutral-50",
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
