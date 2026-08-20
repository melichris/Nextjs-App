import { prisma } from "@/lib/prisma";
import { PostCard } from "@/components/PostCard";

export default async function PostsPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: { author: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto max-w-3xl px-4 section-pad">
      <header className="mb-8">
        <h1>Blog Posts</h1>
        <p className="text-text-secondary">
          Latest articles, technical notes, and updates.
        </p>
      </header>

      {posts.length === 0 ? (
        <div className="surface-card text-center py-12">
          <p className="text-text-tertiary">No posts published yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              slug={post.slug}
              title={post.title}
              content={post.content}
              authorName={post.author.name ?? post.author.email}
              authorUsername={post.author.username}
              createdAt={post.createdAt}
            />
          ))}
        </div>
      )}
    </main>
  );
}
