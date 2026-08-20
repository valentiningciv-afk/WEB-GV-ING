import type { ReactNode } from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function Header({ title, subtitle, action }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-app/75 backdrop-blur-xl pt-[calc(env(safe-area-inset-top)+14px)] pb-3 px-5 border-b border-veil/[0.07] transition-colors duration-300">
      <div className="max-w-lg mx-auto flex items-end justify-between">
        <div>
          <h1 className="text-[32px] font-extrabold tracking-tight text-ink leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[14.5px] text-ink-2 mt-0.5 font-medium">{subtitle}</p>
          )}
        </div>
        {action}
      </div>
    </header>
  );
}
