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
import { Skeleton } from "@/components/ui/skeleton";

interface SiteSettingsData {
  siteName: string;
  siteDescription: string;
  siteAuthor: string;
  adsenseId: string;
  resendFromName: string;
  resendFromEmail: string;
  resendAudienceId: string;
  twitterUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  analyticsId: string;
}

export default function SettingsPage() {
  const { toast } = useToast();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingSite, setSavingSite] = useState(false);

  const isSA = session?.user?.role === "SUPERADMIN";

  // Profile fields
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");

  // Site settings (superadmin only)
  const [siteSettings, setSiteSettings] = useState<SiteSettingsData>({
    siteName: "",
    siteDescription: "",
    siteAuthor: "",
    adsenseId: "",
    resendFromName: "",
    resendFromEmail: "",
    resendAudienceId: "",
    twitterUrl: "",
    githubUrl: "",
    linkedinUrl: "",
    analyticsId: "",
  });

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          if (data.data?.user) {
            const user = data.data.user;
            setName(user.name || "");
            setTwitterUrl(user.twitterUrl || "");
            setGithubUrl(user.githubUrl || "");
            setLinkedinUrl(user.linkedinUrl || "");
          }
          if (data.data?.siteSettings) {
            const s = data.data.siteSettings;
            setSiteSettings({
              siteName: s.siteName || "",
              siteDescription: s.siteDescription || "",
              siteAuthor: s.siteAuthor || "",
              adsenseId: s.adsenseId || "",
              resendFromName: s.resendFromName || "",
              resendFromEmail: s.resendFromEmail || "",
              resendAudienceId: s.resendAudienceId || "",
              twitterUrl: s.twitterUrl || "",
              githubUrl: s.githubUrl || "",
              linkedinUrl: s.linkedinUrl || "",
              analyticsId: s.analyticsId || "",
            });
          }
        }
      } catch {
        // fallback to session data
        if (session?.user) {
          setName(session.user.name || "");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, [session]);

  async function handleSaveProfile() {
    // Validate password fields
    if (newPassword && !currentPassword) {
      toast({ title: "Error", description: "Current password is required when setting a new password.", variant: "destructive" });
      return;
    }
    if (currentPassword && !newPassword) {
      toast({ title: "Error", description: "New password is required when providing current password.", variant: "destructive" });
      return;
    }

    setSavingProfile(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "profile",
          name,
          currentPassword: currentPassword || undefined,
          newPassword: newPassword || undefined,
          twitterUrl,
          githubUrl,
          linkedinUrl,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: "Profile updated", description: "Your profile has been saved successfully." });
        setCurrentPassword("");
        setNewPassword("");
      } else {
        toast({ title: "Error", description: data.error || "Failed to save profile.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to save profile.", variant: "destructive" });
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleSaveSiteSettings() {
    setSavingSite(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "site", ...siteSettings }),
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: "Site settings updated", description: "Site settings have been saved." });
      } else {
        toast({ title: "Error", description: data.error || "Failed to save settings.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to save settings.", variant: "destructive" });
    } finally {
      setSavingSite(false);
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

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

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
                  Role: {session.user.role === "SUPERADMIN" ? "Super Admin" : session.user.role?.toLowerCase() || "user"}
                </p>
              </div>
            </div>
          )}
          <Separator />
          <div className="space-y-2">
            <Label htmlFor="profileName">Name</Label>
            <Input
              id="profileName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password to change"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password (min 6 characters)"
            />
          </div>
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

      {/* Social Links */}
      <Card>
        <CardHeader>
          <CardTitle>Social Links</CardTitle>
          <CardDescription>Your social links will be displayed with your posts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="twitterUrl">Twitter URL</Label>
            <Input
              id="twitterUrl"
              type="url"
              value={twitterUrl}
              onChange={(e) => setTwitterUrl(e.target.value)}
              placeholder="https://twitter.com/username"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="githubUrl">GitHub URL</Label>
            <Input
              id="githubUrl"
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/username"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
            <Input
              id="linkedinUrl"
              type="url"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://linkedin.com/in/username"
            />
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSaveProfile} disabled={savingProfile} className="w-full">
        {savingProfile ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Save className="mr-2 h-4 w-4" />
        )}
        Save Profile
      </Button>

      {/* Superadmin-only: Site Settings */}
      {isSA && (
        <>
          <Separator className="my-6" />
          <h2 className="text-2xl font-bold tracking-tight">Site Settings</h2>

          <Card>
            <CardHeader>
              <CardTitle>General</CardTitle>
              <CardDescription>Configure your site name, description, and other general settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  value={siteSettings.siteName}
                  onChange={(e) => setSiteSettings((p) => ({ ...p, siteName: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={siteSettings.siteDescription}
                  onChange={(e) => setSiteSettings((p) => ({ ...p, siteDescription: e.target.value }))}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteAuthor">Site Author</Label>
                <Input
                  id="siteAuthor"
                  value={siteSettings.siteAuthor}
                  onChange={(e) => setSiteSettings((p) => ({ ...p, siteAuthor: e.target.value }))}
                  placeholder="Author name"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Email / Newsletter</CardTitle>
              <CardDescription>Configure email sending settings for newsletters.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="resendFromName">From Name</Label>
                <Input
                  id="resendFromName"
                  value={siteSettings.resendFromName}
                  onChange={(e) => setSiteSettings((p) => ({ ...p, resendFromName: e.target.value }))}
                  placeholder="BlogForge"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="resendFromEmail">From Email</Label>
                <Input
                  id="resendFromEmail"
                  type="email"
                  value={siteSettings.resendFromEmail}
                  onChange={(e) => setSiteSettings((p) => ({ ...p, resendFromEmail: e.target.value }))}
                  placeholder="noreply@yourdomain.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="resendAudienceId">Resend Audience ID</Label>
                <Input
                  id="resendAudienceId"
                  value={siteSettings.resendAudienceId}
                  onChange={(e) => setSiteSettings((p) => ({ ...p, resendAudienceId: e.target.value }))}
                  placeholder="your-resend-audience-id"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Site Social Links</CardTitle>
              <CardDescription>Social links displayed on the site footer and about page.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteTwitterUrl">Twitter URL</Label>
                <Input
                  id="siteTwitterUrl"
                  type="url"
                  value={siteSettings.twitterUrl}
                  onChange={(e) => setSiteSettings((p) => ({ ...p, twitterUrl: e.target.value }))}
                  placeholder="https://twitter.com/yoursite"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteGithubUrl">GitHub URL</Label>
                <Input
                  id="siteGithubUrl"
                  type="url"
                  value={siteSettings.githubUrl}
                  onChange={(e) => setSiteSettings((p) => ({ ...p, githubUrl: e.target.value }))}
                  placeholder="https://github.com/yoursite"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteLinkedinUrl">LinkedIn URL</Label>
                <Input
                  id="siteLinkedinUrl"
                  type="url"
                  value={siteSettings.linkedinUrl}
                  onChange={(e) => setSiteSettings((p) => ({ ...p, linkedinUrl: e.target.value }))}
                  placeholder="https://linkedin.com/company/yoursite"
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
                  value={siteSettings.adsenseId}
                  onChange={(e) => setSiteSettings((p) => ({ ...p, adsenseId: e.target.value }))}
                  placeholder="ca-pub-XXXXXXXXXXXXXXXX"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="analyticsId">Google Analytics ID</Label>
                <Input
                  id="analyticsId"
                  value={siteSettings.analyticsId}
                  onChange={(e) => setSiteSettings((p) => ({ ...p, analyticsId: e.target.value }))}
                  placeholder="G-XXXXXXXXXX"
                />
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleSaveSiteSettings} disabled={savingSite} className="w-full">
            {savingSite ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Site Settings
          </Button>
        </>
      )}
    </div>
  );
}
