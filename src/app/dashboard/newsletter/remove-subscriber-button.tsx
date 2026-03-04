"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export function RemoveSubscriberButton({ id }: { id: string }) {
  const { toast } = useToast();
  const router = useRouter();
  const [removing, setRemoving] = useState(false);

  async function handleRemove() {
    if (!confirm("Are you sure you want to remove this subscriber?")) return;

    setRemoving(true);
    try {
      const res = await fetch(`/api/newsletter?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast({ title: "Subscriber removed", description: "The subscriber has been removed." });
        router.refresh();
      } else {
        const data = await res.json();
        toast({ title: "Error", description: data.error || "Failed to remove subscriber.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to remove subscriber.", variant: "destructive" });
    } finally {
      setRemoving(false);
    }
  }

  return (
    <Button variant="ghost" size="icon" onClick={handleRemove} disabled={removing}>
      {removing ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4 text-destructive" />
      )}
      <span className="sr-only">Remove</span>
    </Button>
  );
}
