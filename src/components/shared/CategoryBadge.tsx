import Link from "next/link";
import { cn } from "@/lib/utils";

interface CategoryBadgeProps {
  name: string;
  color: string;
  slug?: string;
  className?: string;
}

export function CategoryBadge({ name, color, slug, className }: CategoryBadgeProps) {
  const badgeClasses = cn(
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
    className
  );

  const style = {
    backgroundColor: `${color}20`,
    color: color,
    borderWidth: "1px",
    borderColor: `${color}40`,
  };

  if (slug) {
    return (
      <Link href={`/categories/${slug}`} className={cn(badgeClasses, "hover:opacity-80")} style={style}>
        {name}
      </Link>
    );
  }

  return (
    <span className={badgeClasses} style={style}>
      {name}
    </span>
  );
}
