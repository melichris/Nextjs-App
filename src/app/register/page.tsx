import Link from "next/link";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createDatabaseSession } from "@/lib/session";

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function RegisterPage({ searchParams }: Props) {
  const { error } = await searchParams;

  async function register(formData: FormData) {
    "use server";

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password || password.length < 8) {
      redirect("/register?error=invalid");
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      redirect("/register?error=email-taken");
    }

    const usernameBase = email.split("@")[0];
    let username = usernameBase;
    let suffix = 1;
    while (await prisma.user.findUnique({ where: { username } })) {
      username = `${usernameBase}${suffix}`;
      suffix++;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { name, email, username, password: hashedPassword },
    });

    await createDatabaseSession(user.id);
    redirect("/");
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Create an account
      </h1>

      {error === "email-taken" && (
        <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          An account with that email already exists.
        </p>
      )}
      {error === "invalid" && (
        <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          Please enter a valid email and a password of at least 8 characters.
        </p>
      )}

      <form action={register} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            name="name"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            required
            minLength={8}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-md bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800"
        >
          Create account
        </button>
      </form>

      <p className="mt-4 text-sm text-gray-500">
        Already have an account?{" "}
        <Link href="/login" className="text-gray-900 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
