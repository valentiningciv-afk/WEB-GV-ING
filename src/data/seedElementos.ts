import type { ElementoEstructural } from '../types';

/**
 * Catálogo base del proyecto EPET 24, precargado la primera vez que se abre
 * la app en un dispositivo nuevo (si la base compartida todavía está vacía).
 *
 * Reorganizado por frente de avance (zona): Ala de Aulas, Ala de Talleres,
 * Zona 3. Vacío por ahora — se está reconstruyendo la carga con datos reales
 * desglosados por zona y tipo.
 */
const SEED_DATA: Array<
  Pick<ElementoEstructural, 'nombre' | 'categoria' | 'zona' | 'cantidad' | 'unidadMedida'>
> = [];

export function createSeedElementos(): ElementoEstructural[] {
  const creadoEn = new Date().toISOString();
  return SEED_DATA.map((item, i) => ({
    ...item,
    id: `seed-${i}-${item.nombre.toLowerCase().replace(/\s+/g, '-')}`,
    foto: null,
    volumen: 0,
    altura: 0,
    materialEncofrado: '',
    creadoEn,
  }));
}
