import { ArrowRight, HardHat } from 'lucide-react';
import { useMemo } from 'react';
import type { Tab } from '../App';
import { Header } from '../components/Header';
import { EmptyState } from '../components/ui/EmptyState';
import { ProgressRing } from '../components/ui/ProgressRing';
import { useProject } from '../store/ProjectContext';
import { CATEGORIAS, UNIDAD_LABELS, type UnidadMedida } from '../types';
import { CATEGORY_STYLES } from '../utils/categoryStyles';
import { formatDate, formatNumber } from '../utils/format';

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

export function InicioScreen({ onNavigate }: InicioScreenProps) {
  const { elementos, avances, ejecutadoDe } = useProject();

  const resumen = useMemo(() => {
    const porUnidad = new Map<UnidadMedida, UnitTotals>();
    let sumaPorcentajes = 0;

    for (const e of elementos) {
      const ejecutado = ejecutadoDe(e.id);
      mergeUnitTotals(porUnidad, e.unidadMedida, e.cantidad, ejecutado);
      sumaPorcentajes += e.cantidad > 0 ? Math.min(1, ejecutado / e.cantidad) : 0;
    }
    const percentGlobal = elementos.length > 0 ? (sumaPorcentajes / elementos.length) * 100 : 0;

    const porCategoria = CATEGORIAS.map((cat) => {
      const items = elementos.filter((e) => e.categoria === cat.id);
      const catPorUnidad = new Map<UnidadMedida, UnitTotals>();
      let sumaPct = 0;
      for (const e of items) {
        const ejecutado = ejecutadoDe(e.id);
        mergeUnitTotals(catPorUnidad, e.unidadMedida, e.cantidad, ejecutado);
        sumaPct += e.cantidad > 0 ? Math.min(1, ejecutado / e.cantidad) : 0;
      }
      const percent = items.length > 0 ? (sumaPct / items.length) * 100 : 0;
      return { cat, percent, porUnidad: catPorUnidad, items: items.length };
    }).filter((c) => c.items > 0);

    return { porUnidad, percentGlobal, porCategoria };
  }, [elementos, ejecutadoDe]);

  const ultimoAvance = useMemo(
    () => [...avances].sort((a, b) => b.fecha.localeCompare(a.fecha))[0],
    [avances],
  );

  if (elementos.length === 0) {
    return (
      <div>
        <Header title="EPET 24" subtitle="Estructura de hormigón" />
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
      <Header title="EPET 24" subtitle="Avance de estructura de hormigón" />

      <div className="px-5 py-4">
        <div className="bg-surface rounded-3xl p-5 flex items-center gap-5">
          <ProgressRing percent={resumen.percentGlobal} size={104} strokeWidth={11} colorClass="text-accent">
            <div className="text-center">
              <p className="text-[20px] font-bold text-ink leading-none">
                {formatNumber(resumen.percentGlobal)}%
              </p>
            </div>
          </ProgressRing>
          <div className="flex-1">
            <p className="text-[13px] text-ink-2 mb-1">Avance general del proyecto</p>
            {[...resumen.porUnidad.entries()].map(([unidad, { total, ejecutado }]) => (
              <p key={unidad} className="text-[18px] font-bold text-ink tabular-nums leading-snug">
                {formatNumber(ejecutado)}
                <span className="text-ink-2 font-medium text-[14px]">
                  {' '}
                  / {formatNumber(total)} {UNIDAD_LABELS[unidad].corta}
                </span>
              </p>
            ))}
          </div>
        </div>

        {ultimoAvance && (
          <p className="text-[12.5px] text-ink-2 text-center mt-3">
            Último avance registrado el {formatDate(ultimoAvance.fecha)}
          </p>
        )}
      </div>

      <div className="px-5 pb-4">
        <p className="text-[13px] font-semibold text-ink-2 uppercase tracking-wide mb-2 px-1">
          Por categoría
        </p>
        <div className="grid grid-cols-2 gap-3">
          {resumen.porCategoria.map(({ cat, percent, porUnidad, items }) => {
            const style = CATEGORY_STYLES[cat.id];
            const Icon = style.icon;
            return (
              <button
                key={cat.id}
                onClick={() => onNavigate('elementos')}
                className="bg-surface rounded-2xl p-4 flex flex-col items-center text-center active:bg-surface-2"
              >
                <ProgressRing percent={percent} size={68} strokeWidth={7} colorClass={style.ring}>
                  <Icon size={22} className={style.text600} strokeWidth={1.9} />
                </ProgressRing>
                <p className="text-[13px] font-semibold text-ink mt-2.5 leading-tight">
                  {cat.nombre}
                </p>
                <p className="text-[12px] text-ink-2 tabular-nums mt-0.5">
                  {[...porUnidad.entries()]
                    .map(([u, t]) => `${formatNumber(t.ejecutado)}/${formatNumber(t.total)} ${UNIDAD_LABELS[u].corta}`)
                    .join(' · ')}
                </p>
                <p className="text-[11px] text-ink-3 mt-0.5">
                  {items} tipo{items === 1 ? '' : 's'}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-5 pb-6">
        <button
          onClick={() => onNavigate('avance')}
          className="w-full bg-accent rounded-2xl p-4 flex items-center justify-between active:bg-blue-600"
        >
          <div className="text-left">
            <p className="text-white text-[15px] font-semibold">Registrar avance de hoy</p>
            <p className="text-white/70 text-[12.5px] mt-0.5">
              Marcá lo que se hormigonó en el día
            </p>
          </div>
          <ArrowRight size={20} className="text-white shrink-0" />
        </button>
      </div>
    </div>
  );
}
