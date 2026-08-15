import type { Appearance } from "@clerk/types";

export const clerkAppearance: Appearance = {
  variables: {
    colorPrimary: "#0f3d5e",
    colorText: "#1a1d23",
    colorTextSecondary: "#6b7280",
    colorBackground: "#ffffff",
    colorInputBackground: "#f2f4f7",
    colorInputText: "#1a1d23",
    borderRadius: "0.75rem",
    fontFamily: "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
  },
  elements: {
    card: "shadow-[var(--shadow-glass)] border border-white/40 bg-white/80 backdrop-blur-xl rounded-2xl",
    headerTitle: "text-foreground font-semibold",
    headerSubtitle: "text-muted-foreground",
    socialButtonsBlockButton:
      "border border-border bg-white text-foreground hover:bg-muted rounded-xl",
    socialButtonsBlockButtonText: "font-medium",
    formButtonPrimary:
      "bg-primary text-primary-foreground hover:bg-[#1a5278] rounded-xl",
    formFieldInput:
      "rounded-xl border-border bg-muted focus:ring-2 focus:ring-ring",
    footerActionLink: "text-primary hover:text-[#1a5278]",
    identityPreviewEditButton: "text-primary",
    userButtonPopoverCard:
      "shadow-[var(--shadow-glass)] border border-white/40 bg-white/90 backdrop-blur-xl rounded-2xl",
  },
  layout: {
    socialButtonsPlacement: "top",
    socialButtonsVariant: "blockButton",
  },
};
