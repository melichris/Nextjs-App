import { prisma } from "@/lib/prisma";
import { PostCard } from "@/components/PostCard";

export default async function PostsPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: { author: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Blog Posts</h1>

      {posts.length === 0 ? (
        <p className="text-gray-500">No posts yet.</p>
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
