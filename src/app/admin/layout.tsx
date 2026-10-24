import type { Metadata } from "next";

// The admin portal is private: never indexed, never cached, never linked
// from the public site. Only people you send the link to will find it, and
// they still need an admin login to see anything.
export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen flex-1 bg-cream-dim">{children}</div>;
}
