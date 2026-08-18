"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  MapPin,
  DollarSign,
  Calendar,
  Compass,
  Heart,
  Users,
  User,
  Shield,
  Gem,
  AlertCircle,
  Loader2,
  Info,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/shared/glass-card";
import { TRAVEL_STYLES, type TravelStyle } from "@/lib/constants/travel-styles";
import type { GenerateTripRequest, TripQuotaResponse } from "@/types/api";

const INTEREST_OPTIONS = [
  "Museums & Art",
  "Culinary & Food",
  "Historic Sites",
  "Nature & Outdoors",
  "Nightlife & Bars",
  "Shopping & Markets",
  "Relaxation & Spa",
  "Architecture",
  "Local Culture",
  "Photography",
];

const STYLE_DETAILS: Record<
  TravelStyle,
  { label: string; desc: string; icon: React.ComponentType<{ className?: string }> }
> = {
  luxury: { label: "Luxury", desc: "4-5★ lodging & fine dining", icon: Gem },
  budget: { label: "Budget", desc: "High-value, authentic & local", icon: Shield },
  adventure: { label: "Adventure", desc: "Active exploration & outdoors", icon: Compass },
  family: { label: "Family", desc: "Comfort, kid-friendly & relaxed", icon: Users },
  couple: { label: "Couple", desc: "Romantic, scenic & intimate", icon: Heart },
  solo: { label: "Solo", desc: "Walkable, social & safe", icon: User },
};

interface TripFormProps {
  onSubmit: (data: GenerateTripRequest) => Promise<void>;
  isLoading: boolean;
  initialValues?: Partial<GenerateTripRequest>;
}

