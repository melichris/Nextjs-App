import Link from "next/link";
import { LogIn, LogOut } from "lucide-react";
import { auth, signOut } from "@/auth";
import { ThemeToggle } from "@/components/themeToggle";

export async function Navbar() {
  const session = await auth();

  return (
    <header className="border-b border-line bg-bg">
      <div className="mx-auto max-w-[1443px] px-4 py-6 flex items-center justify-between">
        <Link href="/" className="font-display text-2xl font-semibold text-ink tracking-tight">
          Blog Platform
        </Link>

        <nav className="flex items-center gap-5">
          <Link
            href="/posts"
            className="font-mono text-xs uppercase tracking-wider text-ink-muted hover:text-accent transition"
          >
            Posts
          </Link>

          {session?.user ? (
            <>
              <Link
                href="/dashboard/posts"
                className="font-mono text-xs uppercase tracking-wider text-ink-muted hover:text-accent transition"
              >
                Dashboard
              </Link>
              <span className="font-mono text-xs text-ink-muted">
                {session.user.name ?? session.user.username}
                {session.user.role === "ADMIN" && (
                  <span className="ml-1 text-accent">· admin</span>
                )}
              </span>
              <form action={async () => { "use server"; await signOut(); }}>
                <button className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-ink-muted hover:text-accent transition">
                  <LogOut className="w-3.5 h-3.5" />
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-ink-muted hover:text-accent transition"
            >
              <LogIn className="w-3.5 h-3.5" />
              Sign in
            </Link>
          )}

          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
