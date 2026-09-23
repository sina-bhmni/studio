"use client";

import { FileDown } from "lucide-react";

/**
 * دانلود رزومه به PDF از طریق دیالوگ چاپ مرورگر —
 * جایگزین سبک و بدون وابستگی برای WeasyPrint/xhtml2pdf؛
 * قالب چاپ با استایل‌های @media print بهینه شده است.
 */
export function PrintResumeButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-bold transition-all duration-300 hover:border-accent hover:text-accent"
    >
      <FileDown className="h-4.5 w-4.5" />
      دانلود رزومه (PDF)
    </button>
  );
}
