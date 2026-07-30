import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PostCard } from "@/components/PostCard";

type Props = {
  params: Promise<{ username: string }>;
};

export default async function AuthorProfilePage({ params }: Props) {
  const { username } = await params;

  const author = await prisma.user.findUnique({
    where: { username },
    include: {
      posts: {
        where: { published: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!author) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900">
        {author.name ?? author.username}
      </h1>
      <p className="text-gray-500 mt-1">@{author.username}</p>

      <h2 className="mt-10 text-lg font-semibold text-gray-900">
        Posts by {author.name ?? author.username}
      </h2>

      {author.posts.length === 0 ? (
        <p className="mt-4 text-gray-500">No published posts yet.</p>
      ) : (
        <div className="mt-4 space-y-6">
          {author.posts.map((post) => (
            <PostCard
              key={post.id}
              slug={post.slug}
              title={post.title}
              content={post.content}
              authorName={author.name ?? author.username}
              authorUsername={author.username}
              createdAt={post.createdAt}
            />
          ))}
        </div>
      )}
    </main>
  );
}
