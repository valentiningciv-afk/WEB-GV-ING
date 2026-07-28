import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useProject } from '../store/ProjectContext';
import type { ElementoEstructural } from '../types';
import { getCategoriaInfo } from '../types';
import { CATEGORY_STYLES } from '../utils/categoryStyles';
import { formatDate, formatNumber, formatQty } from '../utils/format';
import { PhotoThumb } from './PhotoPicker';
import { ProgressBar } from './ui/ProgressBar';
import { Sheet } from './ui/Sheet';

interface ElementDetailSheetProps {
  elemento: ElementoEstructural | null;
  onClose: () => void;
  onEdit: (e: ElementoEstructural) => void;
}

export function ElementDetailSheet({ elemento, onClose, onEdit }: ElementDetailSheetProps) {
  const { avances, deleteElemento, ejecutadoDe } = useProject();
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!elemento) return null;
  const style = CATEGORY_STYLES[elemento.categoria];
  const cat = getCategoriaInfo(elemento.categoria);
  const ejecutado = ejecutadoDe(elemento.id);
  const percent = elemento.cantidad > 0 ? (ejecutado / elemento.cantidad) * 100 : 0;
  const historial = avances
    .filter((a) => a.elementoId === elemento.id)
    .sort((a, b) => b.fecha.localeCompare(a.fecha));

  return (
    <Sheet open={!!elemento} onClose={onClose} title={elemento.nombre}>
      <PhotoThumb src={elemento.foto} sizeClass="w-full h-44 rounded-2xl" />

      <div className="mt-4 flex items-center gap-2 flex-wrap">
        <span className={`text-[12px] font-semibold px-2.5 py-1 rounded-full ${style.chip}`}>
          {cat.nombre}
        </span>
        {elemento.nombrePliego && (
          <span className="text-[12px] font-semibold px-2.5 py-1 rounded-full bg-white/[0.08] text-ink-2">
            Pliego: {elemento.nombrePliego}
          </span>
        )}
      </div>

      <div className="mt-4 bg-surface rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[13px] font-medium text-ink-2">Avance acumulado</p>
          <p className="text-[15px] font-bold text-ink tabular-nums">
            {formatQty(ejecutado, elemento.unidadMedida)}/{formatQty(elemento.cantidad, elemento.unidadMedida)}
            <span className="text-ink-2 font-normal"> · {formatNumber(percent)}%</span>
          </p>
        </div>
        <ProgressBar percent={percent} colorClass={style.bar} heightClass="h-2.5" />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="bg-surface rounded-2xl p-3.5">
          <p className="text-[12px] text-ink-2 mb-0.5">Volumen unitario</p>
          <p className="text-[16px] font-semibold text-ink">
            {formatNumber(elemento.volumen)} m³
          </p>
        </div>
        <div className="bg-surface rounded-2xl p-3.5">
          <p className="text-[12px] text-ink-2 mb-0.5">Altura</p>
          <p className="text-[16px] font-semibold text-ink">
            {formatNumber(elemento.altura)} m
          </p>
        </div>
      </div>

      <div className="mt-3 bg-surface rounded-2xl p-3.5">
        <p className="text-[12px] text-ink-2 mb-1">Material de encofrado</p>
        <p className="text-[14.5px] text-ink leading-snug">
          {elemento.materialEncofrado || 'Sin especificar'}
        </p>
      </div>

      <div className="mt-5">
        <p className="text-[13px] font-semibold text-ink-2 mb-2 px-1">
          Historial de avance ({historial.length})
        </p>
        {historial.length === 0 ? (
          <p className="text-[13px] text-ink-2 px-1">Todavía no se registró avance.</p>
        ) : (
          <div className="bg-surface rounded-2xl divide-y divide-white/[0.07] overflow-hidden">
            {historial.map((a) => (
              <div key={a.id} className="px-3.5 py-2.5 flex items-center justify-between gap-2">
                <div>
                  <p className="text-[14px] font-medium text-ink">
                    +{formatQty(a.cantidad, elemento.unidadMedida)}
                  </p>
                  {a.observaciones && (
                    <p className="text-[12.5px] text-ink-2">{a.observaciones}</p>
                  )}
                </div>
                <span className="text-[12.5px] text-ink-2 shrink-0">{formatDate(a.fecha)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 flex gap-3 pb-4">
        <button
          onClick={() => onEdit(elemento)}
          className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl bg-surface-2 text-ink text-[14px] font-semibold active:bg-surface-3"
        >
          <Pencil size={16} /> Editar
        </button>
        {confirmDelete ? (
          <button
            onClick={() => {
              deleteElemento(elemento.id);
              onClose();
            }}
            className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl bg-red-500 text-white text-[14px] font-semibold active:bg-red-600"
          >
            Confirmar
          </button>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl bg-red-500/15 text-red-400 text-[14px] font-semibold active:bg-red-500/25"
          >
            <Trash2 size={16} /> Eliminar
          </button>
        )}
      </div>
    </Sheet>
  );
}