export function TripForm({ onSubmit, isLoading, initialValues }: TripFormProps) {
  const [destination, setDestination] = useState(initialValues?.destination || "");
  const [budgetUsd, setBudgetUsd] = useState<string>(
    initialValues?.budgetUsd ? String(initialValues.budgetUsd) : "1500"
  );
  const [days, setDays] = useState<number>(initialValues?.days || 4);
  const [travelStyle, setTravelStyle] = useState<TravelStyle>(
    initialValues?.travelStyle || "couple"
  );
  const [interests, setInterests] = useState<string[]>(
    initialValues?.interests || ["Culinary & Food", "Historic Sites"]
  );

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [quota, setQuota] = useState<TripQuotaResponse | null>(null);

  // Fetch current user generation quota on mount
  useEffect(() => {
    async function fetchQuota() {
      try {
        const res = await fetch("/api/trips/quota");
        if (res.ok) {
          const data = (await res.json()) as TripQuotaResponse;
          setQuota(data);
        }
      } catch (err) {
        console.error("Failed to load generation quota:", err);
      }
    }
    fetchQuota();
  }, []);

  const toggleInterest = (tag: string) => {
    if (interests.includes(tag)) {
      setInterests(interests.filter((i) => i !== tag));
    } else {
      if (interests.length >= 5) return;
      setInterests([...interests, tag]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    const cleanDest = destination.trim();
    if (!cleanDest || cleanDest.length < 2) {
      errors.destination = "Destination must be at least 2 characters.";
    } else if (cleanDest.length > 100) {
      errors.destination = "Destination cannot exceed 100 characters.";
    }

    const numBudget = Number(budgetUsd);
    if (!budgetUsd || isNaN(numBudget) || numBudget <= 0) {
      errors.budgetUsd = "Please enter a valid budget greater than $0.";
    } else if (numBudget > 9999999) {
      errors.budgetUsd = "Budget exceeds maximum limit ($9,999,999).";
    }

    if (days < 1 || days > 7) {
      errors.days = "Trip length must be between 1 and 7 days.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    await onSubmit({
      destination: cleanDest,
      budgetUsd: numBudget,
      days,
      travelStyle,
      interests,
    });
  };

  return (
    <GlassCard className="p-4 sm:p-6 md:p-8">
      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
        {/* Header / Quota note */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Plan Your Voyage
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Specify your destination, budget, and travel preferences.
            </p>
          </div>
          {quota && (
            <div className="inline-flex self-start sm:self-auto items-center gap-1.5 rounded-full border border-mist/30 bg-surface px-3 py-1 text-xs text-muted-foreground">
              <Info className="h-3.5 w-3.5 text-ocean shrink-0" />
              <span>
                {quota.remaining} of {quota.limit} AI generations remaining today
              </span>
            </div>
          )}
        </div>

        {/* 1. Destination Input */}
        <div className="space-y-2">
          <label
            htmlFor="destination"
            className="flex items-center gap-2 text-sm font-semibold text-foreground"
          >
            <MapPin className="h-4 w-4 text-ocean shrink-0" />
            Where would you like to go?
          </label>
          <div className="relative">
            <input
              id="destination"
              type="text"
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
                if (fieldErrors.destination) {
                  setFieldErrors((prev) => ({ ...prev, destination: "" }));
                }
              }}
              placeholder="e.g. Paris, France or Kyoto, Japan"
              disabled={isLoading}
              className={`w-full rounded-xl border bg-white/90 px-3.5 sm:px-4 py-3 text-base text-foreground placeholder:text-slate/60 shadow-sm focus:outline-none focus:ring-2 focus:ring-mist ${
                fieldErrors.destination
                  ? "border-destructive focus:ring-destructive"
                  : "border-border"
              }`}
            />
          </div>
          {fieldErrors.destination && (
            <p className="flex items-center gap-1 text-xs text-destructive">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              {fieldErrors.destination}
            </p>
          )}
        </div>

        {/* 2. Budget & Days Grid */}
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Budget USD */}
          <div className="space-y-2">
            <label
              htmlFor="budgetUsd"
              className="flex items-center gap-2 text-sm font-semibold text-foreground"
            >
              <DollarSign className="h-4 w-4 text-ocean shrink-0" />
              Total Planned Budget (USD)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                $
              </span>
              <input
                id="budgetUsd"
                type="number"
                min="1"
                max="9999999"
                step="50"
                value={budgetUsd}
                onChange={(e) => {
                  setBudgetUsd(e.target.value);
                  if (fieldErrors.budgetUsd) {
                    setFieldErrors((prev) => ({ ...prev, budgetUsd: "" }));
                  }
                }}
                placeholder="1500"
                disabled={isLoading}
                className={`w-full rounded-xl border bg-white/90 pl-8 pr-4 py-3 text-base text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-mist ${
                  fieldErrors.budgetUsd
                    ? "border-destructive focus:ring-destructive"
                    : "border-border"
                }`}
              />
            </div>
            {fieldErrors.budgetUsd && (
              <p className="flex items-center gap-1 text-xs text-destructive">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {fieldErrors.budgetUsd}
              </p>
            )}
          </div>

          {/* Duration in Days */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Calendar className="h-4 w-4 text-ocean shrink-0" />
              Trip Length ({days} {days === 1 ? "day" : "days"})
            </label>
            <div className="flex items-center justify-between gap-1 sm:gap-2">
              {[1, 2, 3, 4, 5, 6, 7].map((num) => {
                const isSelected = days === num;
                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setDays(num)}
                    disabled={isLoading}
                    className={`flex-1 rounded-xl py-2.5 px-0.5 sm:px-2 text-xs sm:text-sm font-semibold transition-all ${
                      isSelected
                        ? "bg-ocean text-white shadow-md scale-[1.02]"
                        : "bg-surface border border-border text-muted-foreground hover:bg-white hover:text-foreground"
                    }`}
                  >
                    {num}d
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3. Travel Style Selector */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Compass className="h-4 w-4 text-ocean shrink-0" />
            Select Your Travel Style
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {TRAVEL_STYLES.map((style) => {
              const info = STYLE_DETAILS[style];
              const Icon = info.icon;
              const isSelected = travelStyle === style;

              return (
                <button
                  key={style}
                  type="button"
                  onClick={() => setTravelStyle(style)}
                  disabled={isLoading}
                  className={`flex flex-col items-start gap-1 rounded-2xl border p-3.5 sm:p-4 text-left transition-all ${
                    isSelected
                      ? "border-ocean bg-ocean/5 shadow-sm ring-1 ring-ocean"
                      : "border-border bg-white/70 hover:bg-white hover:border-mist"
                  }`}
                >
                  <div className="flex w-full items-center justify-between">
                    <span
                      className={`text-sm font-semibold capitalize ${
                        isSelected ? "text-ocean" : "text-foreground"
                      }`}
                    >
                      {info.label}
                    </span>
                    <Icon
                      className={`h-4 w-4 shrink-0 ${
                        isSelected ? "text-ocean" : "text-slate"
                      }`}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground leading-snug">
                    {info.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Interests / Preferences (Multi-Select, Max 5) */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-foreground">
              Interests & Focus Areas
            </label>
            <span className="text-xs text-muted-foreground">
              {interests.length}/5 selected
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {INTEREST_OPTIONS.map((tag) => {
              const isSelected = interests.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleInterest(tag)}
                  disabled={isLoading || (!isSelected && interests.length >= 5)}
                  className={`rounded-xl border px-3.5 py-2 sm:py-1.5 text-xs font-medium min-h-[36px] sm:min-h-0 flex items-center justify-center transition-all ${
                    isSelected
                      ? "border-ocean bg-ocean text-white shadow-sm"
                      : "border-border bg-white text-muted-foreground hover:border-mist hover:text-foreground disabled:opacity-40"
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit Action */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="accent"
            size="lg"
            disabled={isLoading || (quota ? quota.remaining <= 0 : false)}
            className="w-full min-h-[48px] text-base font-semibold shadow-[var(--shadow-soft)]"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Crafting Your Custom Itinerary...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                Generate Itinerary
              </>
            )}
          </Button>

          {quota && quota.remaining <= 0 && (
            <p className="mt-2 text-center text-xs text-destructive">
              You have reached your daily generation limit. Resets at{" "}
              {new Date(quota.resetsAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
              .
            </p>
          )}
        </div>
      </form>
    </GlassCard>
  );
}
