import Link from "next/link";
import { Sparkles, ArrowUp } from "lucide-react";
import { getMembers } from "@/lib/data";
import { SocialIcon } from "@/components/icons/social";

const SOCIALS = [
  { platform: "github", label: "گیت‌هاب", href: "https://github.com" },
  { platform: "linkedin", label: "لینکدین", href: "https://linkedin.com" },
  { platform: "instagram", label: "اینستاگرام", href: "https://instagram.com" },
  { platform: "dribbble", label: "دریبل", href: "https://dribbble.com" },
];

export async function Footer() {
  const members = await getMembers();

  return (
    <footer className="relative overflow-hidden border-t border-border bg-surface print:hidden">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_auto]">
          {/* برند */}
          <div className="space-y-5">
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <Sparkles className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <span className="text-lg font-extrabold">استودیو نوا</span>
            </div>
            <p className="max-w-xs text-sm leading-7 text-muted">
              آژانس خلاقیت دیجیتال چهارنفره — ما ایده‌ها را به تجربه‌های
              دیجیتال ماندگار تبدیل می‌کنیم؛ سریع، امن و خوش‌ساخت.
            </p>
            <div className="flex gap-2">
              {SOCIALS.map(({ platform, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted transition-all duration-300 hover:border-accent hover:text-accent"
                >
                  <SocialIcon platform={platform} className="h-4.5 w-4.5" />
                </a>
              ))}
            </div>
          </div>

          {/* دسترسی سریع */}
          <div>
            <h3 className="mb-5 text-sm font-bold tracking-wide text-muted">
              دسترسی سریع
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                { href: "/team", label: "تیم ما" },
                { href: "/portfolio", label: "نمونه‌کارها" },
                { href: "/contact", label: "درخواست پروژه" },
                { href: "/admin", label: "ورود مدیران" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="link-underline text-foreground/80 hover:text-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* اعضا */}
          <div>
            <h3 className="mb-5 text-sm font-bold tracking-wide text-muted">تیم</h3>
            <ul className="space-y-3 text-sm">
              {members.map((m) => (
                <li key={m.id}>
                  <Link
                    href={`/team/${m.slug}`}
                    className="link-underline text-foreground/80 hover:text-foreground"
                  >
                    {m.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* بازگشت به بالا */}
          <div className="flex items-start justify-end">
            <a
              href="#top"
              aria-label="بازگشت به بالا"
              className="group flex h-12 w-12 items-center justify-center rounded-full border border-border transition-all duration-300 hover:border-accent hover:bg-accent-soft"
            >
              <ArrowUp className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-1" />
            </a>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-xs text-muted sm:flex-row">
          <p>© ۱۴۰۳ استودیو نوا — ساخته‌شده با وسواس و چای زیاد.</p>
          <p className="tracking-[0.3em]">NOVA® DIGITAL STUDIO</p>
        </div>
      </div>

      {/* تایپوگرافی غول‌پیکر پشت‌زمینه */}
      <div
        aria-hidden
        className="pointer-events-none select-none text-center text-[22vw] font-black leading-[0.75] tracking-tighter text-foreground/[0.035]"
      >
        NOVA
      </div>
    </footer>
  );
}
