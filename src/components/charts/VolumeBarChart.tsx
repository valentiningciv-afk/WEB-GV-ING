import { useState } from 'react';
import type { MesVolumen } from '../../utils/timeSeries';
import { ZONA_CHART_STYLES } from '../../utils/zonaStyles';
import { ZONAS, getZonaInfo, type Zona } from '../../types';
import { formatMonth, formatNumber } from '../../utils/format';
import { niceMax } from '../../utils/chartMath';

interface VolumeBarChartProps {
  data: MesVolumen[];
}

const COL_WIDTH = 60;
const CHART_HEIGHT = 168;
const SCROLLS = 7; // a partir de esta cantidad de meses, el eje se vuelve scrolleable

export function VolumeBarChart({ data }: VolumeBarChartProps) {
  const [selected, setSelected] = useState<number | null>(data.length - 1 >= 0 ? data.length - 1 : null);
  const max = niceMax(Math.max(...data.map((d) => d.volumenVigas), 0.0001));
  const scrollable = data.length > SCROLLS;
  const rowWidth = scrollable ? data.length * COL_WIDTH : undefined;
  const selectedMes = selected !== null ? data[selected] : null;

  const zonasPresentes = ZONAS.filter((z) => data.some((d) => (d.porZona[z.id] ?? 0) > 0));

  return (
    <div className="bg-surface rounded-2xl p-4">
      <div className="flex items-baseline justify-between mb-1">
        <p className="text-[15px] font-bold text-ink">Vigas aéreas — m³ por mes</p>
        <span className="text-[12.5px] font-semibold text-ink-3">m³</span>
      </div>

      {zonasPresentes.length > 0 && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 mb-1">
          {zonasPresentes.map((z) => (
            <span key={z.id} className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-ink-2">
              <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${ZONA_CHART_STYLES[z.id].dot}`} />
              {z.nombreCorto}
            </span>
          ))}
        </div>
      )}

      <div className="overflow-x-auto -mx-1 px-1 mt-2">
        <div className="flex" style={{ minWidth: rowWidth }}>
          <div className="relative flex flex-col justify-between shrink-0 w-9 pr-1.5" style={{ height: CHART_HEIGHT }}>
            <span className="text-[10.5px] font-semibold text-ink-3 text-right leading-none">{formatNumber(max)}</span>
            <span className="text-[10.5px] font-semibold text-ink-3 text-right leading-none">{formatNumber(max / 2)}</span>
            <span className="text-[10.5px] font-semibold text-ink-3 text-right leading-none">0</span>
          </div>

          <div
            className={`relative flex items-end flex-1 ${scrollable ? '' : 'justify-around'}`}
            style={{ height: CHART_HEIGHT, minWidth: scrollable ? rowWidth : undefined }}
          >
            <div className="absolute inset-x-0 top-0 border-t border-veil/[0.08]" />
            <div className="absolute inset-x-0 border-t border-veil/[0.08]" style={{ top: '50%' }} />
            <div className="absolute inset-x-0 bottom-0 border-t border-veil/[0.18]" />

            {data.map((d, i) => {
              const isSelected = selected === i;
              const totalHeightPx = Math.max(2, (d.volumenVigas / max) * CHART_HEIGHT);
              const segments = (Object.entries(d.porZona) as [Zona, number][]).filter(([, v]) => v > 0);
              return (
                <button
                  key={d.mes}
                  onClick={() => setSelected(isSelected ? null : i)}
                  aria-label={`${formatMonth(d.mes, true)}: ${formatNumber(d.volumenVigas)} m³ de vigas aéreas`}
                  className="relative flex flex-col items-center justify-end shrink-0 h-full outline-none group"
                  style={{ width: COL_WIDTH }}
                >
                  <span
                    className={`text-[12px] font-extrabold tabular-nums mb-1 transition-opacity ${
                      isSelected ? 'text-ink opacity-100' : 'text-ink-2 opacity-80 group-active:opacity-100'
                    }`}
                  >
                    {formatNumber(d.volumenVigas)}
                  </span>
                  <div
                    className={`w-8 rounded-t-[4px] overflow-hidden flex flex-col-reverse transition-transform duration-300 ease-out ${
                      isSelected ? 'scale-x-110' : ''
                    }`}
                    style={{ height: totalHeightPx }}
                  >
                    {segments.map(([zonaId, vol], si) => (
                      <span
                        key={zonaId}
                        className={`w-full ${ZONA_CHART_STYLES[zonaId].fill} ${
                          isSelected ? 'opacity-100' : 'opacity-55'
                        } ${si > 0 ? 'border-t-2 border-surface' : ''}`}
                        style={{ height: `${(vol / d.volumenVigas) * 100}%` }}
                      />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto -mx-1 px-1">
        <div className="flex" style={{ minWidth: rowWidth }}>
          <div className="shrink-0 w-9" />
          <div className={`flex flex-1 ${scrollable ? '' : 'justify-around'}`} style={{ minWidth: scrollable ? rowWidth : undefined }}>
            {data.map((d) => (
              <div key={d.mes} className="shrink-0 text-center" style={{ width: COL_WIDTH }}>
                <span className="text-[11.5px] font-semibold text-ink-3">{formatMonth(d.mes)}</span>
              </div>
            ))}
          </div>
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
              className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-veil/[0.06]"
            >
              <span className={`w-2 h-2 rounded-full shrink-0 ${ZONA_CHART_STYLES[zonaId].dot}`} />
              <span className={ZONA_CHART_STYLES[zonaId].text}>{getZonaInfo(zonaId).nombreCorto}</span>
              <span className="text-ink">{formatNumber(vol)}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
