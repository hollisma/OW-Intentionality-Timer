interface DeleteButtonProps {
  onClick: () => void;
  ariaLabel: string;
  className?: string;
}

export function DeleteButton({ onClick, ariaLabel, className = '' }: DeleteButtonProps) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`flex-shrink-0 p-2 rounded-lg text-slate-500 transition-colors hover:text-red-400 hover:bg-red-500/10${className ? ` ${className}` : ''}`}
      aria-label={ariaLabel}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6h18M19 6v12a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
      </svg>
    </button>
  );
}
