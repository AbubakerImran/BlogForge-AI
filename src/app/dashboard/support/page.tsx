"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plus,
  Loader2,
  Bug,
  Lightbulb,
  AlertCircle,
  HelpCircle,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

interface Ticket {
  id: string;
  name: string;
  email: string;
  issueType: string;
  description: string;
  attachment: string | null;
  status: string;
  createdAt: string;
  user: { id: string; name: string | null; email: string; image: string | null };
  _count: { messages: number };
}

const issueTypes = [
  { value: "bug", label: "Bug Report", icon: Bug },
  { value: "suggestion", label: "Suggestion", icon: Lightbulb },
  { value: "question", label: "Question", icon: HelpCircle },
  { value: "issue", label: "General Issue", icon: AlertCircle },
  { value: "other", label: "Other", icon: MessageSquare },
];

const statusColors: Record<string, string> = {
  OPEN: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  IN_PROGRESS: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  RESOLVED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  CLOSED: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
};

export default function SupportPage() {
  const { toast } = useToast();
  const { data: session } = useSession();
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const isSA = session?.user?.role === "SUPERADMIN";

  // Form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    issueType: "",
    description: "",
    attachment: "",
  });

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    if (session?.user) {
      setForm((f) => ({
        ...f,
        name: session.user.name || "",
        email: session.user.email || "",
      }));
    }
  }, [session]);

  async function fetchTickets() {
    try {
      const res = await fetch("/api/support/tickets");
      if (res.ok) {
        const data = await res.json();
        setTickets(data.data || []);
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to load tickets",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateTicket(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch("/api/support/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        toast({
          title: "Ticket created",
          description: "Your support ticket has been submitted.",
        });
        setDialogOpen(false);
        setForm({
          name: session?.user?.name || "",
          email: session?.user?.email || "",
          issueType: "",
          description: "",
          attachment: "",
        });
        fetchTickets();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to create ticket",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to create ticket",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "File size must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    // Validate file type (images and videos only)
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      toast({
        title: "Error",
        description: "Only image and video files are allowed",
        variant: "destructive",
      });
      return;
    }

    // Convert to base64 data URL for storage
    const reader = new FileReader();
    reader.onload = () => {
      setForm((f) => ({ ...f, attachment: reader.result as string }));
    };
    reader.readAsDataURL(file);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Support</h1>
          <p className="text-muted-foreground">
            {isSA
              ? "Manage all support tickets from users."
              : "Submit and track your support tickets."}
          </p>
        </div>
        {!isSA && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Issue
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Create Support Ticket</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateTicket} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, name: e.target.value }))
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, email: e.target.value }))
                      }
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="issueType">Issue Type</Label>
                  <Select
                    value={form.issueType}
                    onValueChange={(v) =>
                      setForm((f) => ({ ...f, issueType: v }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select issue type" />
                    </SelectTrigger>
                    <SelectContent>
                      {issueTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={form.description}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, description: e.target.value }))
                    }
                    rows={4}
                    placeholder="Describe your issue in detail..."
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="attachment">
                    Attachment (optional, max 5MB, image/video)
                  </Label>
                  <Input
                    id="attachment"
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileUpload}
                  />
                  {form.attachment && (
                    <p className="text-xs text-green-600">File attached ✓</p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={creating}>
                  {creating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="mr-2 h-4 w-4" />
                  )}
                  Submit Ticket
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Ticket List */}
      {tickets.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No tickets yet</h3>
            <p className="mt-2 text-muted-foreground">
              {isSA
                ? "No support tickets have been submitted."
                : "Create your first support ticket to get help."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {tickets.map((ticket) => (
            <Link key={ticket.id} href={`/dashboard/support/${ticket.id}`}>
              <Card className="cursor-pointer transition hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-base">
                        {issueTypes.find((t) => t.value === ticket.issueType)
                          ?.label || ticket.issueType}
                      </CardTitle>
                      <Badge
                        variant="secondary"
                        className={statusColors[ticket.status] || ""}
                      >
                        {ticket.status.replace("_", " ")}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {isSA && (
                    <CardDescription>
                      By {ticket.user.name || ticket.user.email}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {ticket.description}
                  </p>
                  {ticket._count.messages > 0 && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                      <MessageSquare className="h-3 w-3" />
                      {ticket._count.messages} message
                      {ticket._count.messages !== 1 ? "s" : ""}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
