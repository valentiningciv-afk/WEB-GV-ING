import { UNIDAD_LABELS, type UnidadMedida } from '../types';

export function formatDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function todayISO(): string {
  const d = new Date();
  const tz = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tz).toISOString().slice(0, 10);
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('es-AR', { maximumFractionDigits: 2 }).format(
    n,
  );
}

export function unitLabel(unidad: UnidadMedida): string {
  return UNIDAD_LABELS[unidad].corta;
}

export function formatQty(n: number, unidad: UnidadMedida): string {
  return `${formatNumber(n)} ${unitLabel(unidad)}`;
}

/** El campo "altura" se usa como nivel de obra: 2.2 → "+2,20". */
export function formatNivel(altura: number): string {
  if (!altura) return 'Sin nivel';
  return `+${altura.toFixed(2).replace('.', ',')}`;
}
