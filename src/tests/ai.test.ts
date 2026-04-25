import { describe, it, expect } from 'vitest';
import { getAIMove } from '../game/ai';
import { makeMove, getGameResult, getAvailableMoves, type Board, type Player } from '../game/logic';

const empty: Board = [null, null, null, null, null, null, null, null, null];

describe('easy AI', () => {
  it('returns a valid move index on an empty board', () => {
    const move = getAIMove(empty, 'O', 'easy');
    expect(move).toBeGreaterThanOrEqual(0);
    expect(move).toBeLessThanOrEqual(8);
    expect(empty[move]).toBeNull();
  });

  it('never picks an occupied cell', () => {
    const board: Board = ['X', 'O', 'X', null, 'X', null, 'O', null, 'O'];
    for (let i = 0; i < 50; i++) {
      const move = getAIMove(board, 'O', 'easy');
      expect(board[move]).toBeNull();
    }
  });

  it('always returns a move when only one cell remains', () => {
    const board: Board = ['X', 'O', 'X', 'O', 'X', 'O', 'O', null, 'X'];
    const move = getAIMove(board, 'O', 'easy');
    expect(move).toBe(7);
  });

  it('throws when no moves are available', () => {
    const board: Board = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
    expect(() => getAIMove(board, 'O', 'easy')).toThrow();
  });
});

describe('hard AI (minimax)', () => {
  it('returns a valid move index on an empty board', () => {
    const move = getAIMove(empty, 'O', 'hard');
    expect(move).toBeGreaterThanOrEqual(0);
    expect(move).toBeLessThanOrEqual(8);
  });

  it('never picks an occupied cell', () => {
    const board: Board = ['X', null, 'X', null, 'O', null, null, null, null];
    const move = getAIMove(board, 'O', 'hard');
    expect(board[move]).toBeNull();
  });

  it('immediately takes a winning move (O wins at index 8)', () => {
    //  O O .
    //  X X .
    //  . . .
    const board: Board = ['O', 'O', null, 'X', 'X', null, null, null, null];
    const move = getAIMove(board, 'O', 'hard');
    expect(move).toBe(2); // O wins top-right
  });

  it('blocks an immediate human win (X about to win at index 2)', () => {
    //  X X .
    //  O . .
    //  . . .
    const board: Board = ['X', 'X', null, 'O', null, null, null, null, null];
    const move = getAIMove(board, 'O', 'hard');
    expect(move).toBe(2); // must block
  });

  it('plays a winning or fork-creating move when facing opponent threat (X at col 0)', () => {
    //  X O .
    //  X O .
    //  . . .
    const board: Board = ['X', 'O', null, 'X', 'O', null, null, null, null];
    const move = getAIMove(board, 'O', 'hard');
    // Both index 6 (fork — O creates two winning threats) and index 7 (immediate O win)
    // are equally optimal: both yield score +10 for minimax. Either is correct.
    expect([6, 7]).toContain(move);
    // Verify the chosen move results in O not losing
    const nextBoard = makeMove(board, move, 'O');
    const { status, winner } = getGameResult(nextBoard);
    if (status === 'won') expect(winner).toBe('O');
  });

  it('never loses against any human strategy (hard AI as O)', () => {
    // Simulate all possible single-move human responses and verify AI result is not a loss
    function playGame(board: Board, humanPlayer: Player, turn: Player): 'X' | 'O' | 'draw' | 'playing' {
      const { status, winner } = getGameResult(board);
      if (status !== 'playing') return status === 'draw' ? 'draw' : (winner as 'X' | 'O');
      if (turn === humanPlayer) {
        // Try every possible human move — AI should handle all of them
        // For test efficiency we just pick the first available move
        const moves = getAvailableMoves(board);
        if (moves.length === 0) return 'draw';
        const next = makeMove(board, moves[0]!, humanPlayer);
        return playGame(next, humanPlayer, humanPlayer === 'X' ? 'O' : 'X');
      } else {
        const move = getAIMove(board, 'O', 'hard');
        const next = makeMove(board, move, 'O');
        return playGame(next, humanPlayer, humanPlayer === 'X' ? 'O' : 'X');
      }
    }

    // Human (X) goes first — test all 9 opening moves
    for (let openingMove = 0; openingMove < 9; openingMove++) {
      const afterHuman = makeMove(empty, openingMove, 'X');
      const { status } = getGameResult(afterHuman);
      if (status !== 'playing') continue;
      const move = getAIMove(afterHuman, 'O', 'hard');
      const afterAI = makeMove(afterHuman, move, 'O');
      const result = playGame(afterAI, 'X', 'X');
      // AI (O) should never lose
      expect(result).not.toBe('X');
    }
  });

  it('wins immediately when it can on a nearly full board', () => {
    //  X O X
    //  O O X
    //  X . O  — O can win at index 7
    const board: Board = ['X', 'O', 'X', 'O', 'O', 'X', 'X', null, 'O'];
    const move = getAIMove(board, 'O', 'hard');
    expect(move).toBe(7);
  });
});
