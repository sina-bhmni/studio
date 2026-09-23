"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { projects, projectCategoryEnum } from "@/db/schema";
import { isAdminAuthenticated } from "@/lib/auth";
import { saveUploadedImage, UploadError } from "@/lib/upload";

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }
}

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function num(formData: FormData, key: string): number {
  const v = Number(formData.get(key));
  return Number.isFinite(v) ? v : 0;
}

function bool(formData: FormData, key: string): boolean {
  return formData.get(key) === "on";
}

const VALID_CATEGORIES = projectCategoryEnum.enumValues;
type Category = (typeof VALID_CATEGORIES)[number];

function category(formData: FormData): Category {
  const v = str(formData, "category");
  return (VALID_CATEGORIES as readonly string[]).includes(v) ? (v as Category) : "web";
}

/** true اگر خطا به‌خاطر تکراری بودن slug باشد (کد ۲۳۵۰۵ پستگرس: unique_violation) */
function isUniqueViolation(err: unknown): boolean {
  return typeof err === "object" && err !== null && "code" in err && err.code === "23505";
}

export async function createProjectAction(formData: FormData): Promise<void> {
  await requireAdmin();

  let thumbnailUrl: string | null = null;
  try {
    thumbnailUrl = await saveUploadedImage(formData.get("thumbnailFile") as File | null, "projects");
  } catch (err) {
    if (err instanceof UploadError) {
      redirect(`/admin/projects/new?error=${encodeURIComponent(err.message)}`);
    }
    throw err;
  }

  try {
    await db.insert(projects).values({
      title: str(formData, "title"),
      slug: str(formData, "slug"),
      description: str(formData, "description"),
      thumbnail: thumbnailUrl,
      liveUrl: str(formData, "liveUrl") || null,
      clientName: str(formData, "clientName") || null,
      category: category(formData),
      year: str(formData, "year") || null,
      isFeatured: bool(formData, "isFeatured"),
      order: num(formData, "order"),
    });
  } catch (err) {
    if (isUniqueViolation(err)) {
      redirect("/admin/projects/new?error=slug-taken");
    }
    throw err;
  }

  revalidatePath("/admin/projects");
  revalidatePath("/");
  revalidatePath("/portfolio");
  redirect("/admin/projects");
}

export async function updateProjectAction(id: number, formData: FormData): Promise<void> {
  await requireAdmin();

  const existing = await db
    .select({ thumbnail: projects.thumbnail })
    .from(projects)
    .where(eq(projects.id, id))
    .limit(1);
  let thumbnailUrl: string | null = existing[0]?.thumbnail ?? null;

  try {
    const uploaded = await saveUploadedImage(formData.get("thumbnailFile") as File | null, "projects");
    if (uploaded) thumbnailUrl = uploaded;
  } catch (err) {
    if (err instanceof UploadError) {
      redirect(`/admin/projects/${id}/edit?error=${encodeURIComponent(err.message)}`);
    }
    throw err;
  }

  try {
    await db
      .update(projects)
      .set({
        title: str(formData, "title"),
        slug: str(formData, "slug"),
        description: str(formData, "description"),
        thumbnail: thumbnailUrl,
        liveUrl: str(formData, "liveUrl") || null,
        clientName: str(formData, "clientName") || null,
        category: category(formData),
        year: str(formData, "year") || null,
        isFeatured: bool(formData, "isFeatured"),
        order: num(formData, "order"),
      })
      .where(eq(projects.id, id));
  } catch (err) {
    if (isUniqueViolation(err)) {
      redirect(`/admin/projects/${id}/edit?error=slug-taken`);
    }
    throw err;
  }

  revalidatePath("/admin/projects");
  revalidatePath("/");
  revalidatePath("/portfolio");
  redirect("/admin/projects");
}

export async function deleteProjectAction(id: number): Promise<void> {
  await requireAdmin();
  await db.delete(projects).where(eq(projects.id, id));
  revalidatePath("/admin/projects");
  revalidatePath("/");
  revalidatePath("/portfolio");
}
