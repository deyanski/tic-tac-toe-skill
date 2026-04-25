import { useState, useEffect, useCallback } from 'react';
import { supabase, type LeaderboardRow } from '../lib/supabase';

interface LeaderboardProps {
  refreshTrigger: number;
}

export default function Leaderboard({ refreshTrigger }: LeaderboardProps) {
  const [rows, setRows] = useState<LeaderboardRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from('leaderboard')
      .select('*');

    if (err) {
      setError('FETCH ERROR — RETRY?');
    } else {
      setRows((data as LeaderboardRow[]) ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void fetchLeaderboard();
  }, [fetchLeaderboard, refreshTrigger]);

  return (
    <div className="leaderboard">
      <div className="leaderboard__header">
        <span className="leaderboard__title">// LEADERBOARD //</span>
        <button
          className="leaderboard__refresh ctrl-btn"
          onClick={fetchLeaderboard}
          aria-label="Refresh leaderboard"
        >
          ↺
        </button>
      </div>

      {loading && <div className="leaderboard__state">LOADING...</div>}

      {error && (
        <div className="leaderboard__state leaderboard__state--error">
          {error}
          <button className="leaderboard__retry" onClick={fetchLeaderboard}>RETRY</button>
        </div>
      )}

      {!loading && !error && rows.length === 0 && (
        <div className="leaderboard__state leaderboard__state--empty">
          NO RECORDS YET — BE THE FIRST
        </div>
      )}

      {!loading && !error && rows.length > 0 && (
        <table className="leaderboard__table" role="table">
          <thead>
            <tr>
              <th>#</th>
              <th>PLAYER</th>
              <th>W</th>
              <th>L</th>
              <th>D</th>
              <th>WIN%</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.id} className={i === 0 ? 'leaderboard__row--top' : ''}>
                <td className="leaderboard__rank">{i + 1}</td>
                <td className="leaderboard__player">
                  {row.avatar_url && (
                    <img
                      src={row.avatar_url}
                      alt=""
                      className="leaderboard__avatar"
                      width={16}
                      height={16}
                    />
                  )}
                  <span className="leaderboard__name">
                    {row.username ?? 'UNKNOWN'}
                  </span>
                </td>
                <td className="leaderboard__wins">{row.wins}</td>
                <td>{row.losses}</td>
                <td>{row.draws}</td>
                <td className="leaderboard__pct">{row.win_pct}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
