import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { AuthProvider } from "@/components/shared/AuthProvider";
import { ViewerTokenProvider } from "@/components/shared/ViewerTokenProvider";
import { SiteSettingsProvider } from "@/components/shared/SiteSettingsProvider";
import { LayoutShell } from "@/components/layout/LayoutShell";
import { Toaster } from "@/components/ui/toaster";
import { getSiteSettings } from "@/lib/site-settings";
import "./globals.css";

const geist = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-inter",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: {
      default: settings.siteName,
      template: `%s | ${settings.siteName}`,
    },
    description: settings.siteDescription,
    metadataBase: new URL(settings.siteUrl),
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.variable} font-sans antialiased`}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ViewerTokenProvider>
              <SiteSettingsProvider>
                <LayoutShell>{children}</LayoutShell>
                <Toaster />
              </SiteSettingsProvider>
            </ViewerTokenProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
