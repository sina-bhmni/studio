import type { NextConfig } from "next";
import path from "node:path";

// از process.cwd() استفاده می‌کنیم (نه __dirname) چون همیشه برابر پوشه‌ای‌ست
// که دستور npm run dev از آن اجرا شده — روی بعضی سیستم‌ها (خصوصاً ویندوز)
// __dirname داخل next.config.ts می‌تواند نادرست resolve شود.
const projectRoot = path.resolve(process.cwd());
console.log("[next.config] turbopack root set to:", projectRoot);

const nextConfig: NextConfig = {
  // ریشه‌ی پروژه را صراحتاً مشخص می‌کنیم تا Turbopack با وجود lockfile‌های
  // دیگر در مسیرهای بالاتر (مثلاً pnpm-lock.yaml در ریشه‌ی درایو، یا پوشه‌های
  // برادر با package.json مستقل) گیج نشود و مسیر اشتباهی را workspace root نگیرد.
  turbopack: {
    root: projectRoot,
  },
  outputFileTracingRoot: projectRoot,
  images: {
    // تصاویر آپلودی (آواتار اعضا، تصویر بندانگشتی پروژه‌ها) روی Vercel Blob
    // ذخیره می‌شوند؛ next/image فقط از دامنه‌های صراحتاً مجازشده می‌خواند.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
