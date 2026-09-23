import Link from "next/link";
import { ArrowLeft, MousePointer2 } from "lucide-react";
import { WordReveal, Reveal } from "@/components/reveal";
import { StatCounter } from "@/components/stat-counter";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-36 pb-10 sm:pt-44">
      {/* هاله‌های نور پس‌زمینه */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 right-[10%] h-[480px] w-[480px] rounded-full bg-accent-soft blur-3xl" />
        <div className="absolute bottom-0 left-[5%] h-[380px] w-[380px] rounded-full bg-accent-soft blur-3xl" />
        {/* شبکه‌ی نقطه‌ای */}
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "radial-gradient(color-mix(in srgb, var(--muted) 22%, transparent) 1px, transparent 1px)",
            backgroundSize: "34px 34px",
            maskImage:
              "radial-gradient(ellipse 70% 60% at 50% 30%, black, transparent)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        {/* بج معرفی */}
        <Reveal className="mb-8">
          <span className="inline-flex items-center gap-2.5 rounded-full border border-border bg-card/70 py-2 pr-3 pl-5 text-xs font-bold text-muted backdrop-blur">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
            </span>
            آژانس خلاقیت دیجیتال — آماده‌ی پروژه‌های جدید
          </span>
        </Reveal>

        {/* تیتر غول‌پیکر */}
        <h1 className="max-w-5xl text-[13.5vw] font-black leading-[1.15] tracking-tight sm:text-7xl lg:text-[86px]">
          <WordReveal text="ایده‌های شما،" delay={0.05} />
          <br />
          <span className="text-accent">
            <WordReveal text="تجربه‌های دیجیتال" delay={0.25} />
          </span>{" "}
          <WordReveal text="ماندگار" delay={0.5} />
        </h1>

        <div className="mt-10 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <Reveal delay={0.35} className="max-w-xl">
            <p className="text-lg leading-9 text-muted">
              ما چهار نفریم؛ یک طراح، دو توسعه‌دهنده و یک استراتژیست. در استودیو
              نوا برندها را می‌شنویم، برایشان قصه می‌سازیم و آن قصه را به
              وب‌سایتی سریع، امن و خوش‌ساخت تبدیل می‌کنیم.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/contact"
                className="group glow-accent flex items-center gap-2.5 rounded-full bg-accent px-8 py-4 text-base font-bold text-accent-foreground transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]"
              >
                شروع پروژه با ما
                <ArrowLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1.5" />
              </Link>
              <Link
                href="/team"
                className="flex items-center gap-2.5 rounded-full border border-border bg-card/60 px-8 py-4 text-base font-bold backdrop-blur transition-colors duration-300 hover:border-accent hover:text-accent"
              >
                <MousePointer2 className="h-4.5 w-4.5" />
                آشنایی با تیم
              </Link>
            </div>
          </Reveal>

          {/* آمار */}
          <Reveal delay={0.5}>
            <div className="grid grid-cols-3 gap-8 lg:gap-12">
              <StatCounter value={48} suffix="+" label="پروژه‌ی تحویل‌شده" />
              <StatCounter value={32} label="مشتری راضی" />
              <StatCounter value={97} suffix="٪" label="رضایت از همکاری" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
