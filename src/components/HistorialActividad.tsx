import { ChevronDown, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useProject } from '../store/ProjectContext';
import { getCategoriaInfo, getZonaInfo, type AvanceEntry, type UnidadMedida } from '../types';
import { CATEGORY_STYLES } from '../utils/categoryStyles';
import { formatDate, formatNivel, formatNumber, formatQty } from '../utils/format';

export function HistorialActividad() {
  const { elementos, avances, deleteAvance } = useProject();
  const [expandidas, setExpandidas] = useState<Set<string> | null>(null);

  const elementoById = useMemo(() => {
    const map = new Map<string, (typeof elementos)[number]>();
    for (const e of elementos) map.set(e.id, e);
    return map;
  }, [elementos]);

  const grupos = useMemo(() => {
    const porFecha = new Map<string, AvanceEntry[]>();
    for (const a of avances) {
      if (a.fechaAproximada) continue;
      const arr = porFecha.get(a.fecha) ?? [];
      arr.push(a);
      porFecha.set(a.fecha, arr);
    }
    return [...porFecha.entries()].sort((a, b) => b[0].localeCompare(a[0]));
  }, [avances]);

  // Por defecto solo la fecha más reciente arranca desplegada.
  const abiertas = expandidas ?? new Set(grupos.slice(0, 1).map(([fecha]) => fecha));

  function toggle(fecha: string) {
    const next = new Set(abiertas);
    if (next.has(fecha)) next.delete(fecha);
    else next.add(fecha);
    setExpandidas(next);
  }

  if (grupos.length === 0) {
    return (
      <p className="text-[14.5px] text-ink-2 font-medium px-1">Todavía no se registraron avances.</p>
    );
  }

  return (
    <div className="space-y-3">
      {grupos.map(([fecha, entradas]) => {
        const totalesPorUnidad = new Map<UnidadMedida, number>();
        for (const a of entradas) {
          const el = elementoById.get(a.elementoId);
          if (!el) continue;
          totalesPorUnidad.set(el.unidadMedida, (totalesPorUnidad.get(el.unidadMedida) ?? 0) + a.cantidad);
        }
        const abierta = abiertas.has(fecha);
        return (
          <div key={fecha} className="bg-surface rounded-2xl overflow-hidden">
            <button
              onClick={() => toggle(fecha)}
              className="w-full px-4 py-3.5 bg-veil/[0.04] flex items-center justify-between gap-2 text-left active:bg-veil/[0.07]"
            >
              <div>
                <p className="text-[15px] font-bold text-ink">{formatDate(fecha)}</p>
                <p className="text-[12.5px] text-ink-2 font-semibold tabular-nums mt-0.5">
                  {[...totalesPorUnidad.entries()]
                    .map(([u, total]) => `+${formatNumber(total)} ${u === 'u' ? 'u.' : 'm²'}`)
                    .join(' · ')}{' '}
                  · {entradas.length} registro{entradas.length === 1 ? '' : 's'}
                </p>
              </div>
              <ChevronDown
                size={20}
                className={`text-ink-3 shrink-0 transition-transform duration-200 ${abierta ? 'rotate-180' : ''}`}
              />
            </button>
            {abierta && (
              <div className="divide-y divide-veil/[0.07] animate-fade-in">
                {entradas.map((a) => {
                  const el = elementoById.get(a.elementoId);
                  if (!el) return null;
                  const cat = getCategoriaInfo(el.categoria);
                  const zona = getZonaInfo(el.zona);
                  const style = CATEGORY_STYLES[el.categoria];
                  return (
                    <div key={a.id} className="px-4 py-3.5 flex items-center gap-3">
                      <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${style.bar}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[15px] font-semibold text-ink truncate">
                          {el.nombre}{' '}
                          <span className="text-ink-2 font-normal">
                            · {cat.nombreSingular} · {formatNivel(el.altura)} · {zona.nombreCorto}
                          </span>
                        </p>
                        <p className="text-[13.5px] text-ink-2 font-medium mt-0.5">
                          +{formatQty(a.cantidad, el.unidadMedida)}
                          {a.observaciones ? ` · ${a.observaciones}` : ''}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteAvance(a.id)}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-ink-3 active:bg-veil/[0.06] shrink-0"
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
        );
      })}
    </div>
  );
}
