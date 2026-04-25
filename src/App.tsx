import { useEffect, useState } from 'react';
import { useGame } from './hooks/useGame';
import { useAuth } from './hooks/useAuth';
import BoardComponent from './components/Board';
import StatusBar from './components/StatusBar';
import Controls from './components/Controls';
import LoginButton from './components/LoginButton';
import Leaderboard from './components/Leaderboard';

export default function App() {
  const { user, loading: authLoading, signIn, signOut } = useAuth();
  const game = useGame(user?.id ?? null);
  const [leaderboardTick, setLeaderboardTick] = useState(0);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const username = (user?.user_metadata?.['user_name'] as string | undefined) ?? null;
  const avatarUrl = (user?.user_metadata?.['avatar_url'] as string | undefined) ?? null;

  function handleReset() {
    game.resetGame();
    setLeaderboardTick((t) => t + 1);
  }

  useEffect(() => {
    if (!showLeaderboard || !user) return;
    setLeaderboardTick((t) => t + 1);
  }, [showLeaderboard, user?.id]);

  return (
    <div className="app-root" data-theme={game.theme}>
      <div className="scanlines" aria-hidden="true" />
      <div className="app-container">
        <header className="app-header">
          <h1 className="app-title">
            TIC<span className="app-title__accent">-</span>TAC
            <span className="app-title__accent">-</span>TOE
          </h1>
          <p className="app-subtitle">VS. MACHINE</p>
        </header>

        <div className="auth-bar">
          <LoginButton
            onSignIn={signIn}
            onSignOut={signOut}
            loading={authLoading}
            username={username}
            avatarUrl={avatarUrl}
          />
          <div className="auth-bar__board-wrap">
            <button
              className={`ctrl-btn ctrl-btn--board ${showLeaderboard ? 'ctrl-btn--active' : ''}`}
              onClick={() => {
                setShowLeaderboard((v) => !v);
                setLeaderboardTick((t) => t + 1);
              }}
            >
              {showLeaderboard ? '[BOARD ▲]' : '[BOARD ▼]'}
            </button>
            {!user && !authLoading && (
              <span className="board-lock-hint">sign in required</span>
            )}
          </div>
        </div>

        {showLeaderboard && user && (
          <Leaderboard refreshTrigger={leaderboardTick} enabled={Boolean(user)} />
        )}

        {showLeaderboard && !user && (
          <div className="leaderboard leaderboard--locked" role="status" aria-live="polite">
            <div className="leaderboard__header">
              <span className="leaderboard__title">// LEADERBOARD //</span>
            </div>
            <div className="leaderboard__state leaderboard__state--auth">
              {authLoading ? 'CHECKING SESSION...' : 'SIGN IN TO VIEW LEADERBOARD'}
              {!authLoading && (
                <button className="leaderboard__signin" onClick={signIn}>
                  SIGN IN WITH GITHUB
                </button>
              )}
            </div>
          </div>
        )}

        <StatusBar
          status={game.status}
          winner={game.winner}
          currentPlayer={game.currentPlayer}
          isAITurn={game.isAITurn}
        />

        <BoardComponent
          board={game.board}
          winLine={game.winLine}
          isPlayerTurn={!game.isAITurn && game.status === 'playing'}
          onCellClick={game.handleCellClick}
        />

        <Controls
          difficulty={game.difficulty}
          theme={game.theme}
          onDifficultyChange={game.setDifficulty}
          onReset={handleReset}
          onThemeToggle={game.toggleTheme}
        />
      </div>
    </div>
  );
}

