import { Card, CardContent } from "@/components/ui/card";
import { type LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: LucideIcon;
}

const changeColorMap = {
  positive: "text-green-600 dark:text-green-400",
  negative: "text-red-600 dark:text-red-400",
  neutral: "text-gray-500 dark:text-gray-400",
};

export default function KPICard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
}: KPICardProps) {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="flex items-center gap-4 p-6">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-6 w-6" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground truncate">
            {title}
          </p>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          <p className={`text-sm font-medium ${changeColorMap[changeType]}`}>
            {change}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
