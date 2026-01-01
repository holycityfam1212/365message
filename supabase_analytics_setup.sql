-- Analytics Tables Setup for 365message
-- Run this in Supabase SQL Editor

-- 1. Create analytics_visits table
CREATE TABLE IF NOT EXISTS analytics_visits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_agent TEXT,
    referrer TEXT
);

-- 2. Create analytics_actions table
CREATE TABLE IF NOT EXISTS analytics_actions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    action_type TEXT NOT NULL, -- 'DRAW' or 'SHARE'
    verse_id INTEGER,
    theme TEXT
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE analytics_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_actions ENABLE ROW LEVEL SECURITY;

-- 4. Create policies to allow INSERT for everyone (anonymous users can track)
CREATE POLICY "Allow anonymous insert on analytics_visits"
ON analytics_visits
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Allow anonymous insert on analytics_actions"
ON analytics_actions
FOR INSERT
TO anon
WITH CHECK (true);

-- 5. Create policies to allow SELECT for authenticated users (for admin dashboard)
CREATE POLICY "Allow anonymous select on analytics_visits"
ON analytics_visits
FOR SELECT
TO anon
USING (true);

CREATE POLICY "Allow anonymous select on analytics_actions"
ON analytics_actions
FOR SELECT
TO anon
USING (true);

-- 6. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_analytics_visits_created_at 
ON analytics_visits(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_analytics_actions_created_at 
ON analytics_actions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_analytics_actions_type 
ON analytics_actions(action_type);

CREATE INDEX IF NOT EXISTS idx_analytics_actions_theme 
ON analytics_actions(theme);

-- Verify tables exist
SELECT 
    'analytics_visits' as table_name,
    COUNT(*) as row_count 
FROM analytics_visits
UNION ALL
SELECT 
    'analytics_actions' as table_name,
    COUNT(*) as row_count 
FROM analytics_actions;
