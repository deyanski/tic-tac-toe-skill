import { Board } from '../game/logic';
import CellComponent from './Cell';

interface BoardProps {
  board: Board;
  winLine: [number, number, number] | null;
  isPlayerTurn: boolean;
  onCellClick: (index: number) => void;
}

export default function BoardComponent({ board, winLine, isPlayerTurn, onCellClick }: BoardProps) {
  const winSet = new Set(winLine ?? []);

  return (
    <div className="board" role="grid" aria-label="Tic-tac-toe board">
      {board.map((cell, i) => (
        <CellComponent
          key={i}
          value={cell}
          index={i}
          isWinCell={winSet.has(i)}
          isPlayerTurn={isPlayerTurn}
          onClick={onCellClick}
        />
      ))}
    </div>
  );
}
