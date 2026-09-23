import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Sparkles } from "lucide-react";
import { isAdminAuthenticated } from "@/lib/auth";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "ورود مدیران",
  robots: { index: false },
};

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-5 pt-28 pb-16">
      <div className="grain-card w-full max-w-md rounded-3xl border border-border bg-card p-8 sm:p-10">
        <div className="mb-8 flex flex-col items-center gap-4 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
            <Sparkles className="h-7 w-7" />
          </span>
          <div>
            <h1 className="text-2xl font-black">پنل مدیریت نوا</h1>
            <p className="mt-2 text-sm text-muted">
              فقط اعضای تیم اجازه‌ی ورود دارند.
            </p>
          </div>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
