import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type Props = {
  searchParams: Promise<{ error?: string; success?: string }>;
};

export default async function SettingsPage({ searchParams }: Props) {
  const { error, success } = await searchParams;
  const session = await auth();

  const user = await prisma.user.findUnique({
    where: { id: session!.user.id },
  });

  async function updateProfile(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    const username = formData.get("username") as string;

    try {
      await prisma.user.update({
        where: { id: session!.user.id },
        data: { name, username },
      });
    } catch (err: unknown) {
      if (err instanceof Error && "code" in err && err.code === "P2002") {
        redirect("/dashboard/settings?error=username-taken");
      }
      throw err;
    }

    revalidatePath("/dashboard/settings");
    redirect("/dashboard/settings?success=true");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

      {error === "username-taken" && (
        <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          That username is already taken. Try a different one.
        </p>
      )}
      {success === "true" && (
        <p className="mb-4 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
          Profile updated.
        </p>
      )}

      <form action={updateProfile} className="space-y-4 max-w-sm">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            name="name"
            defaultValue={user?.name ?? ""}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            type="text"
            name="username"
            defaultValue={user?.username}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

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
