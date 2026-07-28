import { X } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function Sheet({ open, onClose, title, children, footer }: SheetProps) {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div
        className="absolute inset-0 bg-black/60 animate-fade-in"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg max-h-[92svh] bg-surface rounded-t-[28px] shadow-2xl animate-sheet-up flex flex-col">
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-white/[0.08] shrink-0">
          <div className="w-9" />
          <h2 className="text-[17px] font-semibold text-ink">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="w-9 h-9 rounded-full bg-surface-2 flex items-center justify-center active:bg-surface-3"
          >
            <X size={18} className="text-ink-2" />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-4 flex-1">{children}</div>
        {footer && (
          <div className="px-5 py-3 border-t border-white/[0.08] shrink-0 bg-surface pb-[calc(env(safe-area-inset-bottom)+12px)]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
