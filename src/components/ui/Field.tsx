import type { ReactNode } from 'react';

interface FieldProps {
  label: string;
  children: ReactNode;
  hint?: string;
}

export function Field({ label, children, hint }: FieldProps) {
  return (
    <div className="mb-4">
      <label className="block text-[13px] font-medium text-ink-2 mb-1.5 px-1">
        {label}
      </label>
      {children}
      {hint && <p className="text-[12px] text-ink-2 mt-1 px-1">{hint}</p>}
    </div>
  );
}

export const inputClass =
  'w-full rounded-xl bg-surface-2 px-3.5 py-3 text-[16px] text-ink placeholder:text-ink-3 outline-none ring-1 ring-veil/[0.08] focus:ring-2 focus:ring-accent';
