import type { ElementoEstructural } from '../types';
import { CATEGORY_STYLES } from '../utils/categoryStyles';
import { formatNumber } from '../utils/format';
import { PhotoThumb } from './PhotoPicker';
import { ProgressBar } from './ui/ProgressBar';

interface ElementCardProps {
  elemento: ElementoEstructural;
  ejecutado: number;
  onClick: () => void;
}

export function ElementCard({ elemento, ejecutado, onClick }: ElementCardProps) {
  const style = CATEGORY_STYLES[elemento.categoria];
  const percent = elemento.cantidad > 0 ? (ejecutado / elemento.cantidad) * 100 : 0;
  const completo = ejecutado >= elemento.cantidad;

  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-2xl p-3 flex gap-3 items-center text-left active:bg-black/[0.02] shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
    >
      <PhotoThumb src={elemento.foto} sizeClass="w-16 h-16" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[15px] font-semibold text-[#1c1c1e] truncate">
            {elemento.nombre}
          </p>
          {completo && (
            <span className="text-[10px] font-bold text-losa-700 bg-losa-100 px-2 py-0.5 rounded-full shrink-0">
              COMPLETO
            </span>
          )}
        </div>
        <p className="text-[12.5px] text-[#8e8e93] mb-1.5">
          {formatNumber(elemento.altura)} m · {formatNumber(elemento.volumen)} m³/u
        </p>
        <div className="flex items-center gap-2">
          <ProgressBar percent={percent} colorClass={style.bar} heightClass="h-1.5" />
          <span className="text-[12px] font-medium text-[#6e6e73] shrink-0 tabular-nums">
            {ejecutado}/{elemento.cantidad}
          </span>
        </div>
      </div>
    </button>
  );
}
