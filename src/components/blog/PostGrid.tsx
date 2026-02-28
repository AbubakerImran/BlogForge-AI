import { PostCard } from "@/components/blog/PostCard";
import { cn } from "@/lib/utils";

interface PostGridProps {
  posts: React.ComponentProps<typeof PostCard>["post"][];
  className?: string;
}

export function PostGrid({ posts, className }: PostGridProps) {
  if (!Array.isArray(posts) || posts.length === 0) return null;

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3",
        className
      )}
    >
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
