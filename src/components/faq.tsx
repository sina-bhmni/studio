"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

const FAQS = [
  {
    q: "یک پروژه‌ی معمولی چقدر طول می‌کشد؟",
    a: "بستگی به دامنه دارد؛ وب‌سایت‌های شرکتی معمولاً ۳ تا ۶ هفته، فروشگاه‌های اینترنتی ۶ تا ۱۰ هفته و پروژه‌های برندینگ ۴ تا ۸ هفته زمان می‌برند. در جلسه‌ی اول، تقویم دقیق با مایل‌استون‌های شفاف تحویل می‌دهید.",
  },
  {
    q: "فرآیند همکاری با شما چگونه است؟",
    a: "چهار مرحله: ۱) جلسه‌ی کشف برای فهم نیاز، ۲) پیشنهاد فنی و قرارداد، ۳) اسپرینت‌های هفتگی با دموی قابل مشاهده، ۴) لانچ و پشتیبانی. در تمام مسیر یک نفر (مریم!) پاسخ‌گوی مستقیم شماست.",
  },
  {
    q: "امنیت سایت ما چطور تضمین می‌شود؟",
    a: "سینا — متخصص امنیت شبکه‌ی ما با مدرک CCNA و CEH — قبل از هر لانچ، چک‌لیست امنیتی کامل (هاردنینگ سرور، SSL، تست آسیب‌پذیری‌های رایج OWASP و بکاپ‌گیری خودکار) را اجرا و گزارش آن را تحویل می‌دهد.",
  },
  {
    q: "بعد از تحویل پروژه، پشتیبانی هم دارید؟",
    a: "بله. همه‌ی پروژه‌ها ۳ ماه پشتیبانی رایگان دارند و بعد از آن می‌توانید قرارداد نگه‌داری ماهانه ببندید که شامل مانیتورینگ، آپدیت‌های امنیتی و تغییرات جزئی محتوا می‌شود.",
  },
  {
    q: "امکان همکاری دورکاری با شرکت‌های خارج از ایران هم هست؟",
    a: "حتماً. تجربه‌ی همکاری ریموت با تیم‌های اروپایی و حوزه‌ی خلیج فارس را داریم؛ قرارداد بین‌المللی، تسویه‌ی ارزی و جلسات منظم آنلاین بخش جدایی‌ناپذیر این همکاری است.",
  },
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-border overflow-hidden rounded-3xl border border-border bg-card">
      {FAQS.map((faq, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={i}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-right transition-colors hover:bg-ring/50 sm:px-8"
            >
              <span className="text-base font-bold">{faq.q}</span>
              <motion.span
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ duration: 0.3 }}
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors ${
                  isOpen
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-border text-muted"
                }`}
              >
                <Plus className="h-4 w-4" />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-6 text-sm leading-8 text-muted sm:px-8">
                    {faq.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
