export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 sm:px-6 md:px-page py-6 sm:py-12">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
