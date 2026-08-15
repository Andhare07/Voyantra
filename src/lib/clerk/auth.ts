import { auth } from "@clerk/nextjs/server";

export async function getAuthUserId(): Promise<string | null> {
  const { userId } = await auth();
  return userId ?? null;
}

export async function requireAuthUserId(): Promise<string> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("UNAUTHORIZED");
  }

  return userId;
}
