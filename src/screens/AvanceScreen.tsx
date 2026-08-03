import { CalendarCheck, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Header } from '../components/Header';
import { PhotoThumb } from '../components/PhotoPicker';
import { RegisterAvanceSheet } from '../components/RegisterAvanceSheet';
import { EmptyState } from '../components/ui/EmptyState';
import { ProgressBar } from '../components/ui/ProgressBar';
import { useProject } from '../store/ProjectContext';
import type { ElementoEstructural, Zona } from '../types';
import { getCategoriaInfo, getZonaInfo, ZONAS } from '../types';
import { CATEGORY_STYLES } from '../utils/categoryStyles';
import { formatDate, formatNivel, formatQty } from '../utils/format';

type ZonaFiltro = 'todas' | Zona;

export function AvanceScreen() {
  const { elementos, avances, ejecutadoDe, deleteAvance } = useProject();
  const [selected, setSelected] = useState<ElementoEstructural | null>(null);
  const [zonaFiltro, setZonaFiltro] = useState<ZonaFiltro>('todas');

  const elementosZona = useMemo(
    () => (zonaFiltro === 'todas' ? elementos : elementos.filter((e) => e.zona === zonaFiltro)),
    [elementos, zonaFiltro],
  );

  const pendientes = useMemo(
    () => elementosZona.filter((e) => ejecutadoDe(e.id) < e.cantidad),
    [elementosZona, ejecutadoDe],
  );
  const completos = useMemo(
    () => elementosZona.filter((e) => ejecutadoDe(e.id) >= e.cantidad),
    [elementosZona, ejecutadoDe],
  );

  const idsZona = useMemo(() => new Set(elementosZona.map((e) => e.id)), [elementosZona]);

  const reciente = useMemo(
    () =>
      [...avances]
        .filter((a) => idsZona.has(a.elementoId))
        .sort((a, b) => b.fecha.localeCompare(a.fecha) || b.creadoEn.localeCompare(a.creadoEn))
        .slice(0, 15),
    [avances, idsZona],
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

      <div className="px-5 pt-3 pb-1 overflow-x-auto">
        <div className="flex gap-2 w-max">
          <FilterChip active={zonaFiltro === 'todas'} onClick={() => setZonaFiltro('todas')} label="Todas las zonas" />
          {ZONAS.map((z) => (
            <FilterChip
              key={z.id}
              active={zonaFiltro === z.id}
              onClick={() => setZonaFiltro(z.id)}
              label={z.nombre}
            />
          ))}
        </div>
      </div>

      <div className="px-5 py-4 space-y-7">
        {pendientes.length > 0 && (
          <div>
            <p className="text-[14.5px] font-bold text-ink-2 uppercase tracking-wide mb-2.5 px-1">
              Pendientes ({pendientes.length})
            </p>
            <div className="space-y-2.5">
              {pendientes.map((e) => (
                <SelectableRow
                  key={e.id}
                  elemento={e}
                  ejecutado={ejecutadoDe(e.id)}
                  showZona={zonaFiltro === 'todas'}
                  onClick={() => setSelected(e)}
                />
              ))}
            </div>
          </div>
        )}

        {completos.length > 0 && (
          <div>
            <p className="text-[14.5px] font-bold text-ink-2 uppercase tracking-wide mb-2.5 px-1">
              Completados ({completos.length})
            </p>
            <div className="space-y-2.5 opacity-80">
              {completos.map((e) => (
                <SelectableRow
                  key={e.id}
                  elemento={e}
                  ejecutado={ejecutadoDe(e.id)}
                  showZona={zonaFiltro === 'todas'}
                  onClick={() => setSelected(e)}
                />
              ))}
            </div>
          </div>
        )}

        {pendientes.length === 0 && completos.length === 0 && (
          <p className="text-[14.5px] text-ink-2 font-medium px-1">No hay elementos cargados en esta zona.</p>
        )}

        <div>
          <p className="text-[14.5px] font-bold text-ink-2 uppercase tracking-wide mb-2.5 px-1">
            Actividad reciente
          </p>
          {reciente.length === 0 ? (
            <p className="text-[14.5px] text-ink-2 font-medium px-1">Todavía no se registraron avances.</p>
          ) : (
            <div className="bg-surface rounded-2xl divide-y divide-white/[0.07] overflow-hidden">
              {reciente.map((a) => {
                const el = elementoById.get(a.elementoId);
                if (!el) return null;
                const cat = getCategoriaInfo(el.categoria);
                const zona = getZonaInfo(el.zona);
                const style = CATEGORY_STYLES[el.categoria];
                return (
                  <div key={a.id} className="px-3.5 py-3.5 flex items-center gap-3">
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${style.bar}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[15.5px] font-semibold text-ink truncate">
                        {el.nombre}{' '}
                        <span className="text-ink-2 font-normal">
                          · {cat.nombreSingular} · {formatNivel(el.altura)}
                          {zonaFiltro === 'todas' ? ` · ${zona.nombreCorto}` : ''}
                        </span>
                      </p>
                      <p className="text-[13.5px] text-ink-2 font-medium mt-0.5">
                        +{formatQty(a.cantidad, el.unidadMedida)} · {formatDate(a.fecha)}
                        {a.observaciones ? ` · ${a.observaciones}` : ''}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteAvance(a.id)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-ink-3 active:bg-white/[0.06] shrink-0"
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
  showZona,
  onClick,
}: {
  elemento: ElementoEstructural;
  ejecutado: number;
  showZona: boolean;
  onClick: () => void;
}) {
  const style = CATEGORY_STYLES[elemento.categoria];
  const percent = elemento.cantidad > 0 ? (ejecutado / elemento.cantidad) * 100 : 0;
  const zona = getZonaInfo(elemento.zona);
  return (
    <button
      onClick={onClick}
      className="w-full bg-surface rounded-2xl p-3.5 flex items-center gap-3.5 text-left active:bg-surface-2"
    >
      <PhotoThumb src={elemento.foto} sizeClass="w-14 h-14" />
      <div className="flex-1 min-w-0">
        <p className="text-[16px] font-bold text-ink truncate">
          {elemento.nombre}
          <span className="text-ink-2 font-medium">
            {' '}
            · {formatNivel(elemento.altura)}
            {showZona ? ` · ${zona.nombreCorto}` : ''}
          </span>
        </p>
        <div className="flex items-center gap-2.5 mt-2">
          <ProgressBar percent={percent} colorClass={style.bar} heightClass="h-2" />
          <span className="text-[13.5px] font-bold text-ink-2 shrink-0 tabular-nums">
            {formatQty(ejecutado, elemento.unidadMedida)}/{formatQty(elemento.cantidad, elemento.unidadMedida)}
          </span>
        </div>
      </div>
    </button>
  );
}

function FilterChip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-[15px] font-semibold whitespace-nowrap ${
        active ? 'bg-white text-black' : 'bg-white/[0.08] text-ink-2'
      }`}
    >
      {label}
    </button>
  );
}
