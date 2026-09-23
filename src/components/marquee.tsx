import { Asterisk } from "lucide-react";

/** نوار متحرک کلمات — انرژی بصری صفحه */
export function Marquee({
  items,
  className = "",
  inverted = false,
}: {
  items: string[];
  className?: string;
  inverted?: boolean;
}) {
  const content = [...items, ...items];
  return (
    <div
      className={`relative overflow-hidden border-y py-4 ${
        inverted
          ? "border-transparent bg-accent text-accent-foreground"
          : "border-border bg-surface text-foreground/70"
      } ${className}`}
      dir="ltr"
    >
      <div className="animate-marquee flex w-max items-center gap-8 whitespace-nowrap">
        {content.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-8 text-sm font-bold tracking-widest"
            dir="rtl"
          >
            <Asterisk
              className={`h-5 w-5 ${inverted ? "text-accent-foreground" : "text-accent"}`}
            />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
