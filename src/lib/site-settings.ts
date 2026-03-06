import prisma from "@/lib/prisma";

export interface SiteSettingsData {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  siteAuthor: string;
  resendFromName: string;
  resendFromEmail: string;
  twitterUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  analyticsId: string;
  adsenseId: string;
}

const defaults: SiteSettingsData = {
  siteName: process.env.NEXT_PUBLIC_SITE_NAME || "BlogForge AI",
  siteDescription:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
    "An AI-powered blogging platform built with Next.js, featuring intelligent content generation, SEO optimization, and modern design.",
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  siteAuthor: process.env.NEXT_PUBLIC_SITE_AUTHOR || "BlogForge AI Team",
  resendFromName: process.env.RESEND_FROM_NAME || "BlogForge",
  resendFromEmail: process.env.RESEND_FROM_EMAIL || "noreply@blogforge.dev",
  twitterUrl: "",
  githubUrl: "",
  linkedinUrl: "",
  analyticsId: "",
  adsenseId: "",
};

export async function getSiteSettings(): Promise<SiteSettingsData> {
  try {
    const settings = await prisma.siteSettings.findFirst();
    if (!settings) return defaults;

    return {
      siteName: settings.siteName || defaults.siteName,
      siteDescription: settings.siteDescription || defaults.siteDescription,
      siteUrl: defaults.siteUrl, // always use env for URL
      siteAuthor: settings.siteAuthor || defaults.siteAuthor,
      resendFromName: settings.resendFromName || defaults.resendFromName,
      resendFromEmail: settings.resendFromEmail || defaults.resendFromEmail,
      twitterUrl: settings.twitterUrl || defaults.twitterUrl,
      githubUrl: settings.githubUrl || defaults.githubUrl,
      linkedinUrl: settings.linkedinUrl || defaults.linkedinUrl,
      analyticsId: settings.analyticsId || defaults.analyticsId,
      adsenseId: settings.adsenseId || defaults.adsenseId,
    };
  } catch {
    return defaults;
  }
}
