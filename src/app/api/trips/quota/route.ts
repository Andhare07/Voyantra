import { NextResponse } from "next/server";
import { requireAuthUserId } from "@/lib/clerk/auth";
import { handleApiError } from "@/lib/utils/errors";
import { rateLimitService } from "@/services/rate-limit.service";

export async function GET() {
  try {
    const userId = await requireAuthUserId();
    const quota = await rateLimitService.getQuotaStatus(userId);

    return NextResponse.json(quota, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}
