const inputClass =
  "w-full rounded-xl border border-border bg-surface px-4.5 py-3 text-sm outline-none transition-all duration-300 focus:border-accent focus:ring-2 focus:ring-accent/20";

export function Field({
  label,
  name,
  defaultValue,
  type = "text",
  required,
  dir,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  type?: string;
  required?: boolean;
  dir?: "ltr" | "rtl";
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-sm font-bold">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        dir={dir}
        placeholder={placeholder}
        defaultValue={defaultValue ?? ""}
        className={inputClass}
      />
    </div>
  );
}

export function TextAreaField({
  label,
  name,
  defaultValue,
  required,
  rows = 4,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  required?: boolean;
  rows?: number;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-sm font-bold">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <textarea
        id={name}
        name={name}
        required={required}
        rows={rows}
        defaultValue={defaultValue ?? ""}
        className={`${inputClass} resize-y leading-7`}
      />
    </div>
  );
}

export function SelectField({
  label,
  name,
  defaultValue,
  options,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  options: { value: string; label: string }[];
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-sm font-bold">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <select
        id={name}
        name={name}
        required={required}
        defaultValue={defaultValue}
        className={inputClass}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function CheckboxField({
  label,
  name,
  defaultChecked,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
}) {
  return (
    <label
      htmlFor={name}
      className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-surface px-4.5 py-3 text-sm font-bold"
    >
      <input
        id={name}
        name={name}
        type="checkbox"
        defaultChecked={defaultChecked}
        className="h-4.5 w-4.5 rounded border-border accent-accent"
      />
      {label}
    </label>
  );
}

export function FileField({
  label,
  name,
  currentUrl,
  helpText = "JPG، PNG، WebP یا GIF — حداکثر ۵ مگابایت",
}: {
  label: string;
  name: string;
  currentUrl?: string | null;
  helpText?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-sm font-bold">
        {label}
      </label>
      {currentUrl && (
        <div className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentUrl}
            alt=""
            className="h-16 w-16 rounded-lg object-cover"
          />
          <span className="text-xs text-muted">تصویر فعلی — با انتخاب فایل جدید جایگزین می‌شود</span>
        </div>
      )}
      <input
        id={name}
        name={name}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="w-full rounded-xl border border-dashed border-border bg-surface px-4.5 py-3 text-sm outline-none transition-all duration-300 file:ml-3 file:rounded-lg file:border-0 file:bg-accent file:px-4 file:py-2 file:text-xs file:font-bold file:text-accent-foreground focus:border-accent focus:ring-2 focus:ring-accent/20"
      />
      <p className="text-xs text-muted">{helpText}</p>
    </div>
  );
}

export function FormActions({
  submitLabel,
  cancelHref,
}: {
  submitLabel: string;
  cancelHref: string;
}) {
  return (
    <div className="mt-2 flex items-center gap-3">
      <button
        type="submit"
        className="rounded-xl bg-accent px-7 py-3 text-sm font-bold text-accent-foreground transition-all duration-300 hover:brightness-110"
      >
        {submitLabel}
      </button>
      <a
        href={cancelHref}
        className="rounded-xl border border-border px-7 py-3 text-sm font-bold text-muted transition-all duration-300 hover:text-foreground"
      >
        انصراف
      </a>
    </div>
  );
}
