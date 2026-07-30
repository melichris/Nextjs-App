import Link from "next/link";
import { prisma } from "@/lib/prisma";

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
            <Link
              key={post.id}
              href={`/posts/${post.slug}`}
              className="block rounded-lg border border-gray-200 p-6 hover:border-gray-300 hover:shadow-sm transition"
            >
              <h2 className="text-xl font-semibold text-gray-900">
                {post.title}
              </h2>
              <p className="mt-2 text-gray-600 line-clamp-2">
                {post.content}
              </p>
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                <span>{post.author.name ?? post.author.email}</span>
                <span>·</span>
                <time>{new Date(post.createdAt).toLocaleDateString()}</time>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
