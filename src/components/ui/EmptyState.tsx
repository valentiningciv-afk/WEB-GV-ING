import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-8 py-16">
      <div className="w-16 h-16 rounded-full bg-black/[0.05] flex items-center justify-center mb-4">
        <Icon size={28} className="text-[#8e8e93]" strokeWidth={1.75} />
      </div>
      <h3 className="text-[17px] font-semibold text-[#1c1c1e] mb-1">{title}</h3>
      <p className="text-[14px] text-[#8e8e93] max-w-xs leading-snug">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
