export const metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  return (
    <div>
      <h1>Settings</h1>
      <p className="mt-2 text-muted-foreground">
        Account settings will be managed via Clerk.
      </p>
    </div>
  );
}
