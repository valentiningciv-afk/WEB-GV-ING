import { CATEGORIAS, type Categoria } from '../types';
import { CATEGORY_STYLES } from '../utils/categoryStyles';

interface CategoryPickerProps {
  value: Categoria;
  onChange: (c: Categoria) => void;
}

export function CategoryPicker({ value, onChange }: CategoryPickerProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {CATEGORIAS.map((cat) => {
        const style = CATEGORY_STYLES[cat.id];
        const Icon = style.icon;
        const active = value === cat.id;
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onChange(cat.id)}
            className={`flex items-center gap-2.5 rounded-2xl px-3 py-3 text-left border-2 transition-colors ${
              active
                ? `${style.bg50} border-current ${style.text700}`
                : 'bg-surface-2 border-transparent text-ink'
            }`}
          >
            <span
              className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${style.bg100}`}
            >
              <Icon size={18} className={style.text600} strokeWidth={2} />
            </span>
            <span className="text-[13px] font-medium leading-tight">
              {cat.nombre}
            </span>
          </button>
        );
      })}
    </div>
  );
}
