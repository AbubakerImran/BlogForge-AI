import { cn } from "@/lib/utils";

interface AdPlaceholderProps {
  variant: "banner" | "sidebar" | "in-article";
  className?: string;
}

const adDimensions: Record<AdPlaceholderProps["variant"], { width: string; height: string; maxWidth: string }> = {
  banner: { width: "100%", height: "90px", maxWidth: "728px" },
  sidebar: { width: "300px", height: "250px", maxWidth: "300px" },
  "in-article": { width: "100%", height: "280px", maxWidth: "336px" },
};

export function AdPlaceholder({ variant, className }: AdPlaceholderProps) {
  const dims = adDimensions[variant];

  return (
    <div
      className={cn(
        "mx-auto flex items-center justify-center rounded border-2 border-dashed border-muted-foreground/25 bg-muted/50 text-xs text-muted-foreground",
        className
      )}
      style={{
        width: dims.width,
        height: dims.height,
        maxWidth: dims.maxWidth,
      }}
      role="complementary"
      aria-label="Advertisement placeholder"
    >
      Advertisement
    </div>
  );
}
