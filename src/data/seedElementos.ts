import type { ElementoEstructural } from '../types';

/**
 * Cómputo total de elementos del proyecto EPET 24, según planilla de obra.
 * "nombrePliego" es la denominación que usa el pliego de licitación, que
 * agrupa varios nombres internos bajo una misma designación (ej: "Viga carga").
 */
const SEED_DATA: Array<
  Pick<ElementoEstructural, 'nombre' | 'nombrePliego' | 'categoria' | 'cantidad' | 'unidadMedida'>
> = [
  { nombre: 'AH', nombrePliego: 'AH', categoria: 'antepecho', cantidad: 124, unidadMedida: 'u' },
  { nombre: 'VIT', nombrePliego: 'VI 1', categoria: 'viga_aerea', cantidad: 100, unidadMedida: 'u' },
  { nombre: 'VE', nombrePliego: 'Viga carga', categoria: 'viga_aerea', cantidad: 176, unidadMedida: 'u' },
  { nombre: 'VEL 1', nombrePliego: 'VEL 1', categoria: 'viga_aerea', cantidad: 130, unidadMedida: 'u' },
  { nombre: 'VEL 2', nombrePliego: 'VEL 2', categoria: 'viga_aerea', cantidad: 118, unidadMedida: 'u' },
  { nombre: 'VI 2', nombrePliego: 'Viga carga', categoria: 'viga_aerea', cantidad: 208, unidadMedida: 'u' },
  { nombre: 'VI 3', nombrePliego: 'Viga carga', categoria: 'viga_aerea', cantidad: 88, unidadMedida: 'u' },
  { nombre: 'VI 4', nombrePliego: 'Viga carga', categoria: 'viga_aerea', cantidad: 22, unidadMedida: 'u' },
  { nombre: 'VI 5', nombrePliego: 'Viga carga', categoria: 'viga_aerea', cantidad: 8, unidadMedida: 'u' },
  { nombre: 'VI 6', nombrePliego: 'Viga carga', categoria: 'viga_aerea', cantidad: 8, unidadMedida: 'u' },
  { nombre: 'VI 7', nombrePliego: 'Viga carga', categoria: 'viga_aerea', cantidad: 19, unidadMedida: 'u' },
  { nombre: 'Losas 15', nombrePliego: 'L1', categoria: 'losa', cantidad: 1559, unidadMedida: 'm2' },
  { nombre: 'Losas 20', nombrePliego: 'L2', categoria: 'losa', cantidad: 90, unidadMedida: 'm2' },
  { nombre: 'Ref. losa', nombrePliego: 'Ref Losa', categoria: 'losa', cantidad: 39, unidadMedida: 'u' },
];

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
