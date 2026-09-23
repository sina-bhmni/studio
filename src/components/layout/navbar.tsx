"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Menu, X, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const LINKS = [
  { href: "/", label: "خانه" },
  { href: "/team", label: "تیم ما" },
  { href: "/portfolio", label: "نمونه‌کارها" },
  { href: "/contact", label: "تماس" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // بستن منوی موبایل هنگام تغییر مسیر — بدون افکت، مستقیم در حین رندر
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="fixed inset-x-0 top-0 z-50 print:hidden">
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 transition-all duration-500 sm:px-8 ${
          scrolled ? "py-3" : "py-5"
        }`}
      >
        {/* لوگو */}
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground transition-transform duration-500 group-hover:rotate-[10deg]">
            <Sparkles className="h-5 w-5" strokeWidth={1.8} />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-lg font-extrabold tracking-tight">استودیو نوا</span>
            <span className="text-[10px] font-medium tracking-[0.35em] text-muted">
              NOVA STUDIO
            </span>
          </span>
        </Link>

        {/* لینک‌های دسکتاپ */}
        <nav
          className={`hidden items-center gap-1 rounded-full border px-2 py-1.5 backdrop-blur-xl transition-colors duration-500 md:flex ${
            scrolled
              ? "border-border bg-card/80"
              : "border-transparent bg-transparent"
          }`}
        >
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              data-active={isActive(link.href)}
              className={`link-underline rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-300 ${
                isActive(link.href) ? "text-accent" : "text-foreground/80 hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <Link
            href="/contact"
            className="group hidden items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-bold text-background transition-all duration-300 hover:bg-accent hover:text-accent-foreground sm:flex"
          >
            شروع پروژه
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
          </Link>
          {/* منوی موبایل */}
          <button
            type="button"
            aria-label="منو"
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* پنل موبایل */}
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="mx-4 rounded-2xl border border-border bg-card/95 p-3 shadow-2xl backdrop-blur-xl md:hidden"
          >
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block rounded-xl px-4 py-3 text-base font-semibold transition-colors ${
                  isActive(link.href)
                    ? "bg-accent-soft text-accent"
                    : "text-foreground/80 hover:bg-ring"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-base font-bold text-accent-foreground"
            >
              شروع پروژه
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
