import { redirect } from "next/navigation";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminPostsPage() {
  const session = await auth();

  if (session?.user.role !== "ADMIN") {
    redirect("/dashboard/posts");
  }

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: true },
  });

  async function deletePost(formData: FormData) {
    "use server";
    const postId = formData.get("postId") as string;

    const actingSession = await auth();
    if (actingSession?.user.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    await prisma.post.delete({ where: { id: postId } });
    revalidatePath("/dashboard/admin/posts");
    revalidatePath("/posts");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">All Posts</h1>

      <div className="space-y-2">
        {posts.map((post) => (
          <div
            key={post.id}
            className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
          >
            <div>
              <p className="font-medium text-gray-900">{post.title}</p>
              <p className="text-xs text-gray-500">
                by {post.author.name ?? post.author.username} ·{" "}
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
    </div>
  );
}
