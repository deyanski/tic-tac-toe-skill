export type Player = 'X' | 'O';
export type Cell = Player | null;
export type Board = [Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell];
export type GameStatus = 'playing' | 'won' | 'draw';

export const WINNING_LINES: [number, number, number][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export function checkWinner(board: Board): { winner: Player; line: [number, number, number] } | null {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    if (board[a] !== null && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a] as Player, line };
    }
  }
  return null;
}

export function isDraw(board: Board): boolean {
  return board.every((cell) => cell !== null) && checkWinner(board) === null;
}

export function getAvailableMoves(board: Board): number[] {
  return board.reduce<number[]>((acc, cell, i) => {
    if (cell === null) acc.push(i);
    return acc;
  }, []);
}

export function makeMove(board: Board, index: number, player: Player): Board {
  const next = [...board] as Board;
  next[index] = player;
  return next;
}

export function getGameResult(board: Board): {
  status: GameStatus;
  winner: Player | null;
  winLine: [number, number, number] | null;
} {
  const result = checkWinner(board);
  if (result) {
    return { status: 'won', winner: result.winner, winLine: result.line };
  }
  if (isDraw(board)) {
    return { status: 'draw', winner: null, winLine: null };
  }
  return { status: 'playing', winner: null, winLine: null };
}
