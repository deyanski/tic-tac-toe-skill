import { Cell } from '../game/logic';

interface CellProps {
  value: Cell;
  index: number;
  isWinCell: boolean;
  isPlayerTurn: boolean;
  onClick: (index: number) => void;
}

export default function CellComponent({ value, index, isWinCell, isPlayerTurn, onClick }: CellProps) {
  const isEmpty = value === null;
  const isClickable = isEmpty && isPlayerTurn;

  return (
    <button
      className={[
        'cell',
        value === 'X' ? 'cell--x' : '',
        value === 'O' ? 'cell--o' : '',
        isWinCell ? 'cell--win' : '',
        isClickable ? 'cell--clickable' : '',
        !isEmpty ? 'cell--filled' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={() => isClickable && onClick(index)}
      disabled={!isClickable}
      aria-label={value ?? `Cell ${index + 1}, empty`}
    >
      {value && (
        <span key={value} className="cell-mark">
          {value}
        </span>
      )}
    </button>
  );
}
