import { NextRequest, NextResponse } from "next/server";
import { requireAuthUserId } from "@/lib/clerk/auth";
import { handleApiError } from "@/lib/utils/errors";
import { updateTripRequestSchema, uuidParamSchema } from "@/lib/validations/api";
import { tripService } from "@/services/trip.service";

interface RouteContext {
  params: Promise<{ tripId: string }>;
}

export async function GET(
  _req: NextRequest,
  context: RouteContext
) {
  try {
    const userId = await requireAuthUserId();
    const { tripId } = await context.params;

    const validTripId = uuidParamSchema.parse(tripId);
    const trip = await tripService.getTripById(userId, validTripId);

    return NextResponse.json({ trip }, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  _req: NextRequest,
  context: RouteContext
) {
  try {
    const userId = await requireAuthUserId();
    const { tripId } = await context.params;

    const validTripId = uuidParamSchema.parse(tripId);
    await tripService.deleteTrip(userId, validTripId);

    return new Response(null, { status: 204 });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(
  req: NextRequest,
  context: RouteContext
) {
  try {
    const userId = await requireAuthUserId();
    const { tripId } = await context.params;

    const validTripId = uuidParamSchema.parse(tripId);
    const rawBody = await req.json();

    const validatedUpdates = updateTripRequestSchema.parse(rawBody);
    const updatedTrip = await tripService.updateTrip(
      userId,
      validTripId,
      validatedUpdates
    );

    return NextResponse.json({ trip: updatedTrip }, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}
