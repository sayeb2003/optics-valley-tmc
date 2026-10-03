"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "About", href: "/#about" },
  { label: "Meetings", href: "/#meetings" },
  { label: "Leadership", href: "/#leadership" },
  { label: "Gallery", href: "/gallery" },
  { label: "Visit Us", href: "/#visit" },
];

// Small delay before hiding on mouse-leave, so briefly crossing the nav's
// edge (e.g. moving toward a link) doesn't cause a flicker.
const HIDE_DELAY_MS = 200;

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [scrolled, setScrolled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    return () => {
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
    };
  }, []);

  const cancelHide = () => {
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
      hideTimeout.current = null;
    }
    setHovering(true);
  };

  const scheduleHide = () => {
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    hideTimeout.current = setTimeout(() => setHovering(false), HIDE_DELAY_MS);
  };

  // Non-home pages (cream background from the top) always get the solid,
  // readable style. The homepage only goes solid after scrolling past the
  // dark hero.
  const solid = !isHome || scrolled;

  // Hidden once scrolled — unless actively hovered (reveal-on-hover) or the
  // mobile menu is open (its markup lives inside this header, so it must
  // never be translated away while open).
  const navHidden = scrolled && !hovering && !mobileOpen;

  return (
    <>
      {/* Invisible strip pinned to the very top of the viewport. Catches
          the hover that reveals the navbar again once it's been hidden —
          the header itself can't catch this once it's translated off-screen. */}
      <div
        className="fixed top-0 inset-x-0 h-4 z-40"
        onMouseEnter={cancelHide}
        aria-hidden="true"
      />

      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-300",
          navHidden ? "-translate-y-full" : "translate-y-0",
          solid ? "bg-cream/90 backdrop-blur-md shadow-sm" : "bg-transparent"
        )}
        onMouseEnter={cancelHide}
        onMouseLeave={scheduleHide}
      >
        <nav className="mx-auto max-w-6xl flex items-center justify-between px-6 py-4">
          <Link href="/" className="font-display text-lg font-medium">
            <span className={solid ? "text-ink" : "text-cream"}>Optics Valley</span>{" "}
            <span className="text-gold">TMC</span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-gold",
                    solid ? "text-ink" : "text-cream"
                  )}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden md:block">
            <Button href="/#visit" size="md">
              Join a Meeting
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            className={cn("md:hidden p-2 -mr-2", solid ? "text-ink" : "text-cream")}
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </nav>
      </header>

      {/* Mobile menu overlay — deliberately a SIBLING of <header>, not nested
          inside it. Header has a `transform` applied for the hide/show
          animation, and any CSS transform on an ancestor turns it into a
          containing block for `position: fixed` descendants — which would
          break this overlay's "cover the full screen" behavior if nested. */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-navy-deep md:hidden"
          >
            <div className="flex items-center justify-between px-6 py-4">
              <span className="font-display text-lg text-cream">Optics Valley TMC</span>
              <button
                className="p-2 -mr-2 text-cream"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>
            <ul className="flex flex-col items-center gap-8 mt-16">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="font-display text-3xl text-cream hover:text-gold transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="flex justify-center mt-12">
              <Button href="/#visit" size="lg" onClick={() => setMobileOpen(false)}>
                Join a Meeting
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
