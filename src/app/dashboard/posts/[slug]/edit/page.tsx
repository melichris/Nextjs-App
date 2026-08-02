import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ error?: string }>;
};

export default async function EditPostPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { error } = await searchParams;
  const session = await auth();

  const post = await prisma.post.findUnique({ where: { slug } });

  if (!post) {
    notFound();
  }

  const isOwner = post.authorId === session!.user.id;
  const isAdmin = session!.user.role === "ADMIN";

  if (!isOwner && !isAdmin) {
    redirect("/dashboard/posts");
  }

  async function updatePost(formData: FormData) {
    "use server";
    const title = formData.get("title") as string;
    const newSlug = formData.get("slug") as string;
    const content = formData.get("content") as string;
    const published = formData.get("published") === "on";

    try {
      await prisma.post.update({
        where: { id: post!.id },
        data: { title, slug: newSlug, content, published },
      });
    } catch (err: unknown) {
      if (err instanceof Error && "code" in err && err.code === "P2002") {
        redirect(`/dashboard/posts/${slug}/edit?error=slug-taken`);
      }
      throw err;
    }

    revalidatePath("/dashboard/posts");
    revalidatePath(`/posts/${slug}`);
    revalidatePath(`/posts/${newSlug}`);
    redirect(`/posts/${newSlug}`);
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Post</h1>

      {error === "slug-taken" && (
        <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          That URL slug is already used by another post.
        </p>
      )}

      <form action={updatePost} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            name="title"
            defaultValue={post!.title}
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Slug (URL)
          </label>
          <input
            type="text"
            name="slug"
            defaultValue={post!.slug}
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
          <p className="mt-1 text-xs text-gray-500">
            Changing this changes the postURL — old links will break.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <textarea
            name="content"
            rows={8}
            defaultValue={post!.content}
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            name="published"
            defaultChecked={post!.published}
          />
          Published
        </label>

        <button
          type="submit"
          className="rounded-md bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800"
        >
          Save changes
        </button>
      </form>
    </div>
  );
}
