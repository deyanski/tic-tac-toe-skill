import { Board, Player, getAvailableMoves, makeMove, checkWinner, isDraw } from './logic';

export type Difficulty = 'easy' | 'hard';

export function getAIMove(board: Board, aiPlayer: Player, difficulty: Difficulty): number {
  const moves = getAvailableMoves(board);
  if (moves.length === 0) throw new Error('No available moves');

  if (difficulty === 'easy') {
    return moves[Math.floor(Math.random() * moves.length)]!;
  }

  // Hard: full minimax with alpha-beta pruning
  const result = minimax(board, aiPlayer, aiPlayer, true, -Infinity, Infinity);
  // result.move should always be non-null when there are available moves
  if (result.move === null) {
    return moves[0]!;
  }
  return result.move;
}

function minimax(
  board: Board,
  aiPlayer: Player,
  currentPlayer: Player,
  isMaximizing: boolean,
  alpha: number,
  beta: number,
): { score: number; move: number | null } {
  const winResult = checkWinner(board);
  if (winResult) {
    return { score: winResult.winner === aiPlayer ? 10 : -10, move: null };
  }
  if (isDraw(board)) {
    return { score: 0, move: null };
  }

  const moves = getAvailableMoves(board);
  let bestMove: number | null = null;
  let bestScore = isMaximizing ? -Infinity : Infinity;

  for (const move of moves) {
    const nextBoard = makeMove(board, move, currentPlayer);
    const nextPlayer: Player = currentPlayer === 'X' ? 'O' : 'X';
    const { score } = minimax(nextBoard, aiPlayer, nextPlayer, !isMaximizing, alpha, beta);

    if (isMaximizing) {
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
      alpha = Math.max(alpha, bestScore);
    } else {
      if (score < bestScore) {
        bestScore = score;
        bestMove = move;
      }
      beta = Math.min(beta, bestScore);
    }

    if (beta <= alpha) break;
  }

  return { score: bestScore, move: bestMove };
}
