import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../store/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      className={`relative w-[60px] h-9 rounded-full shrink-0 transition-colors duration-300 ${
        isDark ? 'bg-veil/[0.12]' : 'bg-zona3/25'
      }`}
    >
      <span
        className={`absolute top-1 left-1 w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          isDark ? 'translate-x-[24px]' : 'translate-x-0'
        }`}
      >
        {isDark ? (
          <Moon size={16} className="text-slate-700" strokeWidth={2.2} fill="currentColor" />
        ) : (
          <Sun size={16} className="text-amber-500" strokeWidth={2.2} />
        )}
      </span>
    </button>
  );
}
