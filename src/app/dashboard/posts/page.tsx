import Link from "next/link";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function DashboardPostsPage() {
  const session = await auth();

  const posts = await prisma.post.findMany({
    where: { authorId: session!.user.id },
    orderBy: { createdAt: "desc" },
  });

  async function deletePost(formData: FormData) {
    "use server";
    const postId = formData.get("postId") as string;

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post || post.authorId !== session!.user.id) {
      throw new Error("Not authorized to delete this post");
    }

    await prisma.post.delete({ where: { id: postId } });
    revalidatePath("/dashboard/posts");
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Posts</h1>
        <Link
          href="/posts/new"
          className="rounded-md bg-gray-900 px-3 py-1.5 text-sm text-white hover:bg-gray-800"
        >
          New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="text-gray-500">You haven't written any posts yet.</p>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
            >
              <div>
                <p className="font-medium text-gray-900">{post.title}</p>
                <p className="text-xs text-gray-500">
                  {post.published ? "Published" : "Draft"} ·{" "}
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Link
                  href={`/dashboard/posts/${post.slug}/edit`}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Edit
                </Link>
                <form action={deletePost}>
                  <input type="hidden" name="postId" value={post.id} />
                  <button
                    type="submit"
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
