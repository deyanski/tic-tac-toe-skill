import { GameStatus, Player } from '../game/logic';

interface StatusBarProps {
  status: GameStatus;
  winner: Player | null;
  currentPlayer: Player;
  isAITurn: boolean;
}

export default function StatusBar({ status, winner, currentPlayer, isAITurn }: StatusBarProps) {
  function getMessage(): string {
    if (status === 'won') {
      return winner === 'X' ? '// PLAYER WINS //' : '// MACHINE WINS //';
    }
    if (status === 'draw') {
      return '// DRAW — SYSTEM STALEMATE //';
    }
    if (isAITurn) {
      return '> MACHINE PROCESSING...';
    }
    return `> YOUR MOVE [${currentPlayer}]`;
  }

  return (
    <div
      className={[
        'status-bar',
        status === 'won' && winner === 'X' ? 'status-bar--player-win' : '',
        status === 'won' && winner === 'O' ? 'status-bar--ai-win' : '',
        status === 'draw' ? 'status-bar--draw' : '',
        isAITurn ? 'status-bar--thinking' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="status-bar__text">{getMessage()}</span>
      {isAITurn && <span className="status-bar__cursor" aria-hidden="true" />}
    </div>
  );
}
