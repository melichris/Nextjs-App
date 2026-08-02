"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function createPost(formData: FormData) {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const content = formData.get("content") as string;
  const published = formData.get("published") === "on";

  await prisma.post.create({
    data: {
      title,
      slug,
      content,
      published,
      authorId: session.user.id,
    },
  });

  revalidatePath("/dashboard/posts");
  revalidatePath("/posts");
  redirect(`/posts/${slug}`);
}
