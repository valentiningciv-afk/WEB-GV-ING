import { Home, Boxes, PlusCircle, BarChart3 } from 'lucide-react';
import type { Tab } from '../App';

interface BottomNavProps {
  active: Tab;
  onChange: (tab: Tab) => void;
}

const ITEMS: { id: Tab; label: string; icon: typeof Home }[] = [
  { id: 'inicio', label: 'Inicio', icon: Home },
  { id: 'elementos', label: 'Elementos', icon: Boxes },
  { id: 'avance', label: 'Avance', icon: PlusCircle },
  { id: 'reportes', label: 'Reportes', icon: BarChart3 },
];

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-app/80 backdrop-blur-xl border-t border-veil/[0.08] pb-[env(safe-area-inset-bottom)] transition-colors duration-300">
      <div className="max-w-lg mx-auto grid grid-cols-4">
        {ITEMS.map((item) => {
          const isActive = item.id === active;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className="flex flex-col items-center justify-center gap-0.5 py-2 active:opacity-60"
            >
              <Icon
                size={26}
                strokeWidth={isActive ? 2.4 : 1.9}
                className={isActive ? 'text-accent' : 'text-ink-2'}
                fill={isActive && item.id !== 'avance' ? 'none' : 'none'}
              />
              <span
                className={`text-[11.5px] leading-none mt-1 ${
                  isActive ? 'text-accent font-bold' : 'text-ink-2 font-medium'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
