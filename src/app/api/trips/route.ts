import { NextRequest, NextResponse } from "next/server";
import { requireAuthUserId } from "@/lib/clerk/auth";
import { handleApiError } from "@/lib/utils/errors";
import {
  createTripRequestSchema,
  tripPaginationSchema,
} from "@/lib/validations/api";
import { tripService } from "@/services/trip.service";

export async function GET(req: NextRequest) {
  try {
    const userId = await requireAuthUserId();
    const { searchParams } = new URL(req.url);

    const pagination = tripPaginationSchema.parse({
      limit: searchParams.get("limit") ?? undefined,
      offset: searchParams.get("offset") ?? undefined,
    });

    const result = await tripService.getUserTrips(userId, pagination);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await requireAuthUserId();
    const rawBody = await req.json();

    const validatedBody = createTripRequestSchema.parse(rawBody);
    const trip = await tripService.createTrip(userId, validatedBody);

    return NextResponse.json({ trip }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
