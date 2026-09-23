/**
 * Rate Limiter ساده‌ی In-Memory (معادل django-ratelimit)
 * محدود کردن تعداد درخواست از یک IP در بازه‌ی زمانی مشخص.
 * مناسب محیط تک‌نود؛ برای پروداکشن چندنودی از Redis استفاده کنید.
 */

type Bucket = { count: number; resetAt: number };

const globalStore = globalThis as typeof globalThis & {
  __novaRateLimit?: Map<string, Bucket>;
};

const store = globalStore.__novaRateLimit ?? new Map<string, Bucket>();
globalStore.__novaRateLimit = store;

export function rateLimit(options: {
  key: string;
  limit: number;
  windowMs: number;
}): { success: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const bucket = store.get(options.key);

  if (!bucket || bucket.resetAt < now) {
    store.set(options.key, { count: 1, resetAt: now + options.windowMs });
    return { success: true, retryAfterSeconds: 0 };
  }

  if (bucket.count >= options.limit) {
    return {
      success: false,
      retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000),
    };
  }

  bucket.count += 1;
  return { success: true, retryAfterSeconds: 0 };
}

// پاک‌سازی دوره‌ای باکت‌های منقضی
if (typeof setInterval !== "undefined") {
  const timer = setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of store.entries()) {
      if (bucket.resetAt < now) store.delete(key);
    }
  }, 60_000);
  if (typeof timer.unref === "function") timer.unref();
}
