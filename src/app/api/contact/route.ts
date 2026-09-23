import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { db } from "@/db";
import { contactRequests } from "@/db/schema";
import { rateLimit } from "@/lib/rate-limit";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(2, "نام باید حداقل ۲ حرف باشد").max(140),
  email: z.string().trim().email("ایمیل معتبر نیست").max(180),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  projectType: z.string().trim().max(80).optional().or(z.literal("")),
  budget: z.string().trim().max(80).optional().or(z.literal("")),
  message: z.string().trim().min(10, "پیام باید حداقل ۱۰ حرف باشد").max(2000),
  website: z.string().optional(), // honeypot
});

export async function POST(request: Request) {
  try {
    // --- Rate limiting (معادل django-ratelimit): ۳ درخواست در دقیقه برای هر IP
    const headerList = await headers();
    const ip =
      headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      headerList.get("x-real-ip") ??
      "unknown";
    const rl = rateLimit({
      key: `contact:${ip}`,
      limit: 3,
      windowMs: 60_000,
    });
    if (!rl.success) {
      return NextResponse.json(
        {
          ok: false,
          error: `درخواست‌های شما بیش از حد مجاز است. لطفاً ${rl.retryAfterSeconds} ثانیه دیگر تلاش کنید.`,
        },
        { status: 429 },
      );
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { ok: false, error: "بدنه‌ی درخواست نامعتبر است." },
        { status: 400 },
      );
    }

    // --- Honeypot: ربات‌ها فیلد نامرئی را پر می‌کنند
    if (typeof body.website === "string" && body.website.length > 0) {
      // موفقیت ساختگی برمی‌گردانیم تا ربات متوجه نشود
      return NextResponse.json({ ok: true });
    }

    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      return NextResponse.json(
        { ok: false, error: first?.message ?? "اطلاعات واردشده معتبر نیست." },
        { status: 422 },
      );
    }

    const { name, email, phone, projectType, budget, message } = parsed.data;

    await db.insert(contactRequests).values({
      name,
      email,
      phone: phone || null,
      projectType: projectType || null,
      budget: budget || null,
      message,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[contact] خطا در ثبت درخواست:", error);
    return NextResponse.json(
      { ok: false, error: "خطای سرور رخ داد. لطفاً دوباره تلاش کنید." },
      { status: 500 },
    );
  }
}
