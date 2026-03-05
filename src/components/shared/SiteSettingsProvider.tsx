"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface SiteSettings {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  siteAuthor: string;
  twitterUrl: string;
  githubUrl: string;
  linkedinUrl: string;
}

const defaultSettings: SiteSettings = {
  siteName: "BlogForge AI",
  siteDescription: "An AI-powered blogging platform",
  siteUrl: "",
  siteAuthor: "BlogForge AI Team",
  twitterUrl: "",
  githubUrl: "",
  linkedinUrl: "",
};

const SiteSettingsContext = createContext<SiteSettings>(defaultSettings);

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);

  useEffect(() => {
    fetch("/api/site-settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setSettings(data.data);
        }
      })
      .catch(() => {
        // Use defaults on failure
      });
  }, []);

  return (
    <SiteSettingsContext.Provider value={settings}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
