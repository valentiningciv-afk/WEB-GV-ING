import { ArrowRight, HardHat } from 'lucide-react';
import { useMemo } from 'react';
import type { Tab } from '../App';
import { Header } from '../components/Header';
import { ThemeToggle } from '../components/ThemeToggle';
import { EmptyState } from '../components/ui/EmptyState';
import { ProgressRing } from '../components/ui/ProgressRing';
import { useProject } from '../store/ProjectContext';
import { CATEGORIAS, UNIDAD_LABELS, ZONAS, type UnidadMedida } from '../types';
import { CATEGORY_STYLES } from '../utils/categoryStyles';
import { formatDate, formatNumber, formatPercent } from '../utils/format';
import { ZONA_STYLES } from '../utils/zonaStyles';

interface InicioScreenProps {
  onNavigate: (tab: Tab) => void;
}

interface UnitTotals {
  total: number;
  ejecutado: number;
}

function mergeUnitTotals(map: Map<UnidadMedida, UnitTotals>, unidad: UnidadMedida, total: number, ejecutado: number) {
  const prev = map.get(unidad) ?? { total: 0, ejecutado: 0 };
  map.set(unidad, { total: prev.total + total, ejecutado: prev.ejecutado + ejecutado });
}

/** % de avance de una categoría: si todos sus elementos comparten unidad de
 * medida (el caso normal), es la razón directa ejecutado/total. Si mezcla
 * unidades, se promedia el % de cada elemento para no sumar peras con
 * manzanas. */
function percentDeItems(items: { id: string; cantidad: number }[], ejecutadoDe: (id: string) => number, porUnidad: Map<UnidadMedida, UnitTotals>) {
  if (porUnidad.size === 1) {
    const [{ total, ejecutado }] = [...porUnidad.values()];
    return total > 0 ? (ejecutado / total) * 100 : 0;
  }
  let sumaPct = 0;
  for (const item of items) {
    const ejecutado = ejecutadoDe(item.id);
    sumaPct += item.cantidad > 0 ? Math.min(1, ejecutado / item.cantidad) : 0;
  }
  return items.length > 0 ? (sumaPct / items.length) * 100 : 0;
}

