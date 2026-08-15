import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";

import { AuroraBackground } from "@/components/shared/aurora-background";
import { clerkAppearance } from "@/lib/clerk/appearance";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Voyantra",
    template: "%s | Voyantra",
  },
  description:
    "AI-powered travel planning — personalized itineraries for your destination, budget, and style.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">
        <ClerkProvider appearance={clerkAppearance}>
          <AuroraBackground>{children}</AuroraBackground>
        </ClerkProvider>
      </body>
    </html>
  );
}
