import { useState } from 'react';
import type { MesVolumen } from '../../utils/timeSeries';
import { ZONA_STYLES } from '../../utils/zonaStyles';
import { getZonaInfo, type Zona } from '../../types';
import { formatMonth, formatNumber } from '../../utils/format';

interface VolumeBarChartProps {
  data: MesVolumen[];
}

const COL_WIDTH = 56;
const CHART_HEIGHT = 140;
const SCROLLS = 7; // a partir de esta cantidad de meses, el eje se vuelve scrolleable

export function VolumeBarChart({ data }: VolumeBarChartProps) {
  const [selected, setSelected] = useState<number | null>(data.length - 1 >= 0 ? data.length - 1 : null);
  const max = Math.max(...data.map((d) => d.volumenVigas), 0.0001);
  const scrollable = data.length > SCROLLS;
  const rowWidth = scrollable ? data.length * COL_WIDTH : undefined;
  const selectedMes = selected !== null ? data[selected] : null;

  return (
    <div className="bg-surface rounded-2xl p-4">
      <div className="flex items-baseline justify-between mb-3">
        <p className="text-[15px] font-bold text-ink">Vigas aéreas — m³ por mes</p>
        <span className="text-[12.5px] font-semibold text-ink-3">m³</span>
      </div>

      <div className="overflow-x-auto -mx-1 px-1">
        <div
          className={`relative flex items-end ${scrollable ? '' : 'w-full justify-around'}`}
          style={{ height: CHART_HEIGHT, minWidth: rowWidth }}
        >
          <div className="absolute inset-x-0 top-0 border-t border-veil/[0.08]" />
          <div className="absolute inset-x-0 bottom-0 border-t border-veil/[0.14]" />

          {data.map((d, i) => {
            const heightPx = Math.max(4, (d.volumenVigas / max) * (CHART_HEIGHT - 4));
            const isSelected = selected === i;
            return (
              <button
                key={d.mes}
                onClick={() => setSelected(isSelected ? null : i)}
                aria-label={`${formatMonth(d.mes, true)}: ${formatNumber(d.volumenVigas)} m³ de vigas aéreas`}
                className="relative flex flex-col items-center justify-end shrink-0 h-full outline-none"
                style={{ width: COL_WIDTH }}
              >
                <span
                  className={`w-7 rounded-t-[4px] transition-all duration-300 ease-out ${
                    isSelected ? 'bg-accent' : 'bg-accent/45'
                  }`}
                  style={{ height: heightPx }}
                />
              </button>
            );
          })}
        </div>
      </div>

      <div className="overflow-x-auto -mx-1 px-1 mt-1">
        <div className={`flex ${scrollable ? '' : 'w-full justify-around'}`} style={{ minWidth: rowWidth }}>
          {data.map((d) => (
            <div key={d.mes} className="shrink-0 text-center" style={{ width: COL_WIDTH }}>
              <span className="text-[11.5px] font-semibold text-ink-3">{formatMonth(d.mes)}</span>
            </div>
          ))}
        </div>
      </div>

      {selectedMes && (
        <div className="mt-3.5 animate-fade-rise">
          <MesTooltip mes={selectedMes} />
        </div>
      )}
    </div>
  );
}

function MesTooltip({ mes }: { mes: MesVolumen }) {
  const zonas = Object.entries(mes.porZona) as [Zona, number][];
  return (
    <div className="bg-surface-3 rounded-2xl shadow-lg ring-1 ring-veil/[0.1] p-3.5 text-left">
      <p className="text-[12.5px] font-bold text-ink-2">{formatMonth(mes.mes, true)}</p>
      <p className="text-[22px] font-extrabold text-ink tabular-nums leading-tight mt-0.5">
        {formatNumber(mes.volumenVigas)} <span className="text-[13px] font-bold text-ink-2">m³ de vigas</span>
      </p>
      <p className="text-[12px] text-ink-2 font-medium mt-0.5">
        {formatNumber(mes.vigas)} viga{mes.vigas === 1 ? '' : 's'} · {mes.registros} registro{mes.registros === 1 ? '' : 's'}
      </p>
      {zonas.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {zonas.map(([zonaId, vol]) => (
            <span
              key={zonaId}
              className={`text-[10.5px] font-bold px-2 py-1 rounded-full ${ZONA_STYLES[zonaId].bg} ${ZONA_STYLES[zonaId].text}`}
            >
              {getZonaInfo(zonaId).nombreCorto} {formatNumber(vol)}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
