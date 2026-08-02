import Link from "next/link";
import { LogIn, LogOut } from "lucide-react";
import { auth, signIn, signOut } from "@/auth";

// function GoogleIcon() {
//   return (
//     <svg viewBox="0 0 24 24" className="w-4 h-4">
//       <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
//       <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.85A11 11 0 0 0 12 23z" />
//       <path fill="#FBBC05" d="M5.84 14.09A6.6 6.6 0 0 1 5.5 12c0-.73.12-1.43.34-2.09V7.06H2.18A11 11 0 0 0 1 12c0 1.77.43 3.45 1.18 4.94l3.66-2.85z" />
//       <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85C6.71 7.31 9.14 5.38 12 5.38z" />
//     </svg>
//   );
// }

// function GitHubIcon() {
//   return (
//     <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
//       <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.04-.02-2.04-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.08 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.3 3.5 1 .11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6.02 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22 0 1.6-.02 2.89-.02 3.29 0 .32.22.7.83.58C20.56 21.79 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
//     </svg>
//   );
// }

export async function Navbar() {
  const session = await auth();

  return (
    <nav className="border-b border-gray-200">
      <div className="mx-auto max-w-3xl px-4 py-4 flex items-center justify-between">
        <Link href="/" className="font-semibold text-gray-900">
          Blog Platform
        </Link>

        <div className="flex items-center gap-4 text-sm">
          <Link href="/posts" className="text-gray-600 hover:text-gray-900">
            Posts
          </Link>

          {session?.user ? (
            <>
              <Link href="/dashboard/posts" className="text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
              <span className="text-gray-500">
                {session.user.name ?? session.user.username}
                {session.user.role === "ADMIN" && (
                  <span className="ml-1 text-xs text-blue-600">(admin)</span>
                )}
              </span>
              <form action={async () => { "use server"; await signOut(); }}>
                <button className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900">
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900"
            >
              <LogIn className="w-4 h-4" />
              Sign in
            </Link>
            // <div className="relative group">
            //   <button
            //     type="button"
            //     className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 py-2"
            //   >
            //     <LogIn className="w-4 h-4" />
            //     Sign in
            //   </button>

            //   <div
            //     className="absolute right-0 top-full w-48 rounded-lg border border-gray-200 bg-white shadow-lg py-1
            //                opacity-0 invisible translate-y-1
            //                group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
            //                transition-all duration-150"
            //   >
            //     <form
            //       action={async () => {
            //         "use server";
            //         await signIn("github");
            //       }}
            //     >
            //       <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
            //         <GitHubIcon />
            //         Continue with GitHub
            //       </button>
            //     </form>
            //     <form
            //       action={async () => {
            //         "use server";
            //         await signIn("google");
            //       }}
            //     >
            //       <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
            //         <GoogleIcon />
            //         Continue with Google
            //       </button>
            //     </form>
            //   </div>
            // </div>
          )}
        </div>
      </div>
    </nav>
  );
}
