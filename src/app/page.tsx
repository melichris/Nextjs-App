import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PostCard } from "@/components/PostCard";

export default async function HomePage() {
  const recentPosts = await prisma.post.findMany({
    where: { published: true },
    include: { author: true },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to the blog</h1>
      <p className="text-gray-600 mb-8">Recent posts from our writers.</p>

      {recentPosts.length === 0 ? (
        <p className="text-gray-500">No posts yet.</p>
      ) : (
        <div className="space-y-6">
          {recentPosts.map((post) => (
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

      <Link
        href="/posts"
        className="mt-8 inline-block text-sm font-medium text-blue-600 hover:underline"
      >
        View all posts →
      </Link>
    </main>
  );
}
