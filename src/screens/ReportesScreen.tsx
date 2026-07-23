import { ClipboardList } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Header } from '../components/Header';
import { EmptyState } from '../components/ui/EmptyState';
import { ProgressBar } from '../components/ui/ProgressBar';
import { useProject } from '../store/ProjectContext';
import { CATEGORIAS, getCategoriaInfo, type Categoria } from '../types';
import { CATEGORY_STYLES } from '../utils/categoryStyles';
import { formatDate, formatNumber } from '../utils/format';

type Filter = 'todas' | Categoria;

export function ReportesScreen() {
  const { elementos, avances, ejecutadoDe } = useProject();
  const [filter, setFilter] = useState<Filter>('todas');

  const elementosFiltrados = useMemo(
    () => (filter === 'todas' ? elementos : elementos.filter((e) => e.categoria === filter)),
    [elementos, filter],
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
          description="Cuando cargues elementos y registres avances, acá vas a ver el acumulado y el historial completo."
        />
      </div>
    );
  }

  return (
    <div>
      <Header title="Reportes" subtitle="Acumulado a la fecha" />

      <div className="px-5 pt-3 pb-1 overflow-x-auto">
        <div className="flex gap-2 w-max">
          <FilterChip active={filter === 'todas'} onClick={() => setFilter('todas')} label="Todas" />
          {CATEGORIAS.map((c) => (
            <FilterChip key={c.id} active={filter === c.id} onClick={() => setFilter(c.id)} label={c.nombre} />
          ))}
        </div>
      </div>

      <div className="px-5 py-4">
        <p className="text-[13px] font-semibold text-[#6e6e73] uppercase tracking-wide mb-2 px-1">
          Acumulado por elemento
        </p>
        <div className="bg-white rounded-2xl divide-y divide-black/[0.05] overflow-hidden">
          {elementosFiltrados.map((e) => {
            const ejecutado = ejecutadoDe(e.id);
            const percent = e.cantidad > 0 ? (ejecutado / e.cantidad) * 100 : 0;
            const style = CATEGORY_STYLES[e.categoria];
            const cat = getCategoriaInfo(e.categoria);
            return (
              <div key={e.id} className="px-3.5 py-3">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="min-w-0">
                    <p className="text-[14px] font-semibold text-[#1c1c1e] truncate">{e.nombre}</p>
                    <p className="text-[11.5px] text-[#8e8e93]">{cat.nombreSingular}</p>
                  </div>
                  <p className="text-[13px] font-bold text-[#1c1c1e] tabular-nums shrink-0 ml-2">
                    {formatNumber(percent)}%
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <ProgressBar percent={percent} colorClass={style.bar} heightClass="h-1.5" />
                  <span className="text-[11.5px] text-[#8e8e93] tabular-nums shrink-0">
                    {ejecutado}/{e.cantidad}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="px-5 pb-8">
        <p className="text-[13px] font-semibold text-[#6e6e73] uppercase tracking-wide mb-2 px-1">
          Historial cronológico
        </p>
        {grupos.length === 0 ? (
          <p className="text-[13px] text-[#8e8e93] px-1">Sin registros de avance todavía.</p>
        ) : (
          <div className="space-y-3">
            {grupos.map(([fecha, entradas]) => {
              const totalUnidades = entradas.reduce((s, e) => s + e.cantidad, 0);
              return (
                <div key={fecha} className="bg-white rounded-2xl overflow-hidden">
                  <div className="px-3.5 py-2.5 bg-black/[0.03] flex items-center justify-between">
                    <p className="text-[13px] font-semibold text-[#1c1c1e]">{formatDate(fecha)}</p>
                    <p className="text-[12px] text-[#8e8e93] tabular-nums">
                      +{totalUnidades} unidad{totalUnidades === 1 ? '' : 'es'}
                    </p>
                  </div>
                  <div className="divide-y divide-black/[0.05]">
                    {entradas.map((a) => {
                      const el = elementoById.get(a.elementoId);
                      if (!el) return null;
                      const style = CATEGORY_STYLES[el.categoria];
                      return (
                        <div key={a.id} className="px-3.5 py-2.5 flex items-center gap-2.5">
                          <span className={`w-2 h-2 rounded-full shrink-0 ${style.bar}`} />
                          <p className="text-[13.5px] text-[#1c1c1e] flex-1 truncate">
                            {el.nombre}
                            {a.observaciones && (
                              <span className="text-[#8e8e93]"> · {a.observaciones}</span>
                            )}
                          </p>
                          <span className="text-[13px] font-semibold text-[#1c1c1e] tabular-nums shrink-0">
                            +{a.cantidad}
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

function FilterChip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium whitespace-nowrap ${
        active ? 'bg-[#1c1c1e] text-white' : 'bg-black/[0.06] text-[#3a3a3c]'
      }`}
    >
      {label}
    </button>
  );
}
