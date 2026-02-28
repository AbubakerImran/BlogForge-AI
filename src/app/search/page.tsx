"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import SearchBar from "@/components/forms/SearchBar";
import { PostGrid } from "@/components/blog/PostGrid";
import { EmptyState } from "@/components/shared/EmptyState";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featuredImage: string | null;
  readTime: number;
  createdAt: string;
  author: { id: string; name: string | null; image: string | null };
  category: { id: string; name: string; slug: string; color: string } | null;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (!query) {
      setResults([]);
      setSearched(false);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(query)}`
        );
        if (res.ok) {
          const data = await res.json();
          setResults(data.posts || data);
        }
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
        setSearched(true);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight">Search</h1>
        <p className="mt-2 text-muted-foreground">
          Find articles, tutorials, and insights.
        </p>
      </div>

      <div className="mb-10 max-w-xl">
        <SearchBar />
      </div>

      {loading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-48 w-full rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      )}

      {!loading && searched && results.length > 0 && (
        <>
          <p className="mb-6 text-sm text-muted-foreground">
            {results.length} result{results.length !== 1 ? "s" : ""} for &quot;{query}&quot;
          </p>
          <PostGrid posts={results} />
        </>
      )}

      {!loading && searched && results.length === 0 && (
        <EmptyState
          icon={Search}
          title="No results found"
          description={`We couldn't find any posts matching "${query}". Try a different search term.`}
          actionLabel="Browse all posts"
          actionHref="/blog"
        />
      )}

      {!loading && !searched && (
        <div className="py-20 text-center text-muted-foreground">
          <Search className="mx-auto mb-4 h-12 w-12 opacity-40" />
          <p className="text-lg">Enter a search term to find articles.</p>
        </div>
      )}
    </div>
  );
}
