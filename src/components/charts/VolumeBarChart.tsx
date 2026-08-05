import { useState } from 'react';
import type { DiaVolumen } from '../../utils/timeSeries';
import { ZONA_STYLES } from '../../utils/zonaStyles';
import { getZonaInfo, type Zona } from '../../types';
import { formatDateShort, formatNumber } from '../../utils/format';

interface VolumeBarChartProps {
  data: DiaVolumen[];
}

const COL_WIDTH = 46;
const CHART_HEIGHT = 140;
const SCROLLS = 7; // a partir de esta cantidad de días, el eje se vuelve scrolleable

export function VolumeBarChart({ data }: VolumeBarChartProps) {
  const [selected, setSelected] = useState<number | null>(data.length - 1 >= 0 ? data.length - 1 : null);
  const max = Math.max(...data.map((d) => d.volumen), 0.0001);
  const scrollable = data.length > SCROLLS;
  const rowWidth = scrollable ? data.length * COL_WIDTH : undefined;
  const selectedDia = selected !== null ? data[selected] : null;

  return (
    <div className="bg-surface rounded-2xl p-4">
      <div className="flex items-baseline justify-between mb-3">
        <p className="text-[15px] font-bold text-ink">Volumen vertido por día</p>
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
            const heightPx = Math.max(4, (d.volumen / max) * (CHART_HEIGHT - 4));
            const isSelected = selected === i;
            return (
              <button
                key={d.fecha}
                onClick={() => setSelected(isSelected ? null : i)}
                aria-label={`${formatDateShort(d.fecha, true)}: ${formatNumber(d.volumen)} m³`}
                className="relative flex flex-col items-center justify-end shrink-0 h-full outline-none"
                style={{ width: COL_WIDTH }}
              >
                <span
                  className={`w-6 rounded-t-[4px] transition-all duration-300 ease-out ${
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
            <div key={d.fecha} className="shrink-0 text-center" style={{ width: COL_WIDTH }}>
              <span className="text-[11px] font-semibold text-ink-3">{formatDateShort(d.fecha)}</span>
            </div>
          ))}
        </div>
      </div>

      {selectedDia && (
        <div className="mt-3.5 animate-fade-rise">
          <DiaTooltip dia={selectedDia} />
        </div>
      )}
    </div>
  );
}

function DiaTooltip({ dia }: { dia: DiaVolumen }) {
  const zonas = Object.entries(dia.porZona) as [Zona, number][];
  return (
    <div className="bg-surface-3 rounded-2xl shadow-lg ring-1 ring-veil/[0.1] p-3.5 text-left">
      <p className="text-[12.5px] font-bold text-ink-2">{formatDateShort(dia.fecha, true)}</p>
      <p className="text-[22px] font-extrabold text-ink tabular-nums leading-tight mt-0.5">
        {formatNumber(dia.volumen)} <span className="text-[13px] font-bold text-ink-2">m³</span>
      </p>
      <p className="text-[12px] text-ink-2 font-medium mt-0.5">
        {dia.registros} registro{dia.registros === 1 ? '' : 's'}
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
