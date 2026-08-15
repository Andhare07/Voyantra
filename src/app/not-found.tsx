import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-container flex min-h-[50vh] flex-col items-center justify-center text-center">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="mt-2 text-muted-foreground">
        The page you are looking for does not exist.
      </p>
      <Link
        href="/"
        className="mt-6 text-sm font-medium text-primary hover:underline"
      >
        Return home
      </Link>
    </div>
  );
}
