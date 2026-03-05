"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Send,
  ArrowLeft,
  Bug,
  Lightbulb,
  AlertCircle,
  HelpCircle,
  MessageSquare,
  Image as ImageIcon,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

interface TicketDetail {
  id: string;
  name: string;
  email: string;
  issueType: string;
  description: string;
  attachment: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user: { id: string; name: string | null; email: string; image: string | null };
  messages: Message[];
}

interface Message {
  id: string;
  senderId: string;
  message: string;
  createdAt: string;
}

const issueTypeLabels: Record<string, { label: string; icon: React.ElementType }> = {
  bug: { label: "Bug Report", icon: Bug },
  suggestion: { label: "Suggestion", icon: Lightbulb },
  question: { label: "Question", icon: HelpCircle },
  issue: { label: "General Issue", icon: AlertCircle },
  other: { label: "Other", icon: MessageSquare },
};

const statusColors: Record<string, string> = {
  OPEN: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  IN_PROGRESS: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  RESOLVED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  CLOSED: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
};

export default function TicketDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { toast } = useToast();
  const { data: session } = useSession();
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const isSA = session?.user?.role === "SUPERADMIN";

  useEffect(() => {
    fetchTicket();
    // Poll for new messages every 10 seconds
    const interval = setInterval(fetchMessages, 10000);
    return () => clearInterval(interval);
  }, [params.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  async function fetchTicket() {
    try {
      const res = await fetch(`/api/support/tickets/${params.id}`);
      if (!res.ok) {
        router.push("/dashboard/support");
        return;
      }
      const data = await res.json();
      setTicket(data.data);
      setMessages(data.data.messages || []);
    } catch {
      toast({
        title: "Error",
        description: "Failed to load ticket",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function fetchMessages() {
    try {
      const res = await fetch(`/api/support/tickets/${params.id}/messages`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.data || []);
      }
    } catch {
      // Silent fail on poll
    }
  }

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);
    try {
      const res = await fetch(`/api/support/tickets/${params.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: newMessage }),
      });
      if (res.ok) {
        setNewMessage("");
        fetchMessages();
      } else {
        const data = await res.json();
        toast({
          title: "Error",
          description: data.error || "Failed to send message",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  }

  async function handleStatusChange(newStatus: string) {
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/support/tickets/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setTicket((t) => (t ? { ...t, status: newStatus } : t));
        toast({ title: "Status updated", description: `Ticket status changed to ${newStatus}` });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    } finally {
      setUpdatingStatus(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="py-20 text-center">
        <p className="text-muted-foreground">Ticket not found.</p>
      </div>
    );
  }

  const IssueIcon = issueTypeLabels[ticket.issueType]?.icon || MessageSquare;
  const isAttachmentImage = ticket.attachment?.startsWith("data:image/");
  const isAttachmentVideo = ticket.attachment?.startsWith("data:video/");

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/support">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">
            {issueTypeLabels[ticket.issueType]?.label || ticket.issueType}
          </h1>
          <p className="text-sm text-muted-foreground">
            Ticket #{ticket.id.slice(-8)} · Created{" "}
            {new Date(ticket.createdAt).toLocaleDateString()}
          </p>
        </div>
        <Badge variant="secondary" className={statusColors[ticket.status] || ""}>
          {ticket.status.replace("_", " ")}
        </Badge>
      </div>

      {/* Two-column layout */}
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        {/* Left: Issue Details */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <IssueIcon className="h-5 w-5" />
                Issue Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Name</p>
                  <p className="text-sm">{ticket.name}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Email</p>
                  <p className="text-sm">{ticket.email}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Type</p>
                  <p className="text-sm">
                    {issueTypeLabels[ticket.issueType]?.label || ticket.issueType}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Status</p>
                  {isSA ? (
                    <Select
                      value={ticket.status}
                      onValueChange={handleStatusChange}
                      disabled={updatingStatus}
                    >
                      <SelectTrigger className="h-8 w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="OPEN">Open</SelectItem>
                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                        <SelectItem value="RESOLVED">Resolved</SelectItem>
                        <SelectItem value="CLOSED">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge
                      variant="secondary"
                      className={statusColors[ticket.status] || ""}
                    >
                      {ticket.status.replace("_", " ")}
                    </Badge>
                  )}
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  Description
                </p>
                <p className="text-sm whitespace-pre-wrap">{ticket.description}</p>
              </div>

              {/* Attachment */}
              {ticket.attachment && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                      {isAttachmentImage ? (
                        <ImageIcon className="h-3 w-3" />
                      ) : (
                        <Video className="h-3 w-3" />
                      )}
                      Attachment
                    </p>
                    {isAttachmentImage && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={ticket.attachment}
                        alt="Ticket attachment"
                        className="max-w-full rounded-lg border"
                      />
                    )}
                    {isAttachmentVideo && (
                      <video
                        src={ticket.attachment}
                        controls
                        className="max-w-full rounded-lg border"
                      />
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: Chat */}
        <Card className="flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Chat</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col">
            {/* Messages */}
            <div className="flex-1 space-y-3 overflow-y-auto max-h-[400px] mb-4 pr-1">
              {messages.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  <MessageSquare className="mx-auto h-8 w-8 mb-2" />
                  <p className="text-sm">No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isOwnMessage = msg.senderId === session?.user?.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                          isOwnMessage
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.message}</p>
                        <p
                          className={`mt-1 text-[10px] ${
                            isOwnMessage ? "text-primary-foreground/70" : "text-muted-foreground"
                          }`}
                        >
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                disabled={sending}
              />
              <Button type="submit" size="icon" disabled={sending || !newMessage.trim()}>
                {sending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
