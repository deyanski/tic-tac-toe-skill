import { Difficulty } from '../game/ai';

interface ControlsProps {
  difficulty: Difficulty;
  theme: 'night' | 'day';
  onDifficultyChange: (d: Difficulty) => void;
  onReset: () => void;
  onThemeToggle: () => void;
}

export default function Controls({ difficulty, theme, onDifficultyChange, onReset, onThemeToggle }: ControlsProps) {
  return (
    <div className="controls">
      <div className="controls__group">
        <span className="controls__label">DIFFICULTY</span>
        <div className="controls__toggle">
          <button
            className={`ctrl-btn ${difficulty === 'easy' ? 'ctrl-btn--active' : ''}`}
            onClick={() => onDifficultyChange('easy')}
            aria-pressed={difficulty === 'easy'}
          >
            EASY
          </button>
          <button
            className={`ctrl-btn ${difficulty === 'hard' ? 'ctrl-btn--active' : ''}`}
            onClick={() => onDifficultyChange('hard')}
            aria-pressed={difficulty === 'hard'}
          >
            HARD
          </button>
        </div>
      </div>

      <button className="ctrl-btn ctrl-btn--reset" onClick={onReset}>
        [RESET]
      </button>

      <div className="controls__group">
        <span className="controls__label">MODE</span>
        <button
          className="ctrl-btn ctrl-btn--theme"
          onClick={onThemeToggle}
          aria-label={`Switch to ${theme === 'night' ? 'day' : 'night'} mode`}
        >
          {theme === 'night' ? '☀ DAY' : '☾ NIGHT'}
        </button>
      </div>
    </div>
  );
}
