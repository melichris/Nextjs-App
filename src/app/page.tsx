import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PostCard } from "@/components/PostCard";
import { AppLink } from "@/components/ui/AppLink";

export default async function HomePage() {
  const recentPosts = await prisma.post.findMany({
    where: { published: true },
    include: { author: true },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <main className="mx-auto max-w-full px-4 py-16">
      <div className="mb-12 border-b border-line pb-8">
        <h1 className="font-display text-5xl font-semibold text-text-primary tracking-tight">
          Blog Platform
        </h1>
        <p className="mt-3 font-mono text-xs uppercase tracking-wider text-text-tertiary">
          Writing, worth reading
        </p>
      </div>

      {recentPosts.length === 0 ? (
        <p className="text-ink-muted">No posts yet.</p>
      ) : (
        <div>
          {recentPosts.map((post) => (
            <PostCard
              key={post.id}
              slug={post.slug}
              title={post.title}
              content={post.content}
              authorName={post.author.name ?? post.author.username}
              createdAt={post.createdAt}
            />
          ))}
        </div>
      )}

      <AppLink href="/posts" variant="arrow" className="mt-8">
        View all posts →
      </AppLink>
    </main>
  );
}
