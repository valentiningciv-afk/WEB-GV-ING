import { ClipboardList } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Header } from '../components/Header';
import { EmptyState } from '../components/ui/EmptyState';
import { ProgressBar } from '../components/ui/ProgressBar';
import { useProject } from '../store/ProjectContext';
import {
  CATEGORIAS,
  getCategoriaInfo,
  getZonaInfo,
  UNIDAD_LABELS,
  ZONAS,
  type Categoria,
  type UnidadMedida,
  type Zona,
} from '../types';
import { CATEGORY_STYLES } from '../utils/categoryStyles';
import { formatDate, formatNumber, formatQty } from '../utils/format';

type CategoriaFiltro = 'todas' | Categoria;
type ZonaFiltro = 'todas' | Zona;

interface UnitTotals {
  total: number;
  ejecutado: number;
}

function mergeUnitTotals(map: Map<UnidadMedida, UnitTotals>, unidad: UnidadMedida, total: number, ejecutado: number) {
  const prev = map.get(unidad) ?? { total: 0, ejecutado: 0 };
  map.set(unidad, { total: prev.total + total, ejecutado: prev.ejecutado + ejecutado });
}

export function ReportesScreen() {
  const { elementos, avances, ejecutadoDe } = useProject();
  const [zonaFiltro, setZonaFiltro] = useState<ZonaFiltro>('todas');
  const [catFiltro, setCatFiltro] = useState<CategoriaFiltro>('todas');

  const porZona = useMemo(
    () =>
      ZONAS.map((zona) => {
        const items = elementos.filter((e) => e.zona === zona.id);
        const porUnidad = new Map<UnidadMedida, UnitTotals>();
        let sumaPct = 0;
        for (const e of items) {
          const ejecutado = ejecutadoDe(e.id);
          mergeUnitTotals(porUnidad, e.unidadMedida, e.cantidad, ejecutado);
          sumaPct += e.cantidad > 0 ? Math.min(1, ejecutado / e.cantidad) : 0;
        }
        const percent = items.length > 0 ? (sumaPct / items.length) * 100 : 0;
        return { zona, percent, porUnidad, items: items.length };
      }).filter((z) => z.items > 0),
    [elementos, ejecutadoDe],
  );

  const elementosFiltrados = useMemo(
    () =>
      elementos.filter(
        (e) =>
          (zonaFiltro === 'todas' || e.zona === zonaFiltro) &&
          (catFiltro === 'todas' || e.categoria === catFiltro),
      ),
    [elementos, zonaFiltro, catFiltro],
  );

  const grupos = useMemo(() => {
    const porFecha = new Map<string, { elementoId: string; cantidad: number; observaciones: string; id: string }[]>();
    const idsFiltrados = new Set(elementosFiltrados.map((e) => e.id));
    for (const a of avances) {
      if (!idsFiltrados.has(a.elementoId)) continue;
      const arr = porFecha.get(a.fecha) ?? [];
      arr.push(a);
      porFecha.set(a.fecha, arr);
    }
    return [...porFecha.entries()].sort((a, b) => b[0].localeCompare(a[0]));
  }, [avances, elementosFiltrados]);

  const elementoById = useMemo(() => {
    const map = new Map<string, (typeof elementos)[number]>();
    for (const e of elementos) map.set(e.id, e);
    return map;
  }, [elementos]);

  if (elementos.length === 0) {
    return (
      <div>
        <Header title="Reportes" subtitle="Acumulado del proyecto" />
        <EmptyState
          icon={ClipboardList}
          title="Sin datos todavía"
          description="Cuando cargues elementos y registres avances, acá vas a ver el acumulado por zona y el historial completo."
        />
      </div>
    );
  }

  return (
    <div>
      <Header title="Reportes" subtitle="Acumulado a la fecha" />

      <div className="px-5 py-4">
        <p className="text-[13px] font-semibold text-ink-2 uppercase tracking-wide mb-2 px-1">
          Acumulado por zona
        </p>
        <div className="space-y-2">
          {porZona.map(({ zona, percent, porUnidad, items }) => (
            <div key={zona.id} className="bg-surface rounded-2xl p-3.5">
              <div className="flex items-center justify-between mb-1.5">
                <div>
                  <p className="text-[14.5px] font-semibold text-ink">{zona.nombre}</p>
                  <p className="text-[11.5px] text-ink-2">
                    {items} tipo{items === 1 ? '' : 's'} de elemento
                  </p>
                </div>
                <p className="text-[15px] font-bold text-ink tabular-nums">{formatNumber(percent)}%</p>
              </div>
              <ProgressBar percent={percent} colorClass="bg-accent" heightClass="h-1.5" />
              <p className="text-[11.5px] text-ink-2 tabular-nums mt-1.5">
                {[...porUnidad.entries()]
                  .map(([u, t]) => `${formatNumber(t.ejecutado)}/${formatNumber(t.total)} ${UNIDAD_LABELS[u].corta}`)
                  .join(' · ')}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 pt-1 overflow-x-auto">
        <div className="flex gap-2 w-max">
          <FilterChip active={zonaFiltro === 'todas'} onClick={() => setZonaFiltro('todas')} label="Todas las zonas" />
          {ZONAS.map((z) => (
            <FilterChip key={z.id} active={zonaFiltro === z.id} onClick={() => setZonaFiltro(z.id)} label={z.nombre} />
          ))}
        </div>
      </div>
      <div className="px-5 pt-2 pb-1 overflow-x-auto">
        <div className="flex gap-2 w-max">
          <FilterChip subtle active={catFiltro === 'todas'} onClick={() => setCatFiltro('todas')} label="Todas" />
          {CATEGORIAS.map((c) => (
            <FilterChip subtle key={c.id} active={catFiltro === c.id} onClick={() => setCatFiltro(c.id)} label={c.nombre} />
          ))}
        </div>
      </div>

      <div className="px-5 py-4">
        <p className="text-[13px] font-semibold text-ink-2 uppercase tracking-wide mb-2 px-1">
          Acumulado por elemento
        </p>
        {elementosFiltrados.length === 0 ? (
          <p className="text-[13px] text-ink-2 px-1">Sin elementos con estos filtros.</p>
        ) : (
          <div className="bg-surface rounded-2xl divide-y divide-white/[0.07] overflow-hidden">
            {elementosFiltrados.map((e) => {
              const ejecutado = ejecutadoDe(e.id);
              const percent = e.cantidad > 0 ? (ejecutado / e.cantidad) * 100 : 0;
              const style = CATEGORY_STYLES[e.categoria];
              const cat = getCategoriaInfo(e.categoria);
              const zona = getZonaInfo(e.zona);
              return (
                <div key={e.id} className="px-3.5 py-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="min-w-0">
                      <p className="text-[14px] font-semibold text-ink truncate">{e.nombre}</p>
                      <p className="text-[11.5px] text-ink-2">
                        {cat.nombreSingular} · {zona.nombreCorto}
                      </p>
                    </div>
                    <p className="text-[13px] font-bold text-ink tabular-nums shrink-0 ml-2">
                      {formatNumber(percent)}%
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <ProgressBar percent={percent} colorClass={style.bar} heightClass="h-1.5" />
                    <span className="text-[11.5px] text-ink-2 tabular-nums shrink-0">
                      {formatQty(ejecutado, e.unidadMedida)}/{formatQty(e.cantidad, e.unidadMedida)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="px-5 pb-8">
        <p className="text-[13px] font-semibold text-ink-2 uppercase tracking-wide mb-2 px-1">
          Historial cronológico
        </p>
        {grupos.length === 0 ? (
          <p className="text-[13px] text-ink-2 px-1">Sin registros de avance todavía.</p>
        ) : (
          <div className="space-y-3">
            {grupos.map(([fecha, entradas]) => {
              const totalesPorUnidad = new Map<UnidadMedida, number>();
              for (const a of entradas) {
                const el = elementoById.get(a.elementoId);
                if (!el) continue;
                totalesPorUnidad.set(
                  el.unidadMedida,
                  (totalesPorUnidad.get(el.unidadMedida) ?? 0) + a.cantidad,
                );
              }
              return (
                <div key={fecha} className="bg-surface rounded-2xl overflow-hidden">
                  <div className="px-3.5 py-2.5 bg-white/[0.04] flex items-center justify-between gap-2">
                    <p className="text-[13px] font-semibold text-ink">{formatDate(fecha)}</p>
                    <p className="text-[12px] text-ink-2 tabular-nums">
                      {[...totalesPorUnidad.entries()]
                        .map(([u, total]) => `+${formatNumber(total)} ${UNIDAD_LABELS[u].corta}`)
                        .join(' · ')}
                    </p>
                  </div>
                  <div className="divide-y divide-white/[0.07]">
                    {entradas.map((a) => {
                      const el = elementoById.get(a.elementoId);
                      if (!el) return null;
                      const style = CATEGORY_STYLES[el.categoria];
                      const zona = getZonaInfo(el.zona);
                      return (
                        <div key={a.id} className="px-3.5 py-2.5 flex items-center gap-2.5">
                          <span className={`w-2 h-2 rounded-full shrink-0 ${style.bar}`} />
                          <p className="text-[13.5px] text-ink flex-1 truncate">
                            {el.nombre} <span className="text-ink-2">· {zona.nombreCorto}</span>
                            {a.observaciones && (
                              <span className="text-ink-2"> · {a.observaciones}</span>
                            )}
                          </p>
                          <span className="text-[13px] font-semibold text-ink tabular-nums shrink-0">
                            +{formatQty(a.cantidad, el.unidadMedida)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  subtle,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  subtle?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full whitespace-nowrap ${
        subtle ? 'px-3 py-1 text-[12px]' : 'px-3.5 py-1.5 text-[13px]'
      } font-medium ${active ? 'bg-white text-black' : 'bg-white/[0.08] text-ink-2'}`}
    >
      {label}
    </button>
  );
}
