import { useId, useState } from 'react';
import type { PuntoAcumuladoMes } from '../../utils/timeSeries';
import { formatMonth, formatNumber, formatPercent } from '../../utils/format';
import { niceMax } from '../../utils/chartMath';

interface CumulativeAreaChartProps {
  data: PuntoAcumuladoMes[];
  /** m³ totales de vigas aéreas de todo el proyecto — dibuja una línea de
   * referencia para ver el avance acumulado contra el total a hormigonar. */
  meta?: number;
}

const CHART_HEIGHT = 200;
const PAD_TOP = 14;
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

export function CumulativeAreaChart({ data, meta }: CumulativeAreaChartProps) {
  const gradientId = useId();
  const [selected, setSelected] = useState<number | null>(data.length - 1 >= 0 ? data.length - 1 : null);
  const ultimo = data[data.length - 1];
  const max = niceMax(Math.max(...data.map((d) => d.acumulado), meta ?? 0, 0.0001));
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
  const metaY = meta !== undefined ? yPercent(meta, max) * 0.4 : null;

  const selectedPoint = selected !== null ? data[selected] : null;
  const previo = selected !== null && selected > 0 ? data[selected - 1] : null;
  const porcentaje = meta && meta > 0 ? (ultimo.acumulado / meta) * 100 : null;

  return (
    <div className="bg-surface rounded-2xl p-4">
      <div className="flex items-baseline justify-between mb-1">
        <p className="text-[15px] font-bold text-ink">Vigas aéreas — m³ acumulados</p>
        {porcentaje !== null && (
          <span className="text-[12.5px] font-extrabold text-accent tabular-nums">{formatPercent(porcentaje)} de la meta</span>
        )}
      </div>

      <div className="relative mt-3" style={{ height: CHART_HEIGHT }}>
        <div className="absolute left-0 top-0 text-[10.5px] font-semibold text-ink-3 leading-none">{formatNumber(max)}</div>
        <div className="absolute left-0 text-[10.5px] font-semibold text-ink-3 leading-none" style={{ top: '50%' }}>
          {formatNumber(max / 2)}
        </div>
        <div className="absolute left-0 bottom-0 text-[10.5px] font-semibold text-ink-3 leading-none">0</div>

        <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="absolute inset-0 w-full h-full overflow-visible">
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <line x1="0" y1={PAD_TOP * 0.4} x2="100" y2={PAD_TOP * 0.4} className="stroke-veil/[0.08]" strokeWidth="0.3" />
          <line x1="0" y1="20" x2="100" y2="20" className="stroke-veil/[0.08]" strokeWidth="0.3" />
          {metaY !== null && (
            <line x1="0" y1={metaY} x2="100" y2={metaY} className="stroke-ink-3" strokeWidth="0.4" strokeDasharray="1.5,1.5" />
          )}
          <path d={areaPath} fill={`url(#${gradientId})`} stroke="none" />
          <path d={linePath} className="stroke-accent" fill="none" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
          {points.map((p, i) => (
            <circle
              key={p.d.mes}
              cx={p.x}
              cy={p.y * 0.4}
              r={selected === i ? '2.1' : '1.5'}
              className="fill-accent transition-all"
              stroke="var(--color-surface)"
              strokeWidth="0.6"
            />
          ))}
        </svg>

        {metaY !== null && (
          <span
            className="absolute right-0 text-[10.5px] font-bold text-ink-2 bg-surface px-1"
            style={{ top: `calc(${metaY * 2.5}% - 8px)` }}
          >
            Meta {formatNumber(meta as number)}
          </span>
        )}

        {points.map((p, i) => (
          <button
            key={p.d.mes}
            onClick={() => setSelected(selected === i ? null : i)}
            aria-label={`${formatMonth(p.d.mes, true)}: ${formatNumber(p.d.acumulado)} m³ acumulados`}
            className="absolute w-7 h-7 -ml-3.5 -mt-3.5 rounded-full"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          />
        ))}
      </div>

      <div className="flex mt-1">
        {data.map((d, i) => (
          <div key={d.mes} className="flex-1 text-center">
            <span className={`text-[11px] font-semibold ${selected === i ? 'text-ink' : 'text-ink-3'}`}>
              {formatMonth(d.mes)}
            </span>
          </div>
        ))}
      </div>

      {selectedPoint && (
        <div className="mt-3.5 animate-fade-rise">
          <PuntoTooltip punto={selectedPoint} previo={previo} meta={meta} />
        </div>
      )}
    </div>
  );
}

function PuntoTooltip({
  punto,
  previo,
  meta,
}: {
  punto: PuntoAcumuladoMes;
  previo: PuntoAcumuladoMes | null;
  meta?: number;
}) {
  return (
    <div className="bg-surface-3 rounded-2xl shadow-lg ring-1 ring-veil/[0.1] p-3.5 text-left">
      <p className="text-[12.5px] font-bold text-ink-2">{formatMonth(punto.mes, true)}</p>
      <p className="text-[22px] font-extrabold text-ink tabular-nums leading-tight mt-0.5">
        {formatNumber(punto.acumulado)} <span className="text-[13px] font-bold text-ink-2">m³</span>
      </p>
      <div className="flex items-center gap-2.5 mt-0.5 flex-wrap">
        {previo && (
          <p className="text-[12px] text-losa font-bold">+{formatNumber(punto.acumulado - previo.acumulado)} m³ ese mes</p>
        )}
        {meta && meta > 0 && (
          <p className="text-[12px] text-ink-2 font-semibold">{formatPercent((punto.acumulado / meta) * 100)} de la meta</p>
        )}
      </div>
    </div>
  );
}
