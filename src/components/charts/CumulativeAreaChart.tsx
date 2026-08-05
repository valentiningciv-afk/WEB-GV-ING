import { useState } from 'react';
import type { PuntoAcumulado } from '../../utils/timeSeries';
import { formatDateShort, formatNumber } from '../../utils/format';

interface CumulativeAreaChartProps {
  data: PuntoAcumulado[];
}

const CHART_HEIGHT = 176;
const PAD_TOP = 10;
const PAD_BOTTOM = 8;

function xPercent(i: number, n: number): number {
  if (n <= 1) return 50;
  return (i / (n - 1)) * 100;
}

function yPercent(value: number, max: number): number {
  const usable = 100 - PAD_TOP - PAD_BOTTOM;
  const ratio = max > 0 ? value / max : 0;
  return PAD_TOP + (1 - ratio) * usable;
}

export function CumulativeAreaChart({ data }: CumulativeAreaChartProps) {
  const [selected, setSelected] = useState<number | null>(data.length - 1 >= 0 ? data.length - 1 : null);
  const max = Math.max(...data.map((d) => d.acumulado), 0.0001);
  const n = data.length;

  const points = data.map((d, i) => ({
    x: xPercent(i, n),
    y: yPercent(d.acumulado, max),
    d,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y * 0.4}`).join(' ');
  const areaPath = `M ${points[0]?.x ?? 0} 40 ${points
    .map((p) => `L ${p.x} ${p.y * 0.4}`)
    .join(' ')} L ${points[points.length - 1]?.x ?? 0} 40 Z`;

  const selectedPoint = selected !== null ? data[selected] : null;
  const previo = selected !== null && selected > 0 ? data[selected - 1] : null;

  return (
    <div className="bg-surface rounded-2xl p-4">
      <div className="flex items-baseline justify-between mb-1">
        <p className="text-[15px] font-bold text-ink">Volumen acumulado</p>
        <span className="text-[12.5px] font-semibold text-ink-3">m³</span>
      </div>

      <div className="relative mt-2" style={{ height: CHART_HEIGHT }}>
        <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="absolute inset-0 w-full h-full overflow-visible">
          <line x1="0" y1={PAD_TOP * 0.4} x2="100" y2={PAD_TOP * 0.4} className="stroke-veil/[0.08]" strokeWidth="0.3" />
          <path d={areaPath} className="fill-accent/10" stroke="none" />
          <path d={linePath} className="stroke-accent" fill="none" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round" />
          {points.length > 0 && (
            <circle
              cx={points[points.length - 1].x}
              cy={points[points.length - 1].y * 0.4}
              r="1.8"
              className="fill-accent"
              stroke="var(--color-surface)"
              strokeWidth="0.6"
            />
          )}
        </svg>

        {points.map((p, i) => (
          <button
            key={p.d.fecha}
            onClick={() => setSelected(selected === i ? null : i)}
            aria-label={`${formatDateShort(p.d.fecha, true)}: ${formatNumber(p.d.acumulado)} m³ acumulados`}
            className="absolute w-7 h-7 -ml-3.5 -mt-3.5 rounded-full"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          />
        ))}
      </div>

      <div className="flex justify-between mt-1">
        {data.length > 0 && (
          <>
            <span className="text-[11px] font-semibold text-ink-3">{formatDateShort(data[0].fecha)}</span>
            {data.length > 1 && (
              <span className="text-[11px] font-semibold text-ink-3">{formatDateShort(data[data.length - 1].fecha)}</span>
            )}
          </>
        )}
      </div>

      {selectedPoint && (
        <div className="mt-3.5 animate-fade-rise">
          <PuntoTooltip punto={selectedPoint} previo={previo} />
        </div>
      )}
    </div>
  );
}

function PuntoTooltip({ punto, previo }: { punto: PuntoAcumulado; previo: PuntoAcumulado | null }) {
  return (
    <div className="bg-surface-3 rounded-2xl shadow-lg ring-1 ring-veil/[0.1] p-3.5 text-left">
      <p className="text-[12.5px] font-bold text-ink-2">{formatDateShort(punto.fecha, true)}</p>
      <p className="text-[22px] font-extrabold text-ink tabular-nums leading-tight mt-0.5">
        {formatNumber(punto.acumulado)} <span className="text-[13px] font-bold text-ink-2">m³</span>
      </p>
      {previo && (
        <p className="text-[12px] text-losa font-bold mt-0.5">+{formatNumber(punto.acumulado - previo.acumulado)} m³ ese día</p>
      )}
    </div>
  );
}
