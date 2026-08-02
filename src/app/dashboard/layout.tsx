import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 flex gap-8">
      <aside className="w-48 shrink-0">
        <nav className="space-y-1">
          <Link
            href="/dashboard/posts"
            className="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            My Posts
          </Link>
          <Link
            href="/dashboard/settings"
            className="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Settings
          </Link>
        </nav>
      </aside>

      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
