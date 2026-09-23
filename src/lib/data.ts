import { db } from "@/db";
import {
  teamMembers,
  skills,
  memberSkills,
  socialLinks,
  experiences,
  educations,
  certifications,
  projects,
  projectMembers,
  services,
  testimonials,
  contactRequests,
  type TeamMember,
  type Project,
  type Skill,
  type MemberSkill,
  type SocialLink,
  type Experience,
  type Education,
  type Certification,
} from "@/db/schema";
import { asc, desc, eq } from "drizzle-orm";

export const ROLE_GROUPS = [
  { key: "all", label: "همه" },
  { key: "designer", label: "طراحی" },
  { key: "developer", label: "توسعه" },
  { key: "manager", label: "مدیریت و محتوا" },
] as const;

export const PROJECT_CATEGORIES: Record<string, string> = {
  web: "توسعه وب",
  branding: "برندینگ",
  uiux: "UI/UX",
  marketing: "بازاریابی دیجیتال",
};

/* ---------------------------------- Queries --------------------------------- */

export async function getMembers(): Promise<TeamMember[]> {
  return db
    .select()
    .from(teamMembers)
    .where(eq(teamMembers.isActive, true))
    .orderBy(asc(teamMembers.order));
}

export async function getMemberBySlug(slug: string) {
  const rows = await db
    .select()
    .from(teamMembers)
    .where(eq(teamMembers.slug, slug))
    .limit(1);
  return rows[0] ?? null;
}

export type MemberSkillWithName = MemberSkill & { skill: Skill };

export async function getMemberSkills(memberId: number): Promise<MemberSkillWithName[]> {
  const rows = await db
    .select({ ms: memberSkills, skill: skills })
    .from(memberSkills)
    .innerJoin(skills, eq(memberSkills.skillId, skills.id))
    .where(eq(memberSkills.memberId, memberId));
  return rows
    .map((r) => ({ ...r.ms, skill: r.skill }))
    .sort((a, b) => b.proficiency - a.proficiency);
}

export async function getMemberSocials(memberId: number): Promise<SocialLink[]> {
  return db.select().from(socialLinks).where(eq(socialLinks.memberId, memberId));
}

export async function getMemberExperiences(memberId: number): Promise<Experience[]> {
  return db
    .select()
    .from(experiences)
    .where(eq(experiences.memberId, memberId))
    .orderBy(asc(experiences.order));
}

export async function getMemberEducations(memberId: number): Promise<Education[]> {
  return db
    .select()
    .from(educations)
    .where(eq(educations.memberId, memberId))
    .orderBy(asc(educations.order));
}

export async function getMemberCertifications(memberId: number): Promise<Certification[]> {
  return db
    .select()
    .from(certifications)
    .where(eq(certifications.memberId, memberId))
    .orderBy(asc(certifications.order));
}

export type ProjectWithRole = Project & { roleInProject: string | null };

export async function getMemberProjects(memberId: number): Promise<ProjectWithRole[]> {
  const rows = await db
    .select({ project: projects, roleInProject: projectMembers.roleInProject })
    .from(projectMembers)
    .innerJoin(projects, eq(projectMembers.projectId, projects.id))
    .where(eq(projectMembers.memberId, memberId))
    .orderBy(asc(projects.order));
  return rows.map((r) => ({ ...r.project, roleInProject: r.roleInProject }));
}

export type ProjectWithTeam = Project & {
  team: { member: TeamMember; roleInProject: string | null }[];
};

export async function getProjects(): Promise<ProjectWithTeam[]> {
  const projectRows = await db.select().from(projects).orderBy(asc(projects.order));
  const pmRows = await db
    .select({ pm: projectMembers, member: teamMembers })
    .from(projectMembers)
    .innerJoin(teamMembers, eq(projectMembers.memberId, teamMembers.id));

  return projectRows.map((p) => ({
    ...p,
    team: pmRows
      .filter((r) => r.pm.projectId === p.id)
      .map((r) => ({ member: r.member, roleInProject: r.pm.roleInProject })),
  }));
}

export async function getFeaturedProjects(): Promise<ProjectWithTeam[]> {
  const all = await getProjects();
  return all.filter((p) => p.isFeatured);
}

export async function getServices() {
  return db.select().from(services).orderBy(asc(services.order));
}

export async function getTestimonials() {
  return db
    .select()
    .from(testimonials)
    .where(eq(testimonials.isVisible, true))
    .orderBy(asc(testimonials.order));
}

export async function getInquiries() {
  return db.select().from(contactRequests).orderBy(desc(contactRequests.createdAt));
}

export async function getInquiryStats() {
  const rows = await db.select().from(contactRequests);
  const pending = rows.filter((r) => r.status === "pending").length;
  const contacted = rows.filter((r) => r.status === "contacted").length;
  const closed = rows.filter((r) => r.status === "closed").length;
  return { total: rows.length, pending, contacted, closed };
}

/* ------------------------------ Admin queries ------------------------------ */
/* نسخه‌های مخصوص پنل مدیریت — بدون فیلتر روی is_active / is_visible،
   چون مدیر باید بتواند آیتم‌های غیرفعال/مخفی را هم ببیند و ویرایش کند. */

export async function getAllMembersAdmin(): Promise<TeamMember[]> {
  return db.select().from(teamMembers).orderBy(asc(teamMembers.order));
}

export async function getMemberByIdAdmin(id: number): Promise<TeamMember | null> {
  const rows = await db.select().from(teamMembers).where(eq(teamMembers.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function getAllProjectsAdmin(): Promise<Project[]> {
  return db.select().from(projects).orderBy(asc(projects.order));
}

export async function getProjectByIdAdmin(id: number): Promise<Project | null> {
  const rows = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function getAllServicesAdmin() {
  return db.select().from(services).orderBy(asc(services.order));
}

export async function getServiceByIdAdmin(id: number) {
  const rows = await db.select().from(services).where(eq(services.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function getAllTestimonialsAdmin() {
  return db.select().from(testimonials).orderBy(asc(testimonials.order));
}

export async function getTestimonialByIdAdmin(id: number) {
  const rows = await db.select().from(testimonials).where(eq(testimonials.id, id)).limit(1);
  return rows[0] ?? null;
}

/* re-export برای راحتی در سرور کامپوننت‌ها */
export { toFa, formatDateFa } from "@/lib/format";
