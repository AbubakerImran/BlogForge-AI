import Image from "next/image";
import Link from "next/link";
import { Clock, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, formatDate } from "@/lib/utils";

interface FeaturedPostProps {
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

export function FeaturedPost({ post, className }: FeaturedPostProps) {
  const initials = post.author.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() ?? "?";

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-xl shadow-lg",
        className
      )}
    >
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative aspect-[21/9] min-h-[320px] w-full md:min-h-[420px]">
          {post.featuredImage ? (
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              priority
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="100vw"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
            <div className="mb-4 flex items-center gap-2">
              <Badge className="bg-yellow-500 text-yellow-950 hover:bg-yellow-500/90">
                <Star className="mr-1 h-3 w-3" />
                Featured
              </Badge>
              {post.category && (
                <Badge
                  style={{ backgroundColor: post.category.color ?? undefined }}
                >
                  {post.category.name}
                </Badge>
              )}
            </div>

            <h2 className="mb-3 max-w-3xl text-2xl font-bold leading-tight tracking-tight text-white md:text-4xl lg:text-5xl">
              {post.title}
            </h2>

            {post.excerpt && (
              <p className="mb-4 max-w-2xl line-clamp-2 text-sm text-white/80 md:text-base">
                {post.excerpt}
              </p>
            )}

            <div className="flex items-center gap-3 text-sm text-white/70">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 border-2 border-white/30">
                  <AvatarImage src={post.author.image ?? undefined} alt={post.author.name ?? ""} />
                  <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                </Avatar>
                <span className="font-medium text-white">{post.author.name}</span>
              </div>
              <span className="text-white/50">·</span>
              <time dateTime={new Date(post.createdAt).toISOString()}>
                {formatDate(post.createdAt)}
              </time>
              {post.readTime && (
                <>
                  <span className="text-white/50">·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {post.readTime} min read
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
