"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";

const PROJECT_TYPES = [
  "طراحی وب‌سایت",
  "توسعه وب‌اپلیکیشن",
  "برندینگ و هویت بصری",
  "طراحی UI/UX",
  "سئو و بازاریابی دیجیتال",
  "مشاوره‌ی امنیت و زیرساخت",
  "چیز دیگری در ذهنم است",
];

const BUDGETS = [
  "زیر ۵۰ میلیون تومان",
  "۵۰ تا ۱۰۰ میلیون تومان",
  "۱۰۰ تا ۳۰۰ میلیون تومان",
  "بیش از ۳۰۰ میلیون تومان",
  "هنوز نمی‌دانم",
];

type Status = "idle" | "loading" | "success" | "error";

const inputClass =
  "w-full rounded-xl border border-border bg-surface px-4.5 py-3.5 text-sm outline-none transition-all duration-300 placeholder:text-muted/70 focus:border-accent focus:bg-card focus:ring-2 focus:ring-accent/20";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [feedback, setFeedback] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    setStatus("loading");
    setFeedback("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone"),
          projectType: data.get("projectType"),
          budget: data.get("budget"),
          message: data.get("message"),
          website: data.get("website"), // honeypot
        }),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };

      if (res.ok && json.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
        setFeedback(json.error ?? "خطایی رخ داد. دوباره تلاش کنید.");
      }
    } catch {
      setStatus("error");
      setFeedback("ارتباط با سرور برقرار نشد. اتصال اینترنت را بررسی کنید.");
    }
  }

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex min-h-[420px] flex-col items-center justify-center gap-5 rounded-3xl border border-emerald-500/30 bg-emerald-500/5 p-10 text-center"
          >
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500">
              <CheckCircle2 className="h-10 w-10" strokeWidth={1.5} />
            </span>
            <h3 className="text-2xl font-black">درخواست شما ثبت شد!</h3>
            <p className="max-w-sm leading-8 text-muted">
              ممنون که به ما اعتماد کردید. تیم نوا در کمتر از یک روز کاری با شما
              تماس می‌گیرد.
            </p>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="mt-2 rounded-full border border-border px-6 py-3 text-sm font-bold transition-colors hover:border-accent hover:text-accent"
            >
              ثبت درخواست جدید
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            onSubmit={handleSubmit}
            className="flex flex-col gap-5 rounded-3xl border border-border bg-card p-7 sm:p-9"
            noValidate
          >
            {/* فیلد هانی‌پات — نامرئی برای انسان، طعمه برای ربات */}
            <div className="absolute -left-[9999px] opacity-0" aria-hidden>
              <label>
                وب‌سایت
                <input type="text" name="website" tabIndex={-1} autoComplete="off" />
              </label>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-sm font-bold">
                  نام و نام خانوادگی <span className="text-accent">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  minLength={2}
                  maxLength={140}
                  placeholder="مثلاً سینا محمدی"
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-bold">
                  ایمیل <span className="text-accent">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className={`${inputClass} font-sans`}
                  dir="ltr"
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="phone" className="text-sm font-bold">
                  شماره تماس <span className="text-xs font-medium text-muted">(اختیاری)</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  maxLength={40}
                  placeholder="۰۹۱۲ ـــ ـــ ـــ"
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="projectType" className="text-sm font-bold">
                  نوع پروژه
                </label>
                <select id="projectType" name="projectType" className={inputClass} defaultValue="">
                  <option value="" disabled>
                    انتخاب کنید…
                  </option>
                  {PROJECT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="budget" className="text-sm font-bold">
                بودجه‌ی تقریبی
              </label>
              <select id="budget" name="budget" className={inputClass} defaultValue="">
                <option value="" disabled>
                  انتخاب کنید…
                </option>
                {BUDGETS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="text-sm font-bold">
                درباره‌ی پروژه‌تان <span className="text-accent">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                required
                minLength={10}
                maxLength={2000}
                rows={5}
                placeholder="هدف، مخاطب و هر چیزی که فکر می‌کنید باید بدانیم…"
                className={`${inputClass} resize-y leading-7`}
              />
            </div>

            {status === "error" && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-500"
                role="alert"
              >
                <AlertTriangle className="h-4.5 w-4.5 shrink-0" />
                {feedback}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="group mt-1 flex items-center justify-center gap-2.5 rounded-xl bg-accent px-8 py-4 text-base font-bold text-accent-foreground transition-all duration-300 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  در حال ارسال…
                </>
              ) : (
                <>
                  ارسال درخواست
                  <Send className="h-4.5 w-4.5 transition-transform duration-300 group-hover:-translate-x-1 group-hover:-translate-y-0.5" />
                </>
              )}
            </button>

            <p className="text-center text-xs text-muted">
              ارسال این فرم یعنی با تماس تیم ما برای شروع گفت‌وگو موافقید؛
              اطلاعات شما نزد ما محفوظ می‌ماند.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
