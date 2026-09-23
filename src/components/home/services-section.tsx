import {
  PenTool,
  Code2,
  Fingerprint,
  TrendingUp,
  Feather,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { toFa } from "@/lib/format";
import type { Service } from "@/db/schema";

const ICONS: Record<string, LucideIcon> = {
  "pen-tool": PenTool,
  "code-2": Code2,
  fingerprint: Fingerprint,
  "trending-up": TrendingUp,
  feather: Feather,
  "shield-check": ShieldCheck,
};

export function ServicesSection({ services }: { services: Service[] }) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <SectionHeading
        index="۰۱"
        eyebrow="خدمات ما"
        title="هر چه برند شما نیاز دارد، زیر یک سقف"
        description="از اولین جرقه‌ی ایده تا لانچ نهایی و پشتیبانی — مسیر کامل ساخت تجربه‌ی دیجیتال با دستِ خودمان."
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, i) => {
          const Icon = ICONS[service.icon] ?? Sparkles;
          return (
            <Reveal key={service.id} delay={(i % 3) * 0.1}>
              <article className="grain-card card-hover group relative h-full overflow-hidden rounded-3xl border border-border bg-card p-7">
                <div className="mb-14 flex items-start justify-between">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-surface text-accent transition-all duration-500 group-hover:scale-110 group-hover:border-accent/50 group-hover:bg-accent group-hover:text-accent-foreground">
                    <Icon className="h-6 w-6" strokeWidth={1.6} />
                  </span>
                  <span className="tabular-fa text-5xl font-black text-foreground/[0.07] transition-colors duration-500 group-hover:text-accent/20">
                    {toFa(String(i + 1).padStart(2, "0"))}
                  </span>
                </div>
                <h3 className="mb-3 text-xl font-extrabold">{service.title}</h3>
                <p className="text-sm leading-7 text-muted">{service.description}</p>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
