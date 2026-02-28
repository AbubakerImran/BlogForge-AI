import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <span className="text-8xl">🔍</span>
      <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl">
        Page Not Found
      </h1>
      <p className="mt-4 max-w-md text-lg text-muted-foreground">
        Sorry, we couldn&apos;t find the page you&apos;re looking for. It might
        have been moved or no longer exists.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/"
          className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
        >
          Go Back Home
        </Link>
        <Link
          href="/blog"
          className="inline-flex h-11 items-center justify-center rounded-lg border px-6 text-sm font-medium transition hover:bg-muted"
        >
          Browse Blog
        </Link>
      </div>
    </div>
  );
}
