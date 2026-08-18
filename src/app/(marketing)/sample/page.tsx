import { GlassCard } from "@/components/shared/glass-card";

export const metadata = {
  title: "Sample Itinerary",
};

export default function SamplePage() {
  return (
    <section className="page-container">
      <h1>Sample Itinerary</h1>
      <p className="mt-2 text-muted-foreground">
        Static sample itinerary placeholder — full demo content coming soon.
      </p>
      <GlassCard className="mt-8 p-5 sm:p-6">
        <p className="text-sm font-medium text-muted-foreground">
          Paris, France — 3 days · Couple · Budget $1,200
        </p>
        <p className="mt-3 text-sm text-foreground">
          Day-by-day itinerary content will be loaded from static data.
        </p>
      </GlassCard>
    </section>
  );
}
