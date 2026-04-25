import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!url || !key) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(url, key);

// ── Types matching the DB schema ──────────────────────────────────

export interface Profile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface Game {
  id: string;
  user_id: string;
  winner: 'X' | 'O' | 'draw';
  difficulty: 'easy' | 'hard';
  created_at: string;
}

export interface LeaderboardRow {
  id: string;
  username: string | null;
  avatar_url: string | null;
  total_games: number;
  wins: number;
  losses: number;
  draws: number;
  win_pct: number;
}
