/** توابع قالب‌بندی خالص — امن برای استفاده در کلاینت و سرور */

/** تبدیل ارقام انگلیسی به فارسی */
export function toFa(value: number | string): string {
  return String(value).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
}

export function formatDateFa(date: Date): string {
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  } catch {
    return date.toISOString();
  }
}
