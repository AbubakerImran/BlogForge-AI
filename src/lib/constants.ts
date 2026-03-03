export const siteConfig = {
  name: "BlogForge AI",
  description:
    "An AI-powered blogging platform built with Next.js, featuring intelligent content generation, SEO optimization, and modern design.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  author: "BlogForge AI Team",
};

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "Categories", href: "/categories" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const socialLinks = [
  { label: "Twitter", href: "https://twitter.com", icon: "twitter" },
  { label: "GitHub", href: "https://github.com", icon: "github" },
  { label: "LinkedIn", href: "https://linkedin.com", icon: "linkedin" },
];

export const dashboardLinks = [
  { label: "Dashboard", href: "/dashboard", icon: "layout-dashboard" },
  { label: "Posts", href: "/dashboard/posts", icon: "file-text" },
  { label: "Categories", href: "/dashboard/categories", icon: "folder" },
  { label: "Newsletter", href: "/dashboard/newsletter", icon: "mail" },
  { label: "Analytics", href: "/dashboard/analytics", icon: "bar-chart" },
  { label: "Settings", href: "/dashboard/settings", icon: "settings" },
];

export const adSizes = {
  leaderboard: { width: 728, height: 90 },
  mediumRectangle: { width: 300, height: 250 },
  largeRectangle: { width: 336, height: 280 },
};
