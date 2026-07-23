import type { ReactNode } from 'react';

interface FieldProps {
  label: string;
  children: ReactNode;
  hint?: string;
}

export function Field({ label, children, hint }: FieldProps) {
  return (
    <div className="mb-4">
      <label className="block text-[13px] font-medium text-[#6e6e73] mb-1.5 px-1">
        {label}
      </label>
      {children}
      {hint && <p className="text-[12px] text-[#8e8e93] mt-1 px-1">{hint}</p>}
    </div>
  );
}

export const inputClass =
  'w-full rounded-xl bg-white px-3.5 py-3 text-[16px] text-[#1c1c1e] placeholder:text-[#c7c7cc] outline-none ring-1 ring-black/[0.06] focus:ring-2 focus:ring-[#007AFF]';
