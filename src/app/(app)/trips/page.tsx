"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Compass,
  MapPin,
  Plus,
  Trash2,
  ArrowRight,
  AlertCircle,
  Loader2,
  Sparkles,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/shared/glass-card";
import type { TripSummary } from "@/types/trip";
import type { TripListResponse } from "@/types/api";

export default function TripsPage() {
  const [trips, setTrips] = useState<TripSummary[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchTrips = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/trips");
      if (!res.ok) {
        throw new Error("Failed to load saved trips.");
      }
      const data = (await res.json()) as TripListResponse;
      setTrips(data.trips || []);
    } catch (err) {
      console.error("Error fetching trips:", err);
      setError("Unable to load your saved trips. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleDeleteTrip = async (tripId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm("Are you sure you want to delete this saved trip?")) {
      return;
    }

    setDeletingId(tripId);
    try {
      const res = await fetch(`/api/trips/${tripId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete trip.");
      }

      setTrips((prev) => prev.filter((t) => t.id !== tripId));
    } catch (err) {
      console.error("Error deleting trip:", err);
      alert("Failed to delete trip. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* Header with Title and Plan New Trip CTA */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            My Trips
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Manage your AI-crafted voyages and view day-by-day itineraries.
          </p>
        </div>

        <Button asChild variant="accent" size="default" className="w-full sm:w-auto gap-2 font-semibold shadow-[var(--shadow-soft)]">
          <Link href="/trips/new">
            <Plus className="h-4 w-4" />
            Plan New Trip
          </Link>
        </Button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-destructive shadow-sm">
          <div className="flex items-center gap-3 text-xs sm:text-sm min-w-0">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span className="break-words">{error}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchTrips}
            className="shrink-0 gap-1.5 border-destructive/30 text-destructive hover:bg-destructive/10"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Retry
          </Button>
        </div>
      )}

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
          {[1, 2].map((i) => (
            <GlassCard key={i} className="p-4 sm:p-6 space-y-4 animate-pulse">
              <div className="flex justify-between items-center">
                <div className="h-5 w-24 bg-surface rounded-full" />
                <div className="h-5 w-16 bg-surface rounded-full" />
              </div>
              <div className="h-6 w-3/4 bg-surface rounded-lg" />
              <div className="h-4 w-1/2 bg-surface rounded" />
              <div className="border-t border-border/60 pt-4 flex justify-between">
                <div className="h-8 w-20 bg-surface rounded" />
                <div className="h-8 w-20 bg-surface rounded" />
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && trips.length === 0 && (
        <GlassCard className="p-6 sm:p-12 text-center space-y-5 max-w-xl mx-auto my-6 sm:my-8">
          <div className="mx-auto flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-ocean/10 text-ocean">
            <Compass className="h-7 w-7 sm:h-8 sm:w-8" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg sm:text-xl font-bold text-foreground">
              No saved trips yet
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
              Plan your first custom journey with AI-optimized daily activities, dining, and cost estimates.
            </p>
          </div>
          <div className="pt-2">
            <Button asChild variant="accent" size="lg" className="w-full sm:w-auto gap-2 font-semibold shadow-[var(--shadow-soft)]">
              <Link href="/trips/new">
                <Sparkles className="h-4 w-4" />
                Plan Your First Voyage
              </Link>
            </Button>
          </div>
        </GlassCard>
      )}

      {/* Trips Grid */}
      {!isLoading && !error && trips.length > 0 && (
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
          {trips.map((trip) => {
            const formattedDate = new Date(trip.createdAt).toLocaleDateString(
              undefined,
              {
                month: "short",
                day: "numeric",
                year: "numeric",
              }
            );

            const isDeleting = deletingId === trip.id;

            return (
              <GlassCard
                key={trip.id}
                className="group relative flex flex-col justify-between p-4 sm:p-6 transition-all duration-200 hover:shadow-[var(--shadow-glass)] hover:border-mist/40 min-w-0"
              >
                <div className="space-y-3.5 sm:space-y-4 min-w-0">
                  {/* Top Badges & Delete Action */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                      <span className="inline-flex items-center gap-1 rounded-full bg-ocean/10 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-ocean">
                        <Compass className="h-3 w-3 shrink-0" />
                        <span className="truncate max-w-[120px]">{trip.travelStyle}</span>
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-surface px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                        <Calendar className="h-3 w-3 shrink-0" />
                        {trip.days} {trip.days === 1 ? "day" : "days"}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleDeleteTrip(trip.id, e)}
                      disabled={isDeleting}
                      title="Delete trip"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg p-2 text-slate transition-colors hover:bg-destructive/10 hover:text-destructive focus:outline-none focus:ring-2 focus:ring-destructive/30"
                    >
                      {isDeleting ? (
                        <Loader2 className="h-4 w-4 animate-spin text-destructive" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {/* Trip Title & Destination */}
                  <div className="space-y-1 min-w-0">
                    <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-ocean break-words">
                      {trip.title || trip.destination}
                    </h2>
                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground truncate">
                      <MapPin className="h-3.5 w-3.5 text-mist shrink-0" />
                      <span className="truncate">{trip.destination}</span>
                      <span className="shrink-0">• {formattedDate}</span>
                    </p>
                  </div>

                  {/* Financial Summary Strip */}
                  <div className="grid grid-cols-2 gap-3 rounded-xl border border-border/60 bg-white/50 p-3">
                    <div className="min-w-0">
                      <span className="text-[11px] text-muted-foreground block truncate">
                        Planned Budget
                      </span>
                      <p className="text-sm font-bold tabular-nums text-foreground truncate">
                        ${trip.budgetUsd.toLocaleString()}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <span className="text-[11px] text-muted-foreground block truncate">
                        Estimated Total
                      </span>
                      <p className="text-sm font-bold tabular-nums text-ocean truncate">
                        ${trip.estimatedTotalUsd.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Link Footer */}
                <div className="mt-5 sm:mt-6 pt-3.5 sm:pt-4 border-t border-border/50 flex justify-end">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto gap-1.5 text-xs font-semibold group-hover:border-ocean/40 group-hover:text-ocean justify-center"
                  >
                    <Link href={`/trips/${trip.id}`}>
                      View Itinerary
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </Button>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
