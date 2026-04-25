import { useGame } from './hooks/useGame';
import BoardComponent from './components/Board';
import StatusBar from './components/StatusBar';
import Controls from './components/Controls';

export default function App() {
  const game = useGame();

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
          onReset={game.resetGame}
          onThemeToggle={game.toggleTheme}
        />
      </div>
    </div>
  );
}
