"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Subscriber {
  email: string;
  active: boolean;
  createdAt: string;
}

export function ExportCsvButton({ subscribers }: { subscribers: Subscriber[] }) {
  function handleExport() {
    const header = "Email,Status,Subscribed Date";
    const rows = subscribers.map(
      (s) =>
        `${s.email},${s.active ? "Active" : "Inactive"},${new Date(s.createdAt).toLocaleDateString()}`
    );
    const csv = [header, ...rows].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Button variant="outline" onClick={handleExport}>
      <Download className="mr-2 h-4 w-4" />
      Export CSV
    </Button>
  );
}
