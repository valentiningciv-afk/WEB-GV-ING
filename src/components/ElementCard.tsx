import { getCategoriaInfo, type ElementoEstructural } from '../types';
import { CATEGORY_STYLES } from '../utils/categoryStyles';
import { formatNumber, formatPercent, unitLabel } from '../utils/format';
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
  const cat = getCategoriaInfo(elemento.categoria);

  return (
    <button
      onClick={onClick}
      className="w-full bg-surface rounded-2xl overflow-hidden flex items-stretch text-left active:bg-surface-2"
    >
      <span className={`w-1.5 shrink-0 ${style.bar}`} title={cat.nombre} />
      <div className="flex-1 min-w-0 flex gap-3.5 items-center p-3.5">
        <PhotoThumb src={elemento.foto} sizeClass="w-[72px] h-[72px]" />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="text-[18px] font-bold text-ink truncate leading-tight">
              {elemento.nombre}
            </p>
            <p className={`text-[19px] font-extrabold tabular-nums shrink-0 ${completo ? 'text-losa' : style.text600}`}>
              {formatPercent(percent)}
            </p>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-[13.5px] text-ink-2 font-medium truncate">
              {cat.nombreSingular} · {formatNumber(elemento.volumen)} m³/u
            </p>
            {completo && (
              <span className="text-[10px] font-bold text-losa bg-losa/15 px-2 py-0.5 rounded-full shrink-0">
                COMPLETO
              </span>
            )}
          </div>
          <div className="flex items-center gap-2.5 mt-2">
            <ProgressBar percent={percent} colorClass={style.bar} heightClass="h-2.5" />
            <span className="text-[14px] font-bold text-ink shrink-0 tabular-nums">
              {formatNumber(ejecutado)}/{formatNumber(elemento.cantidad)}
              <span className="text-ink-2 font-medium"> {unitLabel(elemento.unidadMedida)}</span>
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
