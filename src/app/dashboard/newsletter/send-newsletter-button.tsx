"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

export function SendNewsletterButton() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSend() {
    if (!subject.trim() || !content.trim()) {
      toast({ title: "Error", description: "Subject and content are required.", variant: "destructive" });
      return;
    }

    setSending(true);
    try {
      const res = await fetch("/api/newsletter/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, content }),
      });
      const data = await res.json();
      if (res.ok) {
        toast({
          title: "Newsletter sent",
          description: `Sent to ${data.data.sent} subscribers. ${data.data.failed > 0 ? `${data.data.failed} failed.` : ""}`,
        });
        setOpen(false);
        setSubject("");
        setContent("");
      } else {
        toast({ title: "Error", description: data.error || "Failed to send newsletter.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to send newsletter.", variant: "destructive" });
    } finally {
      setSending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Send className="mr-2 h-4 w-4" />
          Send Newsletter
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Newsletter</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="newsletter-subject">Subject</Label>
            <Input
              id="newsletter-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Newsletter subject"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newsletter-content">Content (HTML)</Label>
            <Textarea
              id="newsletter-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="<h1>Hello!</h1><p>Newsletter content here...</p>"
              rows={8}
              required
            />
          </div>
          <Button onClick={handleSend} disabled={sending} className="w-full">
            {sending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            Send to All Subscribers
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
