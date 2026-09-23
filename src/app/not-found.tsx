import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { toFa } from "@/lib/format";

export default function NotFound() {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-5 text-center">
      {/* تایپوگرافی غول‌پیکر */}
      <h1
        className="text-outline select-none text-[38vw] font-black leading-none tracking-tighter sm:text-[280px]"
        aria-label={toFa(404)}
      >
        {toFa(404)}
      </h1>

      <div className="relative -mt-6 sm:-mt-16">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-bold text-muted">
          <Compass className="h-4 w-4 text-accent" />
          گم شده‌اید؟ اتفاقاً برای خلاقان خوب است
        </span>
        <h2 className="text-3xl font-black sm:text-4xl">
          این صفحه در نقشه‌ی ما نیست
        </h2>
        <p className="mx-auto mt-4 max-w-md leading-8 text-muted">
          آدرسی که دنبالش بودید یا جابه‌جا شده، یا اصلاً وجود نداشته. ولی خب —
          بقیه‌ی سایت پر است از کارهای باحال.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2.5 rounded-full bg-accent px-8 py-4 text-base font-bold text-accent-foreground transition-transform duration-300 hover:scale-[1.03]"
        >
          برگردیم به خانه
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}
