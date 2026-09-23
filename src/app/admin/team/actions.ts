"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { teamMembers } from "@/db/schema";
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

const VALID_ROLE_GROUPS = ["designer", "developer", "manager"] as const;
type RoleGroup = (typeof VALID_ROLE_GROUPS)[number];

function roleGroup(formData: FormData): RoleGroup {
  const v = str(formData, "roleGroup");
  return (VALID_ROLE_GROUPS as readonly string[]).includes(v) ? (v as RoleGroup) : "developer";
}

/** true اگر خطا به‌خاطر تکراری بودن slug باشد (کد ۲۳۵۰۵ پستگرس: unique_violation) */
function isUniqueViolation(err: unknown): boolean {
  return typeof err === "object" && err !== null && "code" in err && err.code === "23505";
}

export async function createMemberAction(formData: FormData): Promise<void> {
  await requireAdmin();

  let avatarUrl: string | null = null;
  try {
    avatarUrl = await saveUploadedImage(formData.get("avatarFile") as File | null, "team");
  } catch (err) {
    if (err instanceof UploadError) {
      redirect(`/admin/team/new?error=${encodeURIComponent(err.message)}`);
    }
    throw err;
  }

  try {
    await db.insert(teamMembers).values({
      name: str(formData, "name"),
      slug: str(formData, "slug"),
      role: str(formData, "role"),
      roleGroup: roleGroup(formData),
      avatar: avatarUrl,
      bioShort: str(formData, "bioShort"),
      bioFull: str(formData, "bioFull"),
      email: str(formData, "email") || null,
      location: str(formData, "location") || null,
      joinDate: str(formData, "joinDate") || null,
      isActive: bool(formData, "isActive"),
      availableForHire: bool(formData, "availableForHire"),
      order: num(formData, "order"),
    });
  } catch (err) {
    if (isUniqueViolation(err)) {
      redirect("/admin/team/new?error=slug-taken");
    }
    throw err;
  }

  revalidatePath("/admin/team");
  revalidatePath("/");
  revalidatePath("/team");
  redirect("/admin/team");
}

export async function updateMemberAction(id: number, formData: FormData): Promise<void> {
  await requireAdmin();

  const existing = await db
    .select({ avatar: teamMembers.avatar })
    .from(teamMembers)
    .where(eq(teamMembers.id, id))
    .limit(1);
  let avatarUrl: string | null = existing[0]?.avatar ?? null;

  try {
    const uploaded = await saveUploadedImage(formData.get("avatarFile") as File | null, "team");
    if (uploaded) avatarUrl = uploaded;
  } catch (err) {
    if (err instanceof UploadError) {
      redirect(`/admin/team/${id}/edit?error=${encodeURIComponent(err.message)}`);
    }
    throw err;
  }

  try {
    await db
      .update(teamMembers)
      .set({
        name: str(formData, "name"),
        slug: str(formData, "slug"),
        role: str(formData, "role"),
        roleGroup: roleGroup(formData),
        avatar: avatarUrl,
        bioShort: str(formData, "bioShort"),
        bioFull: str(formData, "bioFull"),
        email: str(formData, "email") || null,
        location: str(formData, "location") || null,
        joinDate: str(formData, "joinDate") || null,
        isActive: bool(formData, "isActive"),
        availableForHire: bool(formData, "availableForHire"),
        order: num(formData, "order"),
      })
      .where(eq(teamMembers.id, id));
  } catch (err) {
    if (isUniqueViolation(err)) {
      redirect(`/admin/team/${id}/edit?error=slug-taken`);
    }
    throw err;
  }

  revalidatePath("/admin/team");
  revalidatePath("/");
  revalidatePath("/team");
  redirect("/admin/team");
}

export async function deleteMemberAction(id: number): Promise<void> {
  await requireAdmin();
  await db.delete(teamMembers).where(eq(teamMembers.id, id));
  revalidatePath("/admin/team");
  revalidatePath("/");
  revalidatePath("/team");
}
