import Link from "next/link";
import { Inbox, Users2, Briefcase, Sparkles, MessageSquareQuote, LogOut } from "lucide-react";
import { logoutAction } from "@/app/admin/actions";

const TABS = [
  { href: "/admin", label: "درخواست‌ها", icon: Inbox },
  { href: "/admin/team", label: "اعضای تیم", icon: Users2 },
  { href: "/admin/projects", label: "پروژه‌ها", icon: Briefcase },
  { href: "/admin/services", label: "خدمات", icon: Sparkles },
  { href: "/admin/testimonials", label: "نظرات مشتری", icon: MessageSquareQuote },
] as const;

export function AdminNav({ active }: { active: (typeof TABS)[number]["href"] }) {
  return (
    <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
      <nav className="flex flex-wrap gap-2">
        {TABS.map((tab) => {
          const isActive = tab.href === active;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-all duration-300 ${
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted hover:bg-ring hover:text-foreground"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </Link>
          );
        })}
      </nav>
      <form action={logoutAction}>
        <button
          type="submit"
          className="flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-bold text-muted transition-all duration-300 hover:border-red-500/50 hover:text-red-500"
        >
          <LogOut className="h-4 w-4" />
          خروج
        </button>
      </form>
    </div>
  );
}
