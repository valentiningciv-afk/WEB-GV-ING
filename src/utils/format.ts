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
