"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, Pencil, Trash2, Search, Loader2, Globe } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface Post {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  featured: boolean;
  views: number;
  category: string;
  author?: string;
  authorEmail?: string;
  createdAt: string;
}

interface PostsTableProps {
  posts: Post[];
  isSuperAdmin?: boolean;
}

export default function PostsTable({ posts: initialPosts, isSuperAdmin = false }: PostsTableProps) {
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [indexingPost, setIndexingPost] = useState<Post | null>(null);
  const [indexingStatus, setIndexingStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(search.toLowerCase())
  );

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this post?")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
      }
    } finally {
      setDeletingId(null);
    }
  }

  async function handleIndexPost() {
    if (!indexingPost) return;
    setIndexingStatus("loading");
    const fullUrl = `${window.location.origin}/blog/${indexingPost.slug}`;
    try {
      const res = await fetch("/api/indexing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: fullUrl }),
      });
      const data = await res.json();
      if (res.ok) {
        setIndexingStatus("success");
        toast({ title: "Success", description: "Post submitted for Google indexing." });
      } else {
        setIndexingStatus("error");
        toast({ title: "Error", description: data.error || "Failed to index", variant: "destructive" });
      }
    } catch {
      setIndexingStatus("error");
      toast({ title: "Error", description: "Failed to submit for indexing", variant: "destructive" });
    }
  }

  const colSpan = isSuperAdmin ? 9 : 7;

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle>Posts</CardTitle>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              {isSuperAdmin && <TableHead>Author</TableHead>}
              {isSuperAdmin && <TableHead>Email</TableHead>}
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead className="text-right">Views</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPosts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={colSpan} className="text-center text-muted-foreground">
                  No posts found.
                </TableCell>
              </TableRow>
            ) : (
              filteredPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium max-w-[200px] truncate">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="hover:underline"
                    >
                      {post.title}
                    </Link>
                  </TableCell>
                  {isSuperAdmin && (
                    <TableCell className="whitespace-nowrap">
                      {post.author || "Unknown"}
                    </TableCell>
                  )}
                  {isSuperAdmin && (
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {post.authorEmail}
                    </TableCell>
                  )}
                  <TableCell>
                    <Badge variant="secondary">{post.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={post.published ? "default" : "outline"}>
                      {post.published ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Star
                      className={`h-4 w-4 ${
                        post.featured
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground"
                      }`}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    {post.views.toLocaleString()}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setIndexingPost(post);
                          setIndexingStatus("idle");
                        }}
                        title="Index on Google"
                      >
                        <Globe className="h-4 w-4" />
                        <span className="sr-only">Index</span>
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/dashboard/posts/${post.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(post.id)}
                        disabled={deletingId === post.id}
                      >
                        {deletingId === post.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4 text-destructive" />
                        )}
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>

      {/* Indexing Modal */}
      <Dialog open={!!indexingPost} onOpenChange={() => setIndexingPost(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Google Search Console Indexing</DialogTitle>
          </DialogHeader>
          {indexingPost && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium">{indexingPost.title}</p>
                <p className="text-xs text-muted-foreground">
                  /blog/{indexingPost.slug}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleIndexPost}
                  disabled={indexingStatus === "loading"}
                  className="flex-1"
                >
                  {indexingStatus === "loading" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : indexingStatus === "success" ? (
                    "✓ Submitted Successfully"
                  ) : indexingStatus === "error" ? (
                    "Retry Indexing"
                  ) : (
                    <>
                      <Globe className="mr-2 h-4 w-4" />
                      Start Indexing
                    </>
                  )}
                </Button>
              </div>
              {indexingStatus === "success" && (
                <p className="text-xs text-green-600">
                  URL has been submitted to Google for indexing. It may take some time for Google to process the request.
                </p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