export function InicioScreen({ onNavigate }: InicioScreenProps) {
  const { elementos, avances, ejecutadoDe } = useProject();

  const resumen = useMemo(() => {
    const porCategoria = CATEGORIAS.map((cat) => {
      const items = elementos.filter((e) => e.categoria === cat.id);
      if (items.length === 0) return null;
      const porUnidad = new Map<UnidadMedida, UnitTotals>();
      for (const e of items) {
        mergeUnitTotals(porUnidad, e.unidadMedida, e.cantidad, ejecutadoDe(e.id));
      }
      const percent = percentDeItems(items, ejecutadoDe, porUnidad);
      return { cat, percent, porUnidad };
    }).filter((c): c is NonNullable<typeof c> => c !== null);

    const porZona = ZONAS.map((zona) => {
      const items = elementos.filter((e) => e.zona === zona.id);
      if (items.length === 0) return null;
      const porUnidad = new Map<UnidadMedida, UnitTotals>();
      for (const e of items) {
        mergeUnitTotals(porUnidad, e.unidadMedida, e.cantidad, ejecutadoDe(e.id));
      }
      const percent = percentDeItems(items, ejecutadoDe, porUnidad);
      return { zona, percent, porUnidad, items: items.length };
    }).filter((z): z is NonNullable<typeof z> => z !== null);

    return { porCategoria, porZona };
  }, [elementos, ejecutadoDe]);

  const ultimoAvance = useMemo(
    () =>
      [...avances]
        .filter((a) => !a.fechaAproximada)
        .sort((a, b) => b.fecha.localeCompare(a.fecha))[0],
    [avances],
  );

  if (elementos.length === 0) {
    return (
      <div>
        <Header title="EPET 24" subtitle="Estructura de hormigón" action={<ThemeToggle />} />
        <EmptyState
          icon={HardHat}
          title="Empecemos"
          description="Cargá los elementos estructurales del proyecto para empezar a controlar el avance de hormigón."
          action={
            <button
              onClick={() => onNavigate('elementos')}
              className="px-5 py-2.5 rounded-full bg-accent text-white text-[14px] font-semibold active:bg-blue-600 flex items-center gap-1.5"
            >
              Cargar elementos <ArrowRight size={16} />
            </button>
          }
        />
      </div>
    );
  }

  return (
    <div>
      <Header title="EPET 24" subtitle="Avance de estructura de hormigón" action={<ThemeToggle />} />

      <div className="px-5 pt-5 pb-2">
        <div className="grid grid-cols-2 gap-3.5">
          {resumen.porCategoria.map(({ cat, percent, porUnidad }) => {
            const style = CATEGORY_STYLES[cat.id];
            return (
              <div
                key={cat.id}
                className={`rounded-[28px] p-5 flex flex-col items-center text-center ${style.bg50} ring-1 ring-veil/[0.06]`}
              >
                <ProgressRing percent={percent} size={116} strokeWidth={11} colorClass={style.ring}>
                  <p className="text-[34px] font-extrabold text-ink leading-none tabular-nums">
                    {formatPercent(percent)}
                  </p>
                </ProgressRing>
                <p className="text-[17px] font-bold text-ink mt-3.5 leading-tight">
                  {cat.nombre}
                </p>
                <p className="text-[13.5px] text-ink-2 tabular-nums mt-1 font-medium">
                  {[...porUnidad.entries()]
                    .map(([u, t]) => `${formatNumber(t.ejecutado)}/${formatNumber(t.total)} ${UNIDAD_LABELS[u].corta}`)
                    .join(' · ')}
                </p>
              </div>
            );
          })}
        </div>

        {ultimoAvance && (
          <p className="text-[13px] text-ink-2 text-center mt-4 font-medium">
            Último avance registrado el {formatDate(ultimoAvance.fecha)}
          </p>
        )}
      </div>

      <div className="px-5 pt-5 pb-4">
        <p className="text-[15px] font-extrabold text-ink uppercase tracking-wide mb-3 px-1">
          Por zona
        </p>
        <div className="space-y-3">
          {resumen.porZona.map(({ zona, percent, porUnidad, items }) => {
            const zstyle = ZONA_STYLES[zona.id];
            return (
              <button
                key={zona.id}
                onClick={() => onNavigate('elementos')}
                className={`w-full rounded-[26px] p-4.5 flex items-center gap-4 active:brightness-110 ${zstyle.bg} ring-1 ring-veil/[0.06]`}
              >
                <ProgressRing percent={percent} size={76} strokeWidth={8} colorClass={zstyle.ring}>
                  <p className="text-[19px] font-extrabold text-ink leading-none tabular-nums">
                    {formatPercent(percent)}
                  </p>
                </ProgressRing>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-[19px] font-bold text-ink leading-tight">
                    {zona.nombre}
                  </p>
                  <p className="text-[14px] text-ink-2 tabular-nums mt-1 font-medium leading-snug">
                    {[...porUnidad.entries()]
                      .map(([u, t]) => `${formatNumber(t.ejecutado)}/${formatNumber(t.total)} ${UNIDAD_LABELS[u].corta}`)
                      .join(' · ')}
                  </p>
                  <p className="text-[13px] text-ink-3 mt-0.5">
                    {items} tipo{items === 1 ? '' : 's'} de elemento
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-5 pb-6">
        <button
          onClick={() => onNavigate('avance')}
          className="w-full bg-accent rounded-[26px] p-5 flex items-center justify-between active:bg-blue-600"
        >
          <div className="text-left">
            <p className="text-white text-[18px] font-bold">Registrar avance de hoy</p>
            <p className="text-white/75 text-[13.5px] mt-0.5 font-medium">
              Marcá lo que se hormigonó en el día
            </p>
          </div>
          <ArrowRight size={24} className="text-white shrink-0" />
        </button>
      </div>
    </div>
  );
}
