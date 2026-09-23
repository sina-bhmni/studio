import { config as loadEnv } from "dotenv";

// دقیقاً مثل خودِ Next.js: ابتدا .env و سپس .env.local (اگر وجود داشته باشد)
// مقادیرش را override می‌کند. این فایل باید همیشه *اولین* import در فایلی
// باشد که آن را وارد می‌کند — چون import های ES module همیشه قبل از بقیه‌ی
// کد اجرا می‌شوند (حتی اگر خط import پایین‌تر نوشته شده باشد)، پس اگر این
// side-effect را مستقیم در بدنه‌ی seed.ts می‌نوشتیم، import شدن "./index"
// (که فوراً process.env.DATABASE_URL را می‌خواند) زودتر از تنظیم شدن env اجرا
// می‌شد.
loadEnv({ path: ".env" });
loadEnv({ path: ".env.local", override: true });
