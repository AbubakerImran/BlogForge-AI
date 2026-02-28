import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface AISummaryBoxProps {
  summary: string | null;
  className?: string;
}

export function AISummaryBox({ summary, className }: AISummaryBoxProps) {
  if (!summary) return null;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-[1px] dark:from-blue-500/20 dark:to-purple-500/20",
        className
      )}
    >
      <div className="rounded-[7px] bg-background/95 p-5 backdrop-blur-sm">
        <div className="mb-2 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-blue-500" />
          <span className="text-sm font-semibold tracking-tight text-blue-600 dark:text-blue-400">
            AI-Generated TLDR
          </span>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {summary}
        </p>
      </div>
    </div>
  );
}
