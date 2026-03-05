"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Github, Twitter, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSiteSettings } from "@/components/shared/SiteSettingsProvider";
import { navLinks } from "@/lib/constants";

const socialIconMap: Record<string, React.ElementType> = {
  twitter: Twitter,
  github: Github,
  linkedin: Linkedin,
};

interface FooterCategory {
  name: string;
  slug: string;
}

export function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [categories, setCategories] = useState<FooterCategory[]>([]);
  const siteSettings = useSiteSettings();

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setCategories(data.data.slice(0, 6));
        }
      })
      .catch(() => {
        // Silently fail
      });
  }, []);

  const dynamicSocialLinks = [
    ...(siteSettings.twitterUrl ? [{ label: "Twitter", href: siteSettings.twitterUrl, icon: "twitter" }] : []),
    ...(siteSettings.githubUrl ? [{ label: "GitHub", href: siteSettings.githubUrl, icon: "github" }] : []),
    ...(siteSettings.linkedinUrl ? [{ label: "LinkedIn", href: siteSettings.linkedinUrl, icon: "linkedin" }] : []),
  ];

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const footerNavLinks = [
    ...navLinks,
    { label: "Privacy Policy", href: "/privacy-policy" },
  ];

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div className="space-y-3">
            <Link href="/" className="inline-block">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {siteSettings.siteName}
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {siteSettings.siteDescription}
            </p>
            {dynamicSocialLinks.length > 0 && (
              <div className="flex items-center gap-3 pt-2">
                {dynamicSocialLinks.map((link) => {
                  const Icon = socialIconMap[link.icon];
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={link.label}
                    >
                      {Icon && <Icon className="h-5 w-5" />}
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              {footerNavLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Categories</h3>
            <ul className="space-y-2">
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <li key={cat.slug}>
                    <Link
                      href={`/category/${cat.slug}`}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))
              ) : (
                <li>
                  <Link
                    href="/categories"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Browse All
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Newsletter</h3>
            <p className="text-sm text-muted-foreground">
              Subscribe to get the latest posts delivered to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-9"
              />
              <Button type="submit" size="sm" disabled={status === "loading"}>
                {status === "loading" ? "..." : "Subscribe"}
              </Button>
            </form>
            {status === "success" && (
              <p className="text-xs text-green-600 dark:text-green-400">
                Thanks for subscribing!
              </p>
            )}
            {status === "error" && (
              <p className="text-xs text-destructive">
                Something went wrong. Please try again.
              </p>
            )}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} {siteSettings.siteName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
