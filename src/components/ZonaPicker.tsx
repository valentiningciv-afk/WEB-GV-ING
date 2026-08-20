import { ZONAS, type Zona } from '../types';

interface ZonaPickerProps {
  value: Zona;
  onChange: (z: Zona) => void;
}

export function ZonaPicker({ value, onChange }: ZonaPickerProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {ZONAS.map((zona) => {
        const active = value === zona.id;
        return (
          <button
            key={zona.id}
            type="button"
            onClick={() => onChange(zona.id)}
            className={`rounded-xl px-2 py-3 text-[13px] font-semibold text-center border-2 ${
              active
                ? 'bg-accent/15 border-accent text-accent'
                : 'bg-surface-2 border-transparent text-ink'
            }`}
          >
            {zona.nombreCorto}
          </button>
        );
      })}
    </div>
  );
}
