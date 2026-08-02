import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminUsersPage() {
  const session = await auth();

  if (session?.user.role !== "ADMIN") {
    redirect("/dashboard/posts");
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    include: { _count: { select: { posts: true } } },
  });

  async function toggleRole(formData: FormData) {
    "use server";
    const userId = formData.get("userId") as string;
    const currentRole = formData.get("currentRole") as string;

    const actingSession = await auth();
    if (actingSession?.user.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    // Prevent an admin from demoting themselves and locking everyone out
    if (userId === actingSession.user.id) {
      throw new Error("You cannot change your own role");
    }

    await prisma.user.update({
      where: { id: userId },
      data: { role: currentRole === "ADMIN" ? "USER" : "ADMIN" },
    });

    revalidatePath("/dashboard/admin/users");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Users</h1>

      <div className="space-y-2">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
          >
            <div>
              <p className="font-medium text-gray-900">
                {user.name ?? user.username}
                {user.id === session.user.id && (
                  <span className="ml-2 text-xs text-gray-400">(you)</span>
                )}
              </p>
              <p className="text-xs text-gray-500">
                {user.email} · {user._count.posts} posts ·{" "}
                <span
                  className={
                    user.role === "ADMIN" ? "text-blue-600" : "text-gray-500"
                  }
                >
                  {user.role}
                </span>
              </p>
            </div>

            {user.id !== session.user.id && (
              <form action={toggleRole}>
                <input type="hidden" name="userId" value={user.id} />
                <input type="hidden" name="currentRole" value={user.role} />
                <button
                  type="submit"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  {user.role === "ADMIN" ? "Demote to User" : "Promote to Admin"}
                </button>
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
