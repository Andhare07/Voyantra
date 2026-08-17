"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Compass,
  DollarSign,
  Hotel as HotelIcon,
  MapPin,
  Sparkles,
  Trash2,
  Utensils,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Star,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/shared/glass-card";
import type { Trip } from "@/types/trip";
import type { TripDetailResponse } from "@/types/api";
import type { CostSummary, TripItinerary } from "@/types/itinerary";

interface PageProps {
  params: Promise<{ tripId: string }>;
}

export default function TripDetailPage({ params }: PageProps) {
  const { tripId } = use(params);
  const router = useRouter();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [selectedDay, setSelectedDay] = useState<number>(1);

  useEffect(() => {
    async function fetchTrip() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/trips/${tripId}`);
        if (res.status === 404) {
          setError("Trip not found or you do not have permission to view it.");
          return;
        }
        if (!res.ok) {
          throw new Error("Failed to load trip details.");
        }
        const data = (await res.json()) as TripDetailResponse;
        setTrip(data.trip);
      } catch (err) {
        console.error("Error loading trip detail:", err);
        setError("An unexpected error occurred while loading this itinerary.");
      } finally {
        setIsLoading(false);
      }
    }

    if (tripId) {
      fetchTrip();
    }
  }, [tripId]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this trip? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/trips/${tripId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete trip.");
      }

      router.push("/trips");
    } catch (err) {
      console.error("Error deleting trip:", err);
      alert("Failed to delete trip. Please try again.");
      setIsDeleting(false);
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="space-y-6 pb-12">
        <div className="h-6 w-32 bg-surface rounded animate-pulse" />
        <GlassCard className="p-8 space-y-4 animate-pulse">
          <div className="h-8 w-1/3 bg-surface rounded-lg" />
          <div className="h-4 w-1/4 bg-surface rounded" />
          <div className="grid grid-cols-4 gap-4 border-t border-border pt-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 bg-surface rounded" />
            ))}
          </div>
        </GlassCard>
      </div>
    );
  }

  // Error / 404 State
  if (error || !trip) {
    return (
      <div className="space-y-6 pb-12">
        <Link
          href="/trips"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Trips
        </Link>
        <GlassCard className="p-12 text-center space-y-4 max-w-xl mx-auto my-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <AlertCircle className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-foreground">Unable to Open Trip</h2>
            <p className="text-sm text-muted-foreground">{error || "Trip not found."}</p>
          </div>
          <div className="pt-2">
            <Button asChild variant="outline">
              <Link href="/trips">Return to My Trips</Link>
            </Button>
          </div>
        </GlassCard>
      </div>
    );
  }

  const itinerary = trip.itinerary as unknown as TripItinerary;
  const costSummary = trip.cost_summary as unknown as CostSummary;
  const budgetUsd = Number(trip.budget_usd) || 0;
  const totalCost = Number(costSummary?.total) || 0;
  const isUnderBudget = totalCost <= budgetUsd;
  const absDelta = Math.abs(totalCost - budgetUsd);

  const currentDayPlan =
    itinerary?.days?.find((d) => d.dayNumber === selectedDay) ||
    itinerary?.days?.[0];

  const formattedCreatedDate = new Date(trip.created_at).toLocaleDateString(
    undefined,
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );

  return (
    <div className="space-y-8 pb-12 animate-in fade-in-50 duration-200">
      {/* Navigation & Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/trips"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Trips
        </Link>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleDelete}
          disabled={isDeleting}
          className="gap-2 border-destructive/30 text-destructive hover:bg-destructive/10"
        >
          {isDeleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
          Delete Trip
        </Button>
      </div>

      {/* Top Banner Card */}
      <GlassCard className="p-6 md:p-8">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-ocean/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-ocean">
              <Compass className="h-3.5 w-3.5" />
              {trip.travel_style} Style
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-surface px-3 py-1 text-xs font-medium text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              {trip.days} {trip.days === 1 ? "Day" : "Days"}
            </span>
            <span className="text-xs text-muted-foreground">
              • Saved on {formattedCreatedDate}
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {trip.title || trip.destination}
          </h1>
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-mist" />
            {trip.destination}
          </p>
        </div>

        {/* Financial Metrics Strip */}
        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-border/70 pt-6 sm:grid-cols-3">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Planned Budget</p>
            <p className="text-xl font-bold tabular-nums text-foreground">
              ${budgetUsd.toLocaleString()}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Estimated Total</p>
            <p className="text-xl font-bold tabular-nums text-ocean">
              ${totalCost.toLocaleString()}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Budget Variance</p>
            <div className="flex items-center gap-1.5">
              {isUnderBudget ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm font-semibold text-emerald-600">
                    ${absDelta.toLocaleString()} under
                  </span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-4 w-4 text-coral" />
                  <span className="text-sm font-semibold text-coral">
                    ${absDelta.toLocaleString()} over
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Main Content Layout: Timeline & Cost Breakdown */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left 2 Columns: Day-by-Day Plan */}
        <div className="space-y-6 lg:col-span-2">
          {/* Day Tabs */}
          {itinerary?.days && itinerary.days.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {itinerary.days.map((day) => {
                const isCurrent = day.dayNumber === selectedDay;
                return (
                  <button
                    key={day.dayNumber}
                    type="button"
                    onClick={() => setSelectedDay(day.dayNumber)}
                    className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                      isCurrent
                        ? "bg-ocean text-white shadow-md"
                        : "border border-border bg-white/80 text-muted-foreground hover:bg-white hover:text-foreground"
                    }`}
                  >
                    <span>Day {day.dayNumber}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Current Day Schedule */}
          {currentDayPlan && (
            <div className="space-y-6">
              {/* Day Theme */}
              {currentDayPlan.theme && (
                <div className="rounded-xl border border-border bg-white/50 px-4 py-3">
                  <h3 className="text-base font-semibold text-ocean">
                    Day {currentDayPlan.dayNumber}: {currentDayPlan.theme}
                  </h3>
                </div>
              )}

              {/* Day Activities */}
              <div className="space-y-4">
                <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  <Sparkles className="h-4 w-4 text-ocean" />
                  Scheduled Activities
                </h4>

                <div className="space-y-3">
                  {currentDayPlan.slots.map((slot, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-border bg-white/80 p-4 shadow-sm transition-all hover:bg-white"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="rounded-md bg-mist/20 px-2 py-0.5 text-[11px] font-semibold uppercase text-ocean">
                              {slot.period}
                            </span>
                            {slot.activity.durationHours && (
                              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {slot.activity.durationHours}h
                              </span>
                            )}
                          </div>
                          <h5 className="text-base font-semibold text-foreground">
                            {slot.activity.name}
                          </h5>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {slot.activity.description}
                          </p>
                          {slot.activity.location && (
                            <p className="flex items-center gap-1 text-xs text-slate pt-1">
                              <MapPin className="h-3 w-3 text-mist" />
                              {slot.activity.location}
                            </p>
                          )}
                        </div>

                        <div className="shrink-0 text-right">
                          <span className="rounded-lg bg-surface px-2.5 py-1 text-xs font-bold tabular-nums text-ocean">
                            {slot.activity.estimatedCostUSD === 0
                              ? "Free"
                              : `$${slot.activity.estimatedCostUSD}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dining Recommendations */}
              <div className="space-y-4 pt-2">
                <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  <Utensils className="h-4 w-4 text-ocean" />
                  Culinary Recommendations
                </h4>

                <div className="grid gap-3 sm:grid-cols-3">
                  {currentDayPlan.meals.map((meal, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col justify-between rounded-2xl border border-border bg-white/80 p-3.5 shadow-sm"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold uppercase text-coral">
                            {meal.type}
                          </span>
                          <span className="text-xs font-bold tabular-nums text-foreground">
                            ${meal.restaurant.estimatedCostUSD}
                          </span>
                        </div>
                        <h6 className="mt-1 font-semibold text-sm text-foreground leading-snug">
                          {meal.restaurant.name}
                        </h6>
                        <p className="mt-1 text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                          {meal.restaurant.description}
                        </p>
                      </div>

                      {meal.restaurant.cuisine && (
                        <p className="mt-2 text-[11px] text-slate italic">
                          {meal.restaurant.cuisine}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Hotels Section */}
          {itinerary?.hotels && itinerary.hotels.length > 0 && (
            <div className="space-y-4 pt-4">
              <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                <HotelIcon className="h-4 w-4 text-ocean" />
                Recommended Accommodations
              </h4>

              <div className="grid gap-4 sm:grid-cols-2">
                {itinerary.hotels.map((hotel, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col justify-between rounded-2xl border border-border bg-white/80 p-4 shadow-sm"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="rounded-md bg-ocean/10 px-2 py-0.5 text-[11px] font-semibold uppercase text-ocean">
                          {hotel.priceTier || "Recommended"}
                        </span>
                        <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                          {hotel.rating && (
                            <>
                              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                              <span>{hotel.rating}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <h5 className="mt-2 text-base font-semibold text-foreground">
                        {hotel.name}
                      </h5>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                        {hotel.description}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3">
                      <span className="text-xs text-muted-foreground">
                        Estimated / night
                      </span>
                      <span className="text-sm font-bold tabular-nums text-ocean">
                        ${hotel.estimatedCostUSD}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Column: Sticky Estimated Cost Breakdown */}
        {costSummary && (
          <div className="space-y-6">
            <GlassCard className="sticky top-20 p-6 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  Cost Breakdown
                </h3>
                <p className="text-xs text-muted-foreground">
                  Itemized expenses across your {trip.days}-day voyage.
                </p>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <HotelIcon className="h-4 w-4 text-mist" />
                    Lodging
                  </span>
                  <span className="font-semibold tabular-nums">
                    ${Number(costSummary.lodging || 0).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Utensils className="h-4 w-4 text-mist" />
                    Food & Dining
                  </span>
                  <span className="font-semibold tabular-nums">
                    ${Number(costSummary.food || 0).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-mist" />
                    Activities & Tours
                  </span>
                  <span className="font-semibold tabular-nums">
                    ${Number(costSummary.activities || 0).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-mist" />
                    Local Transport
                  </span>
                  <span className="font-semibold tabular-nums">
                    ${Number(costSummary.transport || 0).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-mist" />
                    Miscellaneous
                  </span>
                  <span className="font-semibold tabular-nums">
                    ${Number(costSummary.misc || 0).toLocaleString()}
                  </span>
                </div>

                <div className="border-t border-border pt-3">
                  <div className="flex items-center justify-between text-base">
                    <span className="font-bold text-foreground">Estimated Total</span>
                    <span className="font-bold text-ocean tabular-nums">
                      ${totalCost.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </div>
  );
}
