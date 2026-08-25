"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-colors duration-300",
        scrolled ? "bg-cream/90 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}
    >
      <nav className="mx-auto max-w-6xl flex items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-lg font-medium">
          <span className={scrolled ? "text-ink" : "text-cream"}>Optics Valley</span>{" "}
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
                  scrolled ? "text-ink" : "text-cream"
                )}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <Button href="#visit" size="md">
            Join a Meeting
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className={cn("md:hidden p-2 -mr-2", scrolled ? "text-ink" : "text-cream")}
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
      </nav>

      {/* Mobile menu overlay */}
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
              <Button href="#visit" size="lg" onClick={() => setMobileOpen(false)}>
                Join a Meeting
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
