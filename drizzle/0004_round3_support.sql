-- Migration to ensure Round 3 support is properly set up
-- This migration adds any missing columns and ensures the schema is up to date

-- Ensure round_3_points column exists (it should already exist from the schema)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'player_stats' AND column_name = 'round_3_points') THEN
        ALTER TABLE player_stats ADD COLUMN round_3_points integer DEFAULT 0;
    END IF;
END $$;

-- Update the round enum to include round_3 if not already present
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'round_3' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'round')) THEN
        ALTER TYPE round ADD VALUE 'round_3';
    END IF;
END $$;

-- Add any missing indexes for performance
CREATE INDEX IF NOT EXISTS idx_player_actions_target ON player_actions(target);
CREATE INDEX IF NOT EXISTS idx_player_actions_game_session_target ON player_actions(game_session_id, target);
CREATE INDEX IF NOT EXISTS idx_player_stats_round3_points ON player_stats(round_3_points);