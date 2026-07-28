import type { ReactNode } from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function Header({ title, subtitle, action }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-black/75 backdrop-blur-xl pt-[calc(env(safe-area-inset-top)+14px)] pb-3 px-5 border-b border-white/[0.07]">
      <div className="max-w-lg mx-auto flex items-end justify-between">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight text-ink leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[13px] text-ink-2 mt-0.5">{subtitle}</p>
          )}
        </div>
        {action}
      </div>
    </header>
  );
}
