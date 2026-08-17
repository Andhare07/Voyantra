"use client";

import React, { useState } from "react";
import {
  Bookmark,
  Calendar,
  Clock,
  DollarSign,
  Hotel as HotelIcon,
  MapPin,
  Utensils,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Star,
  Compass,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/shared/glass-card";
import type { GenerateTripResponse, GenerateTripRequest } from "@/types/api";

interface ItineraryViewProps {
  data: GenerateTripResponse;
  originalRequest: GenerateTripRequest;
  onSave: () => Promise<void>;
  onEdit: () => void;
  isSaving: boolean;
}

export function ItineraryView({
  data,
  originalRequest,
  onSave,
  onEdit,
  isSaving,
}: ItineraryViewProps) {
  const { itinerary, costSummary, meta } = data;
  const [selectedDay, setSelectedDay] = useState<number>(1);

  const currentDayPlan =
    itinerary.days.find((d) => d.dayNumber === selectedDay) || itinerary.days[0];

  const isUnderBudget = !meta.overBudget && meta.budgetDelta <= 0;
  const absDelta = Math.abs(meta.budgetDelta);

  return (
    <div className="space-y-8 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
      {/* Top Banner & Primary Actions */}
      <GlassCard className="p-6 md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-ocean/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-ocean">
                <Compass className="h-3.5 w-3.5" />
                {originalRequest.travelStyle} Style
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-surface px-3 py-1 text-xs font-medium text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                {originalRequest.days} {originalRequest.days === 1 ? "Day" : "Days"}
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {itinerary.destination}
            </h1>
            <p className="text-sm text-muted-foreground">
              Personalized AI itinerary preview curated for a planned budget of $
              {originalRequest.budgetUsd.toLocaleString()} USD.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onEdit}
              disabled={isSaving}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Modify Inputs
            </Button>
            <Button
              type="button"
              variant="accent"
              onClick={onSave}
              disabled={isSaving}
              className="gap-2 shadow-[var(--shadow-soft)] font-semibold"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving Trip...
                </>
              ) : (
                <>
                  <Bookmark className="h-4 w-4" />
                  Save to My Trips
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Budget Comparison Metric Strip */}
        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-border/70 pt-6 sm:grid-cols-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Planned Budget</p>
            <p className="text-xl font-bold tabular-nums text-foreground">
              ${originalRequest.budgetUsd.toLocaleString()}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Estimated Total</p>
            <p className="text-xl font-bold tabular-nums text-ocean">
              ${costSummary.total.toLocaleString()}
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

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Generation Time</p>
            <p className="text-sm font-medium text-muted-foreground">
              {meta.generationDurationMs
                ? `${(meta.generationDurationMs / 1000).toFixed(1)}s`
                : "AI Verified"}
            </p>
          </div>
        </div>

        {/* Over-budget or custom warnings */}
        {meta.warnings && meta.warnings.length > 0 && (
          <div className="mt-4 rounded-xl border border-coral/30 bg-coral/5 p-3 text-xs text-coral-light font-medium">
            {meta.warnings.map((w, idx) => (
              <p key={idx} className="flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 shrink-0 text-coral" />
                {w}
              </p>
            ))}
          </div>
        )}
      </GlassCard>

      {/* Main Content Layout: Day-by-Day Timeline + Cost Summary */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left 2 Columns: Day Navigation & Activity Timeline */}
        <div className="space-y-6 lg:col-span-2">
          {/* Day Selector Tabs */}
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

          {/* Current Day Content */}
          {currentDayPlan && (
            <div className="space-y-6">
              {/* Day Theme Title */}
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

              {/* Dining & Meals for this day */}
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

          {/* Recommended Hotels Section */}
          {itinerary.hotels && itinerary.hotels.length > 0 && (
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

        {/* Right 1 Column: Sticky Estimated Cost Breakdown Card */}
        <div className="space-y-6">
          <GlassCard className="sticky top-20 p-6 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-foreground">
                Estimated Cost Breakdown
              </h3>
              <p className="text-xs text-muted-foreground">
                Estimated USD totals across all {originalRequest.days} days.
              </p>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2">
                  <HotelIcon className="h-4 w-4 text-mist" />
                  Lodging
                </span>
                <span className="font-semibold tabular-nums">
                  ${costSummary.lodging.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Utensils className="h-4 w-4 text-mist" />
                  Food & Dining
                </span>
                <span className="font-semibold tabular-nums">
                  ${costSummary.food.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-mist" />
                  Activities & Tours
                </span>
                <span className="font-semibold tabular-nums">
                  ${costSummary.activities.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-mist" />
                  Local Transport
                </span>
                <span className="font-semibold tabular-nums">
                  ${costSummary.transport.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-mist" />
                  Miscellaneous
                </span>
                <span className="font-semibold tabular-nums">
                  ${costSummary.misc.toLocaleString()}
                </span>
              </div>

              <div className="border-t border-border pt-3">
                <div className="flex items-center justify-between text-base">
                  <span className="font-bold text-foreground">Estimated Total</span>
                  <span className="font-bold text-ocean tabular-nums">
                    ${costSummary.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="button"
                variant="accent"
                size="lg"
                onClick={onSave}
                disabled={isSaving}
                className="w-full gap-2 font-semibold shadow-[var(--shadow-soft)]"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving Trip...
                  </>
                ) : (
                  <>
                    <Bookmark className="h-4 w-4" />
                    Save This Itinerary
                  </>
                )}
              </Button>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
