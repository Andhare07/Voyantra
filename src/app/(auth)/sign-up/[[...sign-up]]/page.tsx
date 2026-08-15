import { SignUp } from "@clerk/nextjs";

import { clerkAppearance } from "@/lib/clerk/appearance";

export const metadata = {
  title: "Sign Up",
};

export default function SignUpPage() {
  return (
    <SignUp
      appearance={clerkAppearance}
      routing="path"
      path="/sign-up"
      signInUrl="/sign-in"
      fallbackRedirectUrl="/trips"
    />
  );
}
