"use client";

import { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface TocHeading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
  className?: string;
}

function parseHeadings(html: string): TocHeading[] {
  const headings: TocHeading[] = [];
  const regex = /<h([23])\s*[^>]*(?:id=["']([^"']*)["'])?[^>]*>(.*?)<\/h[23]>/gi;
  let match;

  while ((match = regex.exec(html)) !== null) {
    const level = parseInt(match[1], 10);
    const text = match[3].replace(/<[^>]*>/g, "").trim();
    const id = match[2] || text.toLowerCase().replace(/[^\w]+/g, "-");
    headings.push({ id, text, level });
  }

  return headings;
}

export function TableOfContents({ content, className }: TableOfContentsProps) {
  const headings = parseHeadings(content);
  const [activeId, setActiveId] = useState<string>("");

  const handleScroll = useCallback(() => {
    const headingElements = headings
      .map((h) => document.getElementById(h.id))
      .filter(Boolean) as HTMLElement[];

    const scrollY = window.scrollY + 100;

    let current = "";
    for (const el of headingElements) {
      if (el.offsetTop <= scrollY) {
        current = el.id;
      }
    }
    setActiveId(current);
  }, [headings]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  if (headings.length === 0) return null;

  function scrollToHeading(id: string) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <nav className={cn("space-y-1", className)} aria-label="Table of contents">
      <h4 className="mb-3 text-sm font-semibold tracking-tight">
        Table of Contents
      </h4>
      <ul className="space-y-1 text-sm">
        {headings.map((heading) => (
          <li key={heading.id}>
            <button
              onClick={() => scrollToHeading(heading.id)}
              className={cn(
                "w-full text-left transition-colors hover:text-primary",
                heading.level === 3 && "pl-4",
                activeId === heading.id
                  ? "font-medium text-primary"
                  : "text-muted-foreground"
              )}
            >
              {heading.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
