"use client";

import { useActionState } from "react";
import { Loader2, LockKeyhole, ShieldAlert } from "lucide-react";
import { loginAction, type LoginState } from "@/app/admin/actions";

const initial: LoginState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initial);

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      {state.error && (
        <p
          role="alert"
          className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-500"
        >
          <ShieldAlert className="h-4.5 w-4.5 shrink-0" />
          {state.error}
        </p>
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-sm font-bold">
          رمز عبور مدیر
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            dir="ltr"
            className="w-full rounded-xl border border-border bg-surface px-4.5 py-3.5 pl-12 text-sm outline-none transition-all duration-300 focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
          <LockKeyhole className="absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted" />
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-accent px-8 py-4 text-base font-bold text-accent-foreground transition-all duration-300 hover:brightness-110 disabled:opacity-60"
      >
        {pending ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            در حال بررسی…
          </>
        ) : (
          "ورود به پنل مدیریت"
        )}
      </button>

      <p className="text-center text-xs leading-6 text-muted">
        ورود محافظت می‌شود؛ تلاش‌های ناموفق زیاد موقتاً مسدود می‌شوند.
        <br />
        (رمز پیش‌فرض توسعه:{" "}
        <code className="rounded bg-ring px-1.5 py-0.5 font-mono" dir="ltr">
          nova-admin-1403
        </code>
        )
      </p>
    </form>
  );
}
