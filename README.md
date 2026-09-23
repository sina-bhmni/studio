# استودیو نوا — راهنمای راه‌اندازی

پروژه‌ی Next.js 16 + PostgreSQL (با Drizzle ORM). پیش‌نیازها: **Node.js نسخه‌ی ۲۰ به بالا** و یک دیتابیس **PostgreSQL**.

## ۱) راه‌اندازی روی سیستم خودت (اولین بار)

### الف) نصب پکیج‌ها
```bash
npm install
```

### ب) ساخت فایل env
فایل `.env.example` را کپی کن و اسمش را بگذار `.env`:
```bash
cp .env.example .env
```
سه مقدار داخلش را با مقادیر خودت پر کن:
- `DATABASE_URL` — آدرس اتصال به PostgreSQL روی سیستمت
- `ADMIN_PASSWORD` — رمز ورود به `/admin/login`
- `ADMIN_AUTH_SECRET` — یک رشته‌ی تصادفی (با دستور توی همان فایل می‌سازی)

اگر PostgreSQL روی سیستمت نصب نیست، ساده‌ترین راه نصب و بالا آوردنش:
```bash
sudo apt install postgresql postgresql-contrib   # اوبونتو/دبیان
sudo service postgresql start
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'postgres';"
sudo -u postgres psql -c "CREATE DATABASE app_db;"
```
(یا از Docker استفاده کن: `docker run -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:16`)

### ج) ساخت جداول و پر کردن داده‌ی نمونه
```bash
npm run db:push    # ساخت جداول از روی schema.ts
npm run db:seed    # پر کردن دیتابیس با داده‌ی نمونه (اعضای تیم، پروژه‌ها و...)
```

### د) اجرا در حالت توسعه
```bash
npm run dev
```
سایت روی `http://localhost:3000` بالا می‌آید. پنل مدیریت هم روی `/admin/login` با رمزی که در `.env` گذاشتی.

### بررسی قبل از commit یا دیپلوی
```bash
npm run typecheck   # بررسی تایپ‌اسکریپت
npm run lint        # بررسی ESLint
npm run build       # build نهایی پروداکشن
```

## ۲) دیپلوی رایگان روی اینترنت (Vercel + Neon + Vercel Blob)

این سه سرویس با هم یک استک کاملاً رایگان برای این پروژه می‌سازند (برای پروژه‌ی شخصی/غیرتجاری — نه برای سایتی که ازش پول درمی‌آری، چون پلن رایگان Vercel فقط برای استفاده‌ی شخصی/غیرتجاریه):

| سرویس | کاربرد | پلن رایگان |
|---|---|---|
| [Vercel](https://vercel.com) | هاست خودِ سایت Next.js | ۱۰۰ گیگ ترافیک در ماه |
| [Neon](https://neon.tech) | دیتابیس PostgreSQL | ۰.۵ گیگ فضا، همیشه رایگان |
| Vercel Blob | ذخیره‌ی تصاویر آپلودی (اعضای تیم، پروژه‌ها) | ۱ گیگ فضا در پلن Hobby |

چرا سه‌تا سرویس جدا؟ چون Vercel روی سرورلس کار می‌کند و دیسکش موقتی است — یعنی نه دیتابیس می‌تواند رویش بماند، نه فایل‌های آپلودی. Neon و Vercel Blob این دو مورد را دائمی نگه می‌دارند.

### الف) کد را روی GitHub بگذار
```bash
git init
git add .
git commit -m "initial commit"
```
یک ریپازیتوری خالی در [github.com/new](https://github.com/new) بساز، بعد:
```bash
git remote add origin <لینک ریپازیتوری>
git push -u origin main
```
چون `.gitignore` درست شده، `.env` و `node_modules` وارد گیت نمی‌شوند.

### ب) دیتابیس رایگان روی Neon بساز
1. برو به [neon.tech](https://neon.tech) و با GitHub ثبت‌نام کن (نیاز به کارت بانکی نیست)
2. یک پروژه‌ی جدید بساز
3. از صفحه‌ی Dashboard، **Connection string** را کپی کن — همان `DATABASE_URL` توست (چیزی شبیه `postgresql://user:pass@ep-xxx.neon.tech/dbname?sslmode=require`)

### ج) پروژه را در Vercel Import کن
1. برو به [vercel.com/new](https://vercel.com/new) و با همان اکانت GitHub وارد شو
2. ریپازیتوری‌ای که همین الان ساختی را Import کن
3. قبل از زدن Deploy، بخش **Environment Variables** را باز کن و این‌ها را اضافه کن:
   - `DATABASE_URL` → همان connection string از Neon
   - `ADMIN_PASSWORD` → یک رمز قوی و جدید (نه `nova-admin-1403`)
   - `ADMIN_AUTH_SECRET` → یک رشته‌ی تصادفی طولانی (با دستور زیر بساز و همینجا پیست کن)
     ```bash
     node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
     ```
4. Deploy را بزن

### د) فضای آپلود تصویر (Vercel Blob) بساز
1. داخل داشبورد پروژه‌ات در Vercel، برو به تب **Storage**
2. **Create Database** → **Blob** را انتخاب کن، یک اسم بده و بساز
3. Vercel خودش متغیر `BLOB_READ_WRITE_TOKEN` را به‌صورت خودکار به تنظیمات پروژه اضافه می‌کند — نیازی به کپی دستی نیست
4. یک بار از تب Deployments، آخرین دیپلوی را **Redeploy** کن تا این متغیر جدید اعمال شود

### ه) جدول‌ها را روی دیتابیس آنلاین بساز
از سیستم خودت (نه از Vercel)، با `DATABASE_URL` واقعی Neon در فایل `.env`:
```bash
npm run db:push
npm run db:seed   # اختیاری — داده‌ی نمونه؛ اگر می‌خوای از صفر شروع کنی، این را رد کن
```

الان سایتت آنلاینه، با یک لینک `something.vercel.app`. هر بار که به شاخه‌ی `main` در گیت‌هاب push کنی، Vercel خودش دوباره دیپلویش می‌کند.

### نکته‌ی امنیتی مهم
مقادیر پیش‌فرض `ADMIN_PASSWORD` و `ADMIN_AUTH_SECRET` که در کد به‌عنوان fallback هست فقط برای این است که برنامه در نبود `.env` کرش نکند — **حتماً روی Vercel این دو را به مقادیر تصادفی و قوی خودت ست کن** (مرحله‌ی ج بالا)، وگرنه هرکسی می‌تواند با رمز پیش‌فرض وارد پنل مدیریت شود.

### اگر بعداً به هاست دیگری (غیر از Vercel) نیاز داشتی
کد پروژه یک اپ Next.js استاندارد است و روی هر هاستی که Node.js را پشتیبانی کند (VPS، Railway، Render و…) هم بالا می‌آید — فقط در آن صورت چون فضای دیسک آن هاست ممکن است دائمی باشد، می‌توانی `src/lib/upload.ts` را برگردانی به ذخیره‌ی مستقیم روی دیسک به‌جای Vercel Blob.
