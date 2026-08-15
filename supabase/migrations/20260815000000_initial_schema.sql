-- Voyantra Initial Database Schema
-- Migration: 20260815000000_initial_schema.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Trigger function for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. USERS TABLE (Clerk mirror)
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY, -- Clerk user ID (e.g. user_2...)
    email TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 2. TRIPS TABLE
CREATE TABLE IF NOT EXISTS trips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    destination TEXT NOT NULL,
    budget_usd NUMERIC NOT NULL CHECK (budget_usd >= 0),
    days INTEGER NOT NULL CHECK (days >= 1 AND days <= 7),
    travel_style TEXT NOT NULL CHECK (travel_style IN ('luxury', 'budget', 'adventure', 'family', 'couple', 'solo')),
    interests TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
    itinerary JSONB DEFAULT '{}'::JSONB NOT NULL,
    cost_summary JSONB DEFAULT '{}'::JSONB NOT NULL,
    generation_status TEXT DEFAULT 'saved' NOT NULL CHECK (generation_status IN ('saved', 'draft', 'generating', 'failed')),
    prompt_version TEXT DEFAULT 'v1' NOT NULL,
    feedback TEXT CHECK (feedback IN ('positive', 'negative') OR feedback IS NULL),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TRIGGER update_trips_updated_at
    BEFORE UPDATE ON trips
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Index for fast user trip lookups sorted chronologically
CREATE INDEX IF NOT EXISTS idx_trips_user_id_created_at ON trips(user_id, created_at DESC);

-- 3. GENERATION LOGS TABLE (Rate limiting & observability)
CREATE TABLE IF NOT EXISTS generation_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    success BOOLEAN NOT NULL,
    duration_ms INTEGER NOT NULL CHECK (duration_ms >= 0),
    prompt_version TEXT DEFAULT 'v1' NOT NULL,
    error_code TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index for counting generations per user within a time window (e.g., 24h rolling limit)
CREATE INDEX IF NOT EXISTS idx_generation_logs_user_id_created_at ON generation_logs(user_id, created_at DESC);

-- 4. PLACES CACHE TABLE (Global cached Google Places data, backend-only)
CREATE TABLE IF NOT EXISTS places_cache (
    place_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    formatted_address TEXT NOT NULL,
    lat NUMERIC NOT NULL,
    lng NUMERIC NOT NULL,
    types TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
    cached_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL
);

-- Index for cache expiry lookups and maintenance
CREATE INDEX IF NOT EXISTS idx_places_cache_expires_at ON places_cache(expires_at);

-- ROW LEVEL SECURITY (RLS)
-- Architecture Note (docs/03-Architecture.md §5.6, §6.5):
-- MVP uses Next.js server/API routes with Supabase service_role (supabaseAdmin)
-- and application-level authorization via Clerk auth(). RLS is enabled on all tables
-- to block unauthenticated/anonymous direct PostgREST access.
-- The policies below provide defense-in-depth and support Clerk JWT integration.

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE generation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE places_cache ENABLE ROW LEVEL SECURITY;

-- Users RLS Policies (Clerk sub / Supabase JWT)
CREATE POLICY "Users can read own profile"
    ON users FOR SELECT
    USING ((SELECT auth.jwt() ->> 'sub') = id);

CREATE POLICY "Users can update own profile"
    ON users FOR UPDATE
    USING ((SELECT auth.jwt() ->> 'sub') = id);

-- Trips RLS Policies (Clerk sub / Supabase JWT)
CREATE POLICY "Users can view own trips"
    ON trips FOR SELECT
    USING ((SELECT auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "Users can insert own trips"
    ON trips FOR INSERT
    WITH CHECK ((SELECT auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "Users can update own trips"
    ON trips FOR UPDATE
    USING ((SELECT auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "Users can delete own trips"
    ON trips FOR DELETE
    USING ((SELECT auth.jwt() ->> 'sub') = user_id);

-- Generation Logs RLS Policies (Clerk sub / Supabase JWT)
CREATE POLICY "Users can view own generation logs"
    ON generation_logs FOR SELECT
    USING ((SELECT auth.jwt() ->> 'sub') = user_id);

-- Places Cache:
-- No public policies. Places cache is internal infrastructure queried and populated
-- strictly by the backend places.service via service_role. Direct client access is denied.
