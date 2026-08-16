import { NextRequest, NextResponse } from "next/server";
import { requireAuthUserId } from "@/lib/clerk/auth";
import { handleApiError } from "@/lib/utils/errors";
import { generateTripRequestSchema } from "@/lib/validations/api";
import { generationService } from "@/services/generation.service";

export async function POST(req: NextRequest) {
  try {
    const userId = await requireAuthUserId();
    const rawBody = await req.json();

    const validatedBody = generateTripRequestSchema.parse(rawBody);
    const result = await generationService.generateItinerary(userId, validatedBody);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}
