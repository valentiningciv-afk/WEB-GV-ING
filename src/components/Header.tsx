import type { ReactNode } from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function Header({ title, subtitle, action }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-[#f2f2f7]/85 backdrop-blur-xl pt-[calc(env(safe-area-inset-top)+14px)] pb-3 px-5 border-b border-black/[0.05]">
      <div className="max-w-lg mx-auto flex items-end justify-between">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight text-[#1c1c1e] leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[13px] text-[#8e8e93] mt-0.5">{subtitle}</p>
          )}
        </div>
        {action}
      </div>
    </header>
  );
}
