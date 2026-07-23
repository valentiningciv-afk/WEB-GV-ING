import { ArrowRight, HardHat } from 'lucide-react';
import { useMemo } from 'react';
import type { Tab } from '../App';
import { Header } from '../components/Header';
import { EmptyState } from '../components/ui/EmptyState';
import { ProgressRing } from '../components/ui/ProgressRing';
import { useProject } from '../store/ProjectContext';
import { CATEGORIAS } from '../types';
import { CATEGORY_STYLES } from '../utils/categoryStyles';
import { formatDate, formatNumber } from '../utils/format';

interface InicioScreenProps {
  onNavigate: (tab: Tab) => void;
}

export function InicioScreen({ onNavigate }: InicioScreenProps) {
  const { elementos, avances, ejecutadoDe } = useProject();

  const resumen = useMemo(() => {
    const totalUnidades = elementos.reduce((s, e) => s + e.cantidad, 0);
    const totalEjecutado = elementos.reduce((s, e) => s + ejecutadoDe(e.id), 0);
    const volumenTotal = elementos.reduce((s, e) => s + e.volumen * e.cantidad, 0);
    const volumenEjecutado = elementos.reduce((s, e) => s + e.volumen * ejecutadoDe(e.id), 0);
    const porCategoria = CATEGORIAS.map((cat) => {
      const items = elementos.filter((e) => e.categoria === cat.id);
      const total = items.reduce((s, e) => s + e.cantidad, 0);
      const ejecutado = items.reduce((s, e) => s + ejecutadoDe(e.id), 0);
      return { cat, total, ejecutado, items: items.length };
    }).filter((c) => c.items > 0);
    return { totalUnidades, totalEjecutado, volumenTotal, volumenEjecutado, porCategoria };
  }, [elementos, ejecutadoDe]);

  const ultimoAvance = useMemo(
    () => [...avances].sort((a, b) => b.fecha.localeCompare(a.fecha))[0],
    [avances],
  );

  const percentGlobal =
    resumen.totalUnidades > 0 ? (resumen.totalEjecutado / resumen.totalUnidades) * 100 : 0;

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
              className="px-5 py-2.5 rounded-full bg-[#007AFF] text-white text-[14px] font-semibold active:bg-[#0062cc] flex items-center gap-1.5"
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
        <div className="bg-white rounded-3xl p-5 flex items-center gap-5">
          <ProgressRing percent={percentGlobal} size={104} strokeWidth={11} colorClass="text-[#007AFF]">
            <div className="text-center">
              <p className="text-[20px] font-bold text-[#1c1c1e] leading-none">
                {formatNumber(percentGlobal)}%
              </p>
            </div>
          </ProgressRing>
          <div className="flex-1">
            <p className="text-[13px] text-[#8e8e93]">Avance general del proyecto</p>
            <p className="text-[22px] font-bold text-[#1c1c1e] tabular-nums">
              {resumen.totalEjecutado}
              <span className="text-[#8e8e93] font-medium text-[16px]"> / {resumen.totalUnidades} u.</span>
            </p>
            <p className="text-[12.5px] text-[#8e8e93] mt-1">
              {formatNumber(resumen.volumenEjecutado)} / {formatNumber(resumen.volumenTotal)} m³ de hormigón
            </p>
          </div>
        </div>

        {ultimoAvance && (
          <p className="text-[12.5px] text-[#8e8e93] text-center mt-3">
            Último avance registrado el {formatDate(ultimoAvance.fecha)}
          </p>
        )}
      </div>

      <div className="px-5 pb-4">
        <p className="text-[13px] font-semibold text-[#6e6e73] uppercase tracking-wide mb-2 px-1">
          Por categoría
        </p>
        <div className="grid grid-cols-2 gap-3">
          {resumen.porCategoria.map(({ cat, total, ejecutado, items }) => {
            const style = CATEGORY_STYLES[cat.id];
            const percent = total > 0 ? (ejecutado / total) * 100 : 0;
            const Icon = style.icon;
            return (
              <button
                key={cat.id}
                onClick={() => onNavigate('elementos')}
                className="bg-white rounded-2xl p-4 flex flex-col items-center text-center active:bg-black/[0.02]"
              >
                <ProgressRing percent={percent} size={68} strokeWidth={7} colorClass={style.ring}>
                  <Icon size={22} className={style.text600} strokeWidth={1.9} />
                </ProgressRing>
                <p className="text-[13px] font-semibold text-[#1c1c1e] mt-2.5 leading-tight">
                  {cat.nombre}
                </p>
                <p className="text-[12px] text-[#8e8e93] tabular-nums mt-0.5">
                  {ejecutado}/{total} · {items} tipo{items === 1 ? '' : 's'}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-5 pb-6">
        <button
          onClick={() => onNavigate('avance')}
          className="w-full bg-[#1c1c1e] rounded-2xl p-4 flex items-center justify-between active:bg-[#2c2c2e]"
        >
          <div className="text-left">
            <p className="text-white text-[15px] font-semibold">Registrar avance de hoy</p>
            <p className="text-[#98989d] text-[12.5px] mt-0.5">
              Marcá lo que se hormigonó en el día
            </p>
          </div>
          <ArrowRight size={20} className="text-white shrink-0" />
        </button>
      </div>
    </div>
  );
}
