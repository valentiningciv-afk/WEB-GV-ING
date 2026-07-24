import { todayISO } from '../utils/format';
import type { AvanceEntry, ElementoEstructural } from '../types';

/**
 * Avance acumulado informado al empezar a usar la app (24/07/2026). No se
 * conoce la fecha real de cada hormigonado, así que se carga como un único
 * avance "de arranque" fechado el día en que el equipo empezó a registrar
 * en la app, para no perder el acumulado ya ejecutado en obra.
 */
const BASELINE = [
  { nombre: 'VEL 1', cantidad: 35 },
  { nombre: 'VIT', cantidad: 32 },
];

export function createSeedAvances(elementos: ElementoEstructural[]): AvanceEntry[] {
  const fecha = todayISO();
  const creadoEn = new Date().toISOString();
  const avances: AvanceEntry[] = [];

  for (const item of BASELINE) {
    const elemento = elementos.find(
      (e) => e.nombre.trim().toLowerCase() === item.nombre.toLowerCase(),
    );
    if (!elemento) continue;
    avances.push({
      id: `seed-avance-${elemento.id}`,
      elementoId: elemento.id,
      cantidad: item.cantidad,
      fecha,
      observaciones: 'Avance acumulado informado al empezar a usar la app',
      creadoEn,
    });
  }

  return avances;
}
