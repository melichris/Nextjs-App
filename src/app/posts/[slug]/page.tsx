import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function PostDetailPage({ params }: Props) {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: { slug },
    include: { author: true },
  });

  if (!post) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <article>
        <h1 className="text-4xl font-bold text-gray-900">{post.title}</h1>

        <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
          <span>{post.author.name ?? post.author.email}</span>
          <span>·</span>
          <time>{new Date(post.createdAt).toLocaleDateString()}</time>
        </div>

        <div className="mt-8 prose prose-gray max-w-none whitespace-pre-wrap text-gray-800">
          {post.content}
        </div>
      </article>
    </main>
  );
}
