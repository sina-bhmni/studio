import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

/* ---------------------------------- Enums ---------------------------------- */

export const inquiryStatusEnum = pgEnum("inquiry_status", [
  "pending",
  "contacted",
  "closed",
]);

export const projectCategoryEnum = pgEnum("project_category", [
  "web",
  "branding",
  "uiux",
  "marketing",
]);

/* --------------------------------- Members --------------------------------- */

export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  slug: varchar("slug", { length: 140 }).notNull().unique(),
  role: varchar("role", { length: 120 }).notNull(),
  roleGroup: varchar("role_group", { length: 60 }).notNull().default("developer"),
  avatar: varchar("avatar", { length: 300 }),
  bioShort: text("bio_short").notNull(),
  bioFull: text("bio_full").notNull(),
  email: varchar("email", { length: 160 }),
  location: varchar("location", { length: 120 }),
  joinDate: varchar("join_date", { length: 40 }),
  isActive: boolean("is_active").notNull().default(true),
  availableForHire: boolean("available_for_hire").notNull().default(false),
  order: integer("order").notNull().default(0),
});

export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  category: varchar("category", { length: 80 }).notNull().default("general"),
});

/* through-model: مهارت هر عضو + سطح تسلط (۱ تا ۱۰۰) */
export const memberSkills = pgTable("member_skills", {
  id: serial("id").primaryKey(),
  memberId: integer("member_id")
    .notNull()
    .references(() => teamMembers.id, { onDelete: "cascade" }),
  skillId: integer("skill_id")
    .notNull()
    .references(() => skills.id, { onDelete: "cascade" }),
  proficiency: integer("proficiency").notNull().default(50),
});

export const socialLinks = pgTable("social_links", {
  id: serial("id").primaryKey(),
  memberId: integer("member_id")
    .notNull()
    .references(() => teamMembers.id, { onDelete: "cascade" }),
  platform: varchar("platform", { length: 60 }).notNull(), // github | linkedin | dribbble | ...
  url: varchar("url", { length: 300 }).notNull(),
});

/* --------------------------------- Resume ---------------------------------- */

export const experiences = pgTable("experiences", {
  id: serial("id").primaryKey(),
  memberId: integer("member_id")
    .notNull()
    .references(() => teamMembers.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 160 }).notNull(),
  company: varchar("company", { length: 160 }).notNull(),
  startYear: varchar("start_year", { length: 20 }).notNull(),
  endYear: varchar("end_year", { length: 20 }), // null => هم‌اکنون
  description: text("description"),
  order: integer("order").notNull().default(0),
});

export const educations = pgTable("educations", {
  id: serial("id").primaryKey(),
  memberId: integer("member_id")
    .notNull()
    .references(() => teamMembers.id, { onDelete: "cascade" }),
  degree: varchar("degree", { length: 160 }).notNull(),
  institution: varchar("institution", { length: 180 }).notNull(),
  startYear: varchar("start_year", { length: 20 }).notNull(),
  endYear: varchar("end_year", { length: 20 }),
  order: integer("order").notNull().default(0),
});

export const certifications = pgTable("certifications", {
  id: serial("id").primaryKey(),
  memberId: integer("member_id")
    .notNull()
    .references(() => teamMembers.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 180 }).notNull(),
  issuer: varchar("issuer", { length: 160 }).notNull(),
  year: varchar("year", { length: 20 }).notNull(),
  order: integer("order").notNull().default(0),
});

/* --------------------------------- Projects -------------------------------- */

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 180 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  description: text("description").notNull(),
  thumbnail: varchar("thumbnail", { length: 300 }),
  liveUrl: varchar("live_url", { length: 300 }),
  clientName: varchar("client_name", { length: 160 }),
  category: projectCategoryEnum("category").notNull().default("web"),
  year: varchar("year", { length: 10 }),
  isFeatured: boolean("is_featured").notNull().default(false),
  order: integer("order").notNull().default(0),
});

/* پروژه‌هایی که هر عضو روی آن‌ها کار کرده + نقشش در آن پروژه */
export const projectMembers = pgTable("project_members", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  memberId: integer("member_id")
    .notNull()
    .references(() => teamMembers.id, { onDelete: "cascade" }),
  roleInProject: varchar("role_in_project", { length: 140 }),
});

/* --------------------------------- Content --------------------------------- */

export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 160 }).notNull(),
  description: text("description").notNull(),
  icon: varchar("icon", { length: 60 }).notNull().default("sparkles"),
  order: integer("order").notNull().default(0),
});

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  clientName: varchar("client_name", { length: 140 }).notNull(),
  clientRole: varchar("client_role", { length: 160 }),
  content: text("content").notNull(),
  rating: integer("rating").notNull().default(5),
  isVisible: boolean("is_visible").notNull().default(true),
  order: integer("order").notNull().default(0),
});

export const contactRequests = pgTable("contact_requests", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 140 }).notNull(),
  email: varchar("email", { length: 180 }).notNull(),
  phone: varchar("phone", { length: 40 }),
  projectType: varchar("project_type", { length: 80 }),
  budget: varchar("budget", { length: 80 }),
  message: text("message").notNull(),
  status: inquiryStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/* ---------------------------------- Types ---------------------------------- */

export type TeamMember = typeof teamMembers.$inferSelect;
export type Skill = typeof skills.$inferSelect;
export type MemberSkill = typeof memberSkills.$inferSelect;
export type SocialLink = typeof socialLinks.$inferSelect;
export type Experience = typeof experiences.$inferSelect;
export type Education = typeof educations.$inferSelect;
export type Certification = typeof certifications.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type ProjectMember = typeof projectMembers.$inferSelect;
export type Service = typeof services.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;
export type ContactRequest = typeof contactRequests.$inferSelect;
