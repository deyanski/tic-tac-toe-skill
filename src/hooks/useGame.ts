import { useState, useEffect, useRef, useCallback } from 'react';
import { Board, Player, GameStatus, getAvailableMoves, makeMove, getGameResult } from '../game/logic';
import { getAIMove, Difficulty } from '../game/ai';
import { supabase } from '../lib/supabase';

const EMPTY_BOARD: Board = [null, null, null, null, null, null, null, null, null];
const HUMAN: Player = 'X';
const AI: Player = 'O';

interface GameState {
  board: Board;
  currentPlayer: Player;
  status: GameStatus;
  winner: Player | null;
  winLine: [number, number, number] | null;
  isAITurn: boolean;
}

const INITIAL_STATE: GameState = {
  board: EMPTY_BOARD,
  currentPlayer: HUMAN,
  status: 'playing',
  winner: null,
  winLine: null,
  isAITurn: false,
};

export function useGame(userId: string | null = null) {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [theme, setTheme] = useState<'night' | 'day'>(() => {
    try {
      const stored = localStorage.getItem('ttt-theme');
      return stored === 'day' ? 'day' : 'night';
    } catch {
      return 'night';
    }
  });
  const [game, setGame] = useState<GameState>(INITIAL_STATE);

  // Abort flag prevents stale AI timeouts from writing state after a reset
  const abortRef = useRef(false);
  // Prevents double-insert in React StrictMode and rapid resets
  const recordedRef = useRef(false);

  const resetGame = useCallback(() => {
    abortRef.current = true;
    recordedRef.current = false;
    setGame(INITIAL_STATE);
    // Allow new AI turns after React flushes the state update
    setTimeout(() => {
      abortRef.current = false;
    }, 0);
  }, []);

  const handleCellClick = useCallback((index: number) => {
    setGame((prev) => {
      if (prev.status !== 'playing' || prev.isAITurn || prev.board[index] !== null) {
        return prev;
      }
      const newBoard = makeMove(prev.board, index, HUMAN);
      const { status, winner, winLine } = getGameResult(newBoard);
      return {
        board: newBoard,
        currentPlayer: status === 'playing' ? AI : HUMAN,
        status,
        winner,
        winLine,
        isAITurn: status === 'playing',
      };
    });
  }, []);

  // AI turn effect
  useEffect(() => {
    if (!game.isAITurn || game.status !== 'playing') return;

    abortRef.current = false;
    const timer = setTimeout(() => {
      if (abortRef.current) return;

      setGame((prev) => {
        if (!prev.isAITurn || prev.status !== 'playing') return prev;
        const available = getAvailableMoves(prev.board);
        if (available.length === 0) return prev;

        const move = getAIMove(prev.board, AI, difficulty);
        const newBoard = makeMove(prev.board, move, AI);
        const { status, winner, winLine } = getGameResult(newBoard);
        return {
          board: newBoard,
          currentPlayer: HUMAN,
          status,
          winner,
          winLine,
          isAITurn: false,
        };
      });
    }, 480);

    return () => clearTimeout(timer);
  }, [game.isAITurn, game.status, difficulty]);

  // Record completed game to Supabase (silently — never crash the game UI)
  useEffect(() => {
    if (game.status === 'playing') return;
    if (!userId) return;
    if (recordedRef.current) return;
    recordedRef.current = true;

    const winnerValue: 'X' | 'O' | 'draw' =
      game.status === 'draw' ? 'draw' : (game.winner as 'X' | 'O');

    supabase
      .from('games')
      .insert({ user_id: userId, winner: winnerValue, difficulty })
      .then(({ error }) => {
        if (error) console.warn('[ttt] failed to record game:', error.message);
      });
  }, [game.status, game.winner, userId, difficulty]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => {
      const next = t === 'night' ? 'day' : 'night';
      try {
        localStorage.setItem('ttt-theme', next);
      } catch {
        // ignore storage errors
      }
      return next;
    });
  }, []);

  return {
    board: game.board,
    currentPlayer: game.currentPlayer,
    status: game.status,
    winner: game.winner,
    winLine: game.winLine,
    isAITurn: game.isAITurn,
    difficulty,
    theme,
    setDifficulty,
    handleCellClick,
    resetGame,
    toggleTheme,
  };
}
