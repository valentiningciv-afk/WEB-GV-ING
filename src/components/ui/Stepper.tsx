import { Minus, Plus } from 'lucide-react';

interface StepperProps {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export function Stepper({ value, onChange, min = 0, max, step = 1 }: StepperProps) {
  const clamp = (v: number) => {
    let r = v;
    if (max !== undefined) r = Math.min(max, r);
    r = Math.max(min, r);
    return Math.round(r / step) * step;
  };

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(clamp(value - step))}
        className="w-9 h-9 rounded-full bg-black/[0.06] flex items-center justify-center active:bg-black/[0.12] disabled:opacity-30"
        disabled={value <= min}
        aria-label="Restar"
      >
        <Minus size={16} className="text-[#1c1c1e]" />
      </button>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(clamp(Number(e.target.value) || 0))}
        className="w-16 text-center text-[17px] font-semibold text-[#1c1c1e] bg-transparent outline-none"
      />
      <button
        type="button"
        onClick={() => onChange(clamp(value + step))}
        className="w-9 h-9 rounded-full bg-black/[0.06] flex items-center justify-center active:bg-black/[0.12] disabled:opacity-30"
        disabled={max !== undefined && value >= max}
        aria-label="Sumar"
      >
        <Plus size={16} className="text-[#1c1c1e]" />
      </button>
    </div>
  );
}
