import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, formatDate } from "@/lib/utils";

interface PostCardProps {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    featuredImage: string | null;
    readTime: number | null;
    createdAt: Date | string;
    author: {
      name: string | null;
      image: string | null;
    };
    category: {
      name: string;
      slug: string;
      color: string | null;
    } | null;
  };
  className?: string;
}

export function PostCard({ post, className }: PostCardProps) {
  const initials = post.author.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() ?? "?";

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg",
        className
      )}
    >
      <Link href={`/blog/${post.slug}`} className="relative aspect-[16/9] overflow-hidden">
        {post.featuredImage ? (
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-blue-500 to-purple-600" />
        )}
        {post.category && (
          <Badge
            className="absolute left-3 top-3 z-10"
            style={{ backgroundColor: post.category.color ?? undefined }}
          >
            {post.category.name}
          </Badge>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link href={`/blog/${post.slug}`}>
          <h3 className="mb-2 line-clamp-2 text-lg font-semibold leading-tight tracking-tight transition-colors group-hover:text-primary">
            {post.title}
          </h3>
        </Link>

        {post.excerpt && (
          <p className="mb-4 line-clamp-3 flex-1 text-sm text-muted-foreground">
            {post.excerpt}
          </p>
        )}

        <div className="mt-auto flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={post.author.image ?? undefined} alt={post.author.name ?? ""} />
              <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
            </Avatar>
            <span className="font-medium">{post.author.name}</span>
          </div>
          <span className="text-muted-foreground/60">·</span>
          <time dateTime={new Date(post.createdAt).toISOString()}>
            {formatDate(post.createdAt)}
          </time>
          {post.readTime && (
            <>
              <span className="text-muted-foreground/60">·</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {post.readTime} min read
              </span>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
