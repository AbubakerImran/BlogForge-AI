import { PostCard } from "@/components/blog/PostCard";
import { cn } from "@/lib/utils";

interface RelatedPostsProps {
  posts: React.ComponentProps<typeof PostCard>["post"][];
  className?: string;
}

export function RelatedPosts({ posts, className }: RelatedPostsProps) {
  if (!posts.length) return null;

  return (
    <section className={cn("py-8", className)}>
      <h2 className="mb-6 text-2xl font-bold tracking-tight">Related Posts</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
