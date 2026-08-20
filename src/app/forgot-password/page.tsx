export default function ForgotPasswordPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <div className="mb-12 border-b border-line pb-8">
        <h1 className="font-display text-5xl font-semibold text-ink tracking-tight">
          Forgot Password
        </h1>
        <p className="mt-3 font-mono text-xs uppercase tracking-wider text-ink-muted">
          Reset your password
        </p>
      </div>

      <form className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-ink">
            Email address
          </label>
          <div className="mt-1">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="block w-full rounded-md border border-line bg-bg px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:border-accent focus:ring-accent"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-accent px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-accent/80  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Reset Password
          </button>
        </div>
      </form>
    </main>
  );
}
