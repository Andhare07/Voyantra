export const TRAVEL_STYLES = [
  "luxury",
  "budget",
  "adventure",
  "family",
  "couple",
  "solo",
] as const;

export type TravelStyle = (typeof TRAVEL_STYLES)[number];
