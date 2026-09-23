"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { services } from "@/db/schema";
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

export async function createServiceAction(formData: FormData): Promise<void> {
  await requireAdmin();

  await db.insert(services).values({
    title: str(formData, "title"),
    description: str(formData, "description"),
    icon: str(formData, "icon") || "sparkles",
    order: num(formData, "order"),
  });

  revalidatePath("/admin/services");
  revalidatePath("/");
  redirect("/admin/services");
}

export async function updateServiceAction(id: number, formData: FormData): Promise<void> {
  await requireAdmin();

  await db
    .update(services)
    .set({
      title: str(formData, "title"),
      description: str(formData, "description"),
      icon: str(formData, "icon") || "sparkles",
      order: num(formData, "order"),
    })
    .where(eq(services.id, id));

  revalidatePath("/admin/services");
  revalidatePath("/");
  redirect("/admin/services");
}

export async function deleteServiceAction(id: number): Promise<void> {
  await requireAdmin();
  await db.delete(services).where(eq(services.id, id));
  revalidatePath("/admin/services");
  revalidatePath("/");
}
