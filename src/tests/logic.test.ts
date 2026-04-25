import { describe, it, expect } from 'vitest';
import {
  checkWinner,
  isDraw,
  getAvailableMoves,
  makeMove,
  getGameResult,
  type Board,
  WINNING_LINES,
} from '../game/logic';

const empty: Board = [null, null, null, null, null, null, null, null, null];

describe('checkWinner', () => {
  it('returns null for an empty board', () => {
    expect(checkWinner(empty)).toBeNull();
  });

  it('detects all 8 winning lines for X', () => {
    for (const [a, b, c] of WINNING_LINES) {
      const board = [...empty] as Board;
      board[a] = 'X';
      board[b] = 'X';
      board[c] = 'X';
      const result = checkWinner(board);
      expect(result).not.toBeNull();
      expect(result?.winner).toBe('X');
      expect(result?.line).toEqual([a, b, c]);
    }
  });

  it('detects all 8 winning lines for O', () => {
    for (const [a, b, c] of WINNING_LINES) {
      const board = [...empty] as Board;
      board[a] = 'O';
      board[b] = 'O';
      board[c] = 'O';
      expect(checkWinner(board)?.winner).toBe('O');
    }
  });

  it('returns null when only two in a row', () => {
    const board: Board = ['X', 'X', null, null, null, null, null, null, null];
    expect(checkWinner(board)).toBeNull();
  });

  it('does not mix X and O as a win', () => {
    const board: Board = ['X', 'O', 'X', null, null, null, null, null, null];
    expect(checkWinner(board)).toBeNull();
  });

  it('returns the first winning line when multiple could theoretically exist', () => {
    // X wins on top row [0,1,2]
    const board: Board = ['X', 'X', 'X', 'O', 'O', null, null, null, null];
    expect(checkWinner(board)?.winner).toBe('X');
  });
});

describe('isDraw', () => {
  it('returns false for an empty board', () => {
    expect(isDraw(empty)).toBe(false);
  });

  it('returns false for a board with a winner', () => {
    const board: Board = ['X', 'X', 'X', 'O', 'O', null, null, null, null];
    expect(isDraw(board)).toBe(false);
  });

  it('returns true for a fully filled board with no winner', () => {
    // X O X
    // X O O
    // O X X  — no winner
    const board: Board = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
    expect(isDraw(board)).toBe(true);
  });

  it('returns false when board is full but there IS a winner', () => {
    // X X X
    // O O X
    // O X O
    const board: Board = ['X', 'X', 'X', 'O', 'O', 'X', 'O', 'X', 'O'];
    expect(isDraw(board)).toBe(false);
  });
});

describe('getAvailableMoves', () => {
  it('returns all 9 indices for empty board', () => {
    expect(getAvailableMoves(empty)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it('returns only null cell indices', () => {
    const board: Board = ['X', null, 'O', null, 'X', null, null, null, null];
    expect(getAvailableMoves(board)).toEqual([1, 3, 5, 6, 7, 8]);
  });

  it('returns empty array for full board', () => {
    const board: Board = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
    expect(getAvailableMoves(board)).toEqual([]);
  });
});

describe('makeMove', () => {
  it('places a player mark at the given index', () => {
    const board = makeMove(empty, 4, 'X');
    expect(board[4]).toBe('X');
  });

  it('does not mutate the original board', () => {
    const original = [...empty] as Board;
    makeMove(original, 0, 'X');
    expect(original[0]).toBeNull();
  });

  it('preserves existing marks on the board', () => {
    const board: Board = ['X', null, null, null, null, null, null, null, null];
    const next = makeMove(board, 5, 'O');
    expect(next[0]).toBe('X');
    expect(next[5]).toBe('O');
  });
});

describe('getGameResult', () => {
  it('reports playing on empty board', () => {
    expect(getGameResult(empty).status).toBe('playing');
  });

  it('reports won with correct winner and line', () => {
    const board: Board = ['X', 'X', 'X', null, null, null, null, null, null];
    const result = getGameResult(board);
    expect(result.status).toBe('won');
    expect(result.winner).toBe('X');
    expect(result.winLine).toEqual([0, 1, 2]);
  });

  it('reports draw', () => {
    const board: Board = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
    expect(getGameResult(board).status).toBe('draw');
    expect(getGameResult(board).winner).toBeNull();
  });

  it('winner takes priority over draw check', () => {
    // Full board but with a winner
    const board: Board = ['X', 'X', 'X', 'O', 'O', 'X', 'O', 'X', 'O'];
    const result = getGameResult(board);
    expect(result.status).toBe('won');
    expect(result.winner).toBe('X');
  });
});
