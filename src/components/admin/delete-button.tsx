"use client";

import { Trash2 } from "lucide-react";
import { useTransition } from "react";

export function DeleteButton({
  action,
  confirmMessage = "مطمئنی می‌خوای حذفش کنی؟ این کار قابل بازگشت نیست.",
}: {
  action: () => Promise<void>;
  confirmMessage?: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (window.confirm(confirmMessage)) {
          startTransition(() => {
            action();
          });
        }
      }}
      className="flex items-center gap-1.5 rounded-full border border-red-500/30 px-4 py-2 text-xs font-bold text-red-500 transition-all duration-300 hover:bg-red-500/10 disabled:opacity-50"
    >
      <Trash2 className="h-3.5 w-3.5" />
      {pending ? "در حال حذف…" : "حذف"}
    </button>
  );
}
