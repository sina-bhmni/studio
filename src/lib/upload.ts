import { put } from "@vercel/blob";
import { randomUUID } from "crypto";

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const MAX_SIZE = 5 * 1024 * 1024; // ۵ مگابایت

export class UploadError extends Error {}

/**
 * یک فایل تصویر آپلودشده را در Vercel Blob ذخیره می‌کند و URL عمومی آن را
 * برمی‌گرداند — یا null اگر فایلی انتخاب نشده باشد.
 *
 * چرا Vercel Blob و نه دیسک محلی؟ چون در محیط production روی Vercel، فضای
 * دیسک هر Function موقتی است و بین درخواست‌ها/دیپلوی‌های مختلف پاک می‌شود؛
 * فایلی که الان آپلود می‌کنی ممکن است چند دقیقه بعد دیگر وجود نداشته باشد.
 * Vercel Blob ذخیره‌سازی دائمی و رایگان (تا ۱ گیگابایت در پلن Hobby) است.
 *
 * برای کار کردن نیاز به متغیر محیطی BLOB_READ_WRITE_TOKEN دارد (راهنمای
 * گرفتنش در README پروژه هست).
 */
export async function saveUploadedImage(
  file: File | null | undefined,
  subfolder: string,
): Promise<string | null> {
  if (!file || file.size === 0) return null;

  const ext = ALLOWED_TYPES[file.type];
  if (!ext) {
    throw new UploadError("فرمت فایل مجاز نیست. فقط JPG، PNG، WebP یا GIF مجاز است.");
  }
  if (file.size > MAX_SIZE) {
    throw new UploadError("حجم فایل بیشتر از ۵ مگابایت است.");
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new UploadError(
      "آپلود تصویر تنظیم نشده است — متغیر BLOB_READ_WRITE_TOKEN را طبق راهنمای README اضافه کن.",
    );
  }

  const filename = `${subfolder}/${randomUUID()}.${ext}`;
  const blob = await put(filename, file, {
    access: "public",
    addRandomSuffix: false,
  });

  return blob.url;
}
