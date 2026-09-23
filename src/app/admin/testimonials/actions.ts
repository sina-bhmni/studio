"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { testimonials } from "@/db/schema";
import { isAdminAuthenticated } from "@/lib/auth";

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

export async function createTestimonialAction(formData: FormData): Promise<void> {
  await requireAdmin();

  await db.insert(testimonials).values({
    clientName: str(formData, "clientName"),
    clientRole: str(formData, "clientRole") || null,
    content: str(formData, "content"),
    rating: Math.min(5, Math.max(1, num(formData, "rating") || 5)),
    isVisible: bool(formData, "isVisible"),
    order: num(formData, "order"),
  });

  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  redirect("/admin/testimonials");
}

export async function updateTestimonialAction(id: number, formData: FormData): Promise<void> {
  await requireAdmin();

  await db
    .update(testimonials)
    .set({
      clientName: str(formData, "clientName"),
      clientRole: str(formData, "clientRole") || null,
      content: str(formData, "content"),
      rating: Math.min(5, Math.max(1, num(formData, "rating") || 5)),
      isVisible: bool(formData, "isVisible"),
      order: num(formData, "order"),
    })
    .where(eq(testimonials.id, id));

  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  redirect("/admin/testimonials");
}

export async function deleteTestimonialAction(id: number): Promise<void> {
  await requireAdmin();
  await db.delete(testimonials).where(eq(testimonials.id, id));
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}
