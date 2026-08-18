import { GlassCard } from "@/components/shared/glass-card";
import { User, Shield } from "lucide-react";

export const metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          Settings
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Manage your account profile and authentication preferences.
        </p>
      </div>

      <GlassCard className="p-4 sm:p-6 md:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-ocean/10 text-ocean">
            <User className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-foreground">
              Account Management
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Your profile and security are secured by Clerk authentication.
            </p>
          </div>
        </div>

        <div className="border-t border-border/60 pt-4 text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
          <Shield className="h-4 w-4 text-mist shrink-0" />
          <span>Click your avatar in the navigation bar to manage profile, email, and password settings.</span>
        </div>
      </GlassCard>
    </div>
  );
}
