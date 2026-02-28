"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { Save, Loader2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface Settings {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  authorName: string;
  twitterUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  adsenseId: string;
  resendFromName: string;
  resendFromEmail: string;
}

const STORAGE_KEY = "blogforge-settings";

const defaultSettings: Settings = {
  siteName: process.env.NEXT_PUBLIC_SITE_NAME || "BlogForge AI",
  siteDescription: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || "An AI-powered blogging platform",
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  authorName: process.env.NEXT_PUBLIC_SITE_AUTHOR || "",
  twitterUrl: "",
  githubUrl: "",
  linkedinUrl: "",
  adsenseId: "",
  resendFromName: "",
  resendFromEmail: "",
};

export default function SettingsPage() {
  const { toast } = useToast();
  const { data: session } = useSession();
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(stored) });
      } catch {
        // use defaults
      }
    }
  }, []);

  function updateField(field: keyof Settings, value: string) {
    setSettings((prev) => ({ ...prev, [field]: value }));
  }

  function handleSave() {
    setSaving(true);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      toast({
        title: "Settings saved",
        description: "Your settings have been saved successfully.",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to save settings.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  }

  const userInitials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Settings</h1>

      {/* User Profile */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {session?.user && (
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={session.user.image || undefined}
                  alt={session.user.name || "User"}
                />
                <AvatarFallback className="text-lg">{userInitials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-lg font-semibold">{session.user.name || "User"}</p>
                <p className="text-sm text-muted-foreground">{session.user.email}</p>
                <p className="text-xs text-muted-foreground capitalize mt-1">
                  Role: {(session.user as { role?: string }).role?.toLowerCase() || "user"}
                </p>
              </div>
            </div>
          )}
          <Separator />
          <Button
            variant="destructive"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>General</CardTitle>
          <CardDescription>
            Configure your site name, description, and other general settings.
            For production, set these via environment variables (NEXT_PUBLIC_SITE_NAME, etc.) for proper SEO.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="siteName">Site Name</Label>
            <Input
              id="siteName"
              value={settings.siteName}
              onChange={(e) => updateField("siteName", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="siteDescription">Site Description</Label>
            <Textarea
              id="siteDescription"
              value={settings.siteDescription}
              onChange={(e) => updateField("siteDescription", e.target.value)}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="siteUrl">Site URL</Label>
            <Input
              id="siteUrl"
              value={settings.siteUrl}
              onChange={(e) => updateField("siteUrl", e.target.value)}
              placeholder="https://yourdomain.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="authorName">Author Name</Label>
            <Input
              id="authorName"
              value={settings.authorName}
              onChange={(e) => updateField("authorName", e.target.value)}
              placeholder="Your name"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Email / Newsletter</CardTitle>
          <CardDescription>
            Configure Resend email settings. Set RESEND_FROM_NAME, RESEND_FROM_EMAIL,
            and RESEND_AUDIENCE_ID as environment variables for server-side email delivery.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="resendFromName">From Name</Label>
            <Input
              id="resendFromName"
              value={settings.resendFromName}
              onChange={(e) => updateField("resendFromName", e.target.value)}
              placeholder="BlogForge"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="resendFromEmail">From Email</Label>
            <Input
              id="resendFromEmail"
              value={settings.resendFromEmail}
              onChange={(e) => updateField("resendFromEmail", e.target.value)}
              placeholder="noreply@yourdomain.com"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Social Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="twitterUrl">Twitter URL</Label>
            <Input
              id="twitterUrl"
              value={settings.twitterUrl}
              onChange={(e) => updateField("twitterUrl", e.target.value)}
              placeholder="https://twitter.com/username"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="githubUrl">GitHub URL</Label>
            <Input
              id="githubUrl"
              value={settings.githubUrl}
              onChange={(e) => updateField("githubUrl", e.target.value)}
              placeholder="https://github.com/username"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
            <Input
              id="linkedinUrl"
              value={settings.linkedinUrl}
              onChange={(e) => updateField("linkedinUrl", e.target.value)}
              placeholder="https://linkedin.com/in/username"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Monetization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="adsenseId">Google AdSense ID</Label>
            <Input
              id="adsenseId"
              value={settings.adsenseId}
              onChange={(e) => updateField("adsenseId", e.target.value)}
              placeholder="ca-pub-XXXXXXXXXXXXXXXX"
            />
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={saving} className="w-full">
        {saving ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Save className="mr-2 h-4 w-4" />
        )}
        Save Settings
      </Button>
    </div>
  );
}
