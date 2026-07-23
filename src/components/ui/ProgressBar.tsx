interface ProgressBarProps {
  percent: number;
  colorClass: string;
  trackClass?: string;
  heightClass?: string;
}

export function ProgressBar({
  percent,
  colorClass,
  trackClass = 'bg-black/[0.06]',
  heightClass = 'h-2',
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div className={`w-full ${heightClass} ${trackClass} rounded-full overflow-hidden`}>
      <div
        className={`${heightClass} ${colorClass} rounded-full transition-all duration-500 ease-out`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
