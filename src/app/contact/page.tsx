import type { Metadata } from "next";
import { Mail, MapPin, Clock, MessageCircleQuestion, ShieldCheck } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { Faq } from "@/components/faq";
import { Reveal, WordReveal } from "@/components/reveal";
import { SocialIcon } from "@/components/icons/social";

export const metadata: Metadata = {
  title: "تماس و درخواست پروژه",
  description:
    "با استودیو نوا در تماس باشید — فرم درخواست پروژه، ایمیل و پاسخ به سوالات پرتکرار.",
};

const INFO = [
  { icon: Mail, title: "ایمیل", value: "hello@nova.studio", ltr: true },
  { icon: MapPin, title: "دفتر مرکزی", value: "تهران، خیابان ولیعصر، کوچه‌ی هنر، پلاک ۱۲", ltr: false },
  { icon: Clock, title: "ساعات پاسخ‌گویی", value: "شنبه تا چهارشنبه — ۹ تا ۱۸", ltr: false },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 pt-36 pb-24 sm:px-8 sm:pt-44">
      {/* هدر */}
      <div className="mb-14 max-w-3xl">
        <Reveal>
          <span className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-border bg-card px-4 py-2 text-xs font-bold text-muted">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
            </span>
            میانگین زمان پاسخ: کمتر از ۲۴ ساعت
          </span>
        </Reveal>
        <h1 className="text-5xl font-black leading-[1.2] tracking-tight sm:text-6xl">
          <WordReveal text="بیایید درباره‌ی پروژه‌تان حرف بزنیم" />
        </h1>
        <Reveal delay={0.2}>
          <p className="mt-6 text-lg leading-9 text-muted">
            فرم زیر را پر کنید؛ درخواست شما مستقیم داخل سیستم مدیریت ما ثبت
            می‌شود و سریع‌ترین مسیر برای شروع همکاری است.
          </p>
        </Reveal>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        {/* فرم */}
        <Reveal delay={0.1}>
          <ContactForm />
        </Reveal>

        {/* اطلاعات تماس */}
        <div className="flex flex-col gap-5">
          {INFO.map((item, i) => (
            <Reveal key={item.title} delay={0.15 + i * 0.08}>
              <div className="card-hover flex items-start gap-4 rounded-2xl border border-border bg-card p-6">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
                  <item.icon className="h-5.5 w-5.5" strokeWidth={1.6} />
                </span>
                <div>
                  <h2 className="font-extrabold">{item.title}</h2>
                  <p
                    className="mt-1.5 text-sm leading-7 text-muted"
                    dir={item.ltr ? "ltr" : undefined}
                    style={item.ltr ? { textAlign: "right" } : undefined}
                  >
                    {item.value}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}

          {/* شبکه‌های اجتماعی */}
          <Reveal delay={0.4}>
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="mb-4 font-extrabold">ما را دنبال کنید</h2>
              <div className="flex gap-2.5">
                {["instagram", "linkedin", "github", "dribbble"].map((p) => (
                  <a
                    key={p}
                    href="#"
                    aria-label={p}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-muted transition-all duration-300 hover:border-accent hover:text-accent"
                  >
                    <SocialIcon platform={p} className="h-4.5 w-4.5" />
                  </a>
                ))}
              </div>
            </div>
          </Reveal>

          {/* نشان امنیت */}
          <Reveal delay={0.45}>
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-accent-soft/50 p-5 text-sm leading-7">
              <ShieldCheck className="h-6 w-6 shrink-0 text-accent" />
              <p className="text-foreground/80">
                این فرم با محدودیت نرخ (Rate Limit) و تله‌ی ضدربات محافظت
                می‌شود؛ اطلاعات شما فقط در دیتابیس خودمان ذخیره می‌شود.
              </p>
            </div>
          </Reveal>
        </div>
      </div>

      {/* سوالات متداول */}
      <section className="mt-24">
        <div className="mb-10 flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent">
            <MessageCircleQuestion className="h-6 w-6" strokeWidth={1.6} />
          </span>
          <h2 className="text-3xl font-black">سوالات پرتکرار</h2>
        </div>
        <Reveal>
          <Faq />
        </Reveal>
      </section>
    </div>
  );
}
