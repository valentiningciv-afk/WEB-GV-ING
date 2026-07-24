import { CalendarCheck, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Header } from '../components/Header';
import { PhotoThumb } from '../components/PhotoPicker';
import { RegisterAvanceSheet } from '../components/RegisterAvanceSheet';
import { EmptyState } from '../components/ui/EmptyState';
import { ProgressBar } from '../components/ui/ProgressBar';
import { useProject } from '../store/ProjectContext';
import type { ElementoEstructural } from '../types';
import { getCategoriaInfo } from '../types';
import { CATEGORY_STYLES } from '../utils/categoryStyles';
import { formatDate, formatQty } from '../utils/format';

export function AvanceScreen() {
  const { elementos, avances, ejecutadoDe, deleteAvance } = useProject();
  const [selected, setSelected] = useState<ElementoEstructural | null>(null);

  const pendientes = useMemo(
    () => elementos.filter((e) => ejecutadoDe(e.id) < e.cantidad),
    [elementos, ejecutadoDe],
  );
  const completos = useMemo(
    () => elementos.filter((e) => ejecutadoDe(e.id) >= e.cantidad),
    [elementos, ejecutadoDe],
  );

  const reciente = useMemo(
    () =>
      [...avances]
        .sort((a, b) => b.fecha.localeCompare(a.fecha) || b.creadoEn.localeCompare(a.creadoEn))
        .slice(0, 15),
    [avances],
  );

  const elementoById = useMemo(() => {
    const map = new Map<string, ElementoEstructural>();
    for (const e of elementos) map.set(e.id, e);
    return map;
  }, [elementos]);

  if (elementos.length === 0) {
    return (
      <div>
        <Header title="Avance" subtitle="Registrá el hormigonado del día" />
        <EmptyState
          icon={CalendarCheck}
          title="Cargá elementos primero"
          description="Andá a la solapa Elementos y agregá el catálogo del proyecto para poder registrar avances."
        />
      </div>
    );
  }

  return (
    <div>
      <Header title="Avance" subtitle="Tocá un elemento para registrar lo hormigonado" />

      <div className="px-5 py-3 space-y-6">
        {pendientes.length > 0 && (
          <div>
            <p className="text-[13px] font-semibold text-[#6e6e73] uppercase tracking-wide mb-2 px-1">
              Pendientes ({pendientes.length})
            </p>
            <div className="space-y-2">
              {pendientes.map((e) => (
                <SelectableRow key={e.id} elemento={e} ejecutado={ejecutadoDe(e.id)} onClick={() => setSelected(e)} />
              ))}
            </div>
          </div>
        )}

        {completos.length > 0 && (
          <div>
            <p className="text-[13px] font-semibold text-[#6e6e73] uppercase tracking-wide mb-2 px-1">
              Completados ({completos.length})
            </p>
            <div className="space-y-2 opacity-80">
              {completos.map((e) => (
                <SelectableRow key={e.id} elemento={e} ejecutado={ejecutadoDe(e.id)} onClick={() => setSelected(e)} />
              ))}
            </div>
          </div>
        )}

        <div>
          <p className="text-[13px] font-semibold text-[#6e6e73] uppercase tracking-wide mb-2 px-1">
            Actividad reciente
          </p>
          {reciente.length === 0 ? (
            <p className="text-[13px] text-[#8e8e93] px-1">Todavía no se registraron avances.</p>
          ) : (
            <div className="bg-white rounded-2xl divide-y divide-black/[0.05] overflow-hidden">
              {reciente.map((a) => {
                const el = elementoById.get(a.elementoId);
                if (!el) return null;
                const cat = getCategoriaInfo(el.categoria);
                const style = CATEGORY_STYLES[el.categoria];
                return (
                  <div key={a.id} className="px-3.5 py-3 flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${style.bar}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-medium text-[#1c1c1e] truncate">
                        {el.nombre} <span className="text-[#8e8e93] font-normal">· {cat.nombreSingular}</span>
                      </p>
                      <p className="text-[12.5px] text-[#8e8e93]">
                        +{formatQty(a.cantidad, el.unidadMedida)} · {formatDate(a.fecha)}
                        {a.observaciones ? ` · ${a.observaciones}` : ''}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteAvance(a.id)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[#c7c7cc] active:bg-black/[0.05] shrink-0"
                      aria-label="Eliminar registro"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <RegisterAvanceSheet elemento={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function SelectableRow({
  elemento,
  ejecutado,
  onClick,
}: {
  elemento: ElementoEstructural;
  ejecutado: number;
  onClick: () => void;
}) {
  const style = CATEGORY_STYLES[elemento.categoria];
  const percent = elemento.cantidad > 0 ? (ejecutado / elemento.cantidad) * 100 : 0;
  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-2xl p-3 flex items-center gap-3 text-left active:bg-black/[0.02] shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
    >
      <PhotoThumb src={elemento.foto} sizeClass="w-12 h-12" />
      <div className="flex-1 min-w-0">
        <p className="text-[14.5px] font-semibold text-[#1c1c1e] truncate">{elemento.nombre}</p>
        <div className="flex items-center gap-2 mt-1">
          <ProgressBar percent={percent} colorClass={style.bar} heightClass="h-1.5" />
          <span className="text-[12px] font-medium text-[#6e6e73] shrink-0 tabular-nums">
            {formatQty(ejecutado, elemento.unidadMedida)}/{formatQty(elemento.cantidad, elemento.unidadMedida)}
          </span>
        </div>
      </div>
    </button>
  );
}
