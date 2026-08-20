import type { AvanceEntry, Categoria, ElementoEstructural, UnidadMedida, Zona } from '../types';

/**
 * Cómputo real del proyecto EPET 24, desglosado por zona (frente de avance)
 * y nivel — según planilla "Vigas por ala y sector". El campo "altura" se
 * reutiliza como nivel (2.20 = nivel +2,20).
 */

/**
 * Se incrementa cada vez que cambian los datos de este archivo. La vista
 * previa local (sin backend) usa este número para saber que tiene que
 * descartar lo guardado en el navegador y recargar el cómputo fresco —
 * si no, quien ya la haya abierto antes nunca vería una corrección nueva.
 */
export const SEED_VERSION = 13;

interface SeedRow {
  zona: Zona;
  nivel: number;
  nombre: string;
  categoria: Categoria;
  cantidad: number;
  unidadMedida: UnidadMedida;
}

/**
 * Volumen unitario (m³) por tipo de elemento — para vigas es m³ por unidad,
 * para losas es el espesor en metros (que multiplicado por los m² vertidos
 * da m³, ya que "volumen" se interpreta siempre como "m³ por unidad de
 * unidadMedida"). Mismo valor para todas las zonas/niveles de un tipo.
 */
const VOLUMEN_POR_NOMBRE: Record<string, number> = {
  VIT: 0.47,
  VE: 0.22,
  'VEL 1': 0.42,
  'VEL 2': 0.5,
  'VI 2': 0.47,
  'VI 3': 0.29,
  'VI 4': 0.25,
  'VI 5': 0.29,
  'VI 6': 0.54,
  'VI 7': 0.32,
  'Losa 1': 0.15,
  'Losa 2': 0.2,
  Antepecho: 0.3,
};

/**
 * Avances cargados hasta ahora. Cada entrada se matchea contra SEED_DATA por
 * zona + nivel + nombre. "precision" indica si "fecha" es un día exacto
 * informado o solo se conoce el mes (en ese caso "fecha" usa el día 1 del
 * mes como convención, y se agrupa/gráfica por mes).
 */
interface AvanceCargado {
  zona: Zona;
  nivel: number;
  nombre: string;
  cantidad: number;
  fecha: string;
  precision: 'dia' | 'mes';
  observaciones?: string;
}

const AVANCES_CARGADOS: AvanceCargado[] = [
  // Junio: vigas de Zona 3
  { zona: 'zona3', nivel: 2.2, nombre: 'VEL 1', cantidad: 16, fecha: '2026-06-01', precision: 'mes' },
  { zona: 'zona3', nivel: 2.2, nombre: 'VIT', cantidad: 15, fecha: '2026-06-01', precision: 'mes' },
  // Julio: vigas de Ala de Aulas
  { zona: 'aulas', nivel: 2.2, nombre: 'VEL 1', cantidad: 40, fecha: '2026-07-01', precision: 'mes' },
  { zona: 'aulas', nivel: 2.2, nombre: 'VIT', cantidad: 38, fecha: '2026-07-01', precision: 'mes' },
  // Agosto: vigas de Ala de Talleres
  { zona: 'talleres', nivel: 2.2, nombre: 'VEL 1', cantidad: 10, fecha: '2026-08-04', precision: 'dia' },
  { zona: 'talleres', nivel: 2.2, nombre: 'VIT', cantidad: 10, fecha: '2026-08-04', precision: 'dia' },
  { zona: 'talleres', nivel: 2.2, nombre: 'VEL 1', cantidad: 10, fecha: '2026-08-12', precision: 'dia' },
  { zona: 'talleres', nivel: 2.2, nombre: 'VIT', cantidad: 10, fecha: '2026-08-12', precision: 'dia' },
  { zona: 'talleres', nivel: 2.2, nombre: 'VEL 1', cantidad: 10, fecha: '2026-08-14', precision: 'dia' },
  { zona: 'talleres', nivel: 2.2, nombre: 'VIT', cantidad: 10, fecha: '2026-08-14', precision: 'dia' },
  {
    zona: 'aulas',
    nivel: 4.25,
    nombre: 'VEL 2',
    cantidad: 10,
    fecha: '2026-08-19',
    precision: 'dia',
    observaciones: 'Hormigón H21',
  },
  {
    zona: 'zona3',
    nivel: 0,
    nombre: 'Antepecho',
    cantidad: 8,
    fecha: '2026-08-20',
    precision: 'dia',
    observaciones: 'Hormigón H25',
  },
];

const SEED_DATA: SeedRow[] = [
  // Ala de Aulas
  { zona: 'aulas', nivel: 2.2, nombre: 'VEL 1', categoria: 'viga_aerea', cantidad: 40, unidadMedida: 'u' },
  { zona: 'aulas', nivel: 2.2, nombre: 'VIT', categoria: 'viga_aerea', cantidad: 38, unidadMedida: 'u' },
  { zona: 'aulas', nivel: 2.2, nombre: 'VE', categoria: 'viga_aerea', cantidad: 31, unidadMedida: 'u' },
  { zona: 'aulas', nivel: 4.25, nombre: 'VEL 2', categoria: 'viga_aerea', cantidad: 38, unidadMedida: 'u' },
  { zona: 'aulas', nivel: 4.25, nombre: 'VI 3', categoria: 'viga_aerea', cantidad: 38, unidadMedida: 'u' },
  { zona: 'aulas', nivel: 4.25, nombre: 'VI 2', categoria: 'viga_aerea', cantidad: 27, unidadMedida: 'u' },
  { zona: 'aulas', nivel: 4.25, nombre: 'Losa 1', categoria: 'losa', cantidad: 293, unidadMedida: 'm2' },

  // Ala de Talleres
  { zona: 'talleres', nivel: 2.2, nombre: 'VEL 1', categoria: 'viga_aerea', cantidad: 40, unidadMedida: 'u' },
  { zona: 'talleres', nivel: 2.2, nombre: 'VIT', categoria: 'viga_aerea', cantidad: 38, unidadMedida: 'u' },
  { zona: 'talleres', nivel: 2.2, nombre: 'VE', categoria: 'viga_aerea', cantidad: 21, unidadMedida: 'u' },
  { zona: 'talleres', nivel: 4.25, nombre: 'VI 2', categoria: 'viga_aerea', cantidad: 27, unidadMedida: 'u' },
  { zona: 'talleres', nivel: 4.25, nombre: 'VE', categoria: 'viga_aerea', cantidad: 28, unidadMedida: 'u' },
  { zona: 'talleres', nivel: 6.35, nombre: 'VEL 2', categoria: 'viga_aerea', cantidad: 38, unidadMedida: 'u' },
  { zona: 'talleres', nivel: 6.35, nombre: 'VI 3', categoria: 'viga_aerea', cantidad: 38, unidadMedida: 'u' },
  { zona: 'talleres', nivel: 6.35, nombre: 'VI 2', categoria: 'viga_aerea', cantidad: 20, unidadMedida: 'u' },
  { zona: 'talleres', nivel: 6.35, nombre: 'Losa 1', categoria: 'losa', cantidad: 293, unidadMedida: 'm2' },

  // Zona 3
  { zona: 'zona3', nivel: 2.2, nombre: 'VEL 1', categoria: 'viga_aerea', cantidad: 36, unidadMedida: 'u' },
  { zona: 'zona3', nivel: 2.2, nombre: 'VIT', categoria: 'viga_aerea', cantidad: 19, unidadMedida: 'u' },
  { zona: 'zona3', nivel: 2.2, nombre: 'VE', categoria: 'viga_aerea', cantidad: 87, unidadMedida: 'u' },
  { zona: 'zona3', nivel: 4.25, nombre: 'VEL 2', categoria: 'viga_aerea', cantidad: 12, unidadMedida: 'u' },
  { zona: 'zona3', nivel: 4.25, nombre: 'VI 2', categoria: 'viga_aerea', cantidad: 104, unidadMedida: 'u' },
  { zona: 'zona3', nivel: 4.25, nombre: 'VI 3', categoria: 'viga_aerea', cantidad: 12, unidadMedida: 'u' },
  { zona: 'zona3', nivel: 4.25, nombre: 'VI 4', categoria: 'viga_aerea', cantidad: 12, unidadMedida: 'u' },
  { zona: 'zona3', nivel: 4.25, nombre: 'VI 5', categoria: 'viga_aerea', cantidad: 8, unidadMedida: 'u' },
  { zona: 'zona3', nivel: 4.25, nombre: 'VI 6', categoria: 'viga_aerea', cantidad: 8, unidadMedida: 'u' },
  { zona: 'zona3', nivel: 4.25, nombre: 'VI 7', categoria: 'viga_aerea', cantidad: 3, unidadMedida: 'u' },
  { zona: 'zona3', nivel: 4.25, nombre: 'Losa 1', categoria: 'losa', cantidad: 908, unidadMedida: 'm2' },
  { zona: 'zona3', nivel: 4.25, nombre: 'Losa 2', categoria: 'losa', cantidad: 45, unidadMedida: 'm2' },
  { zona: 'zona3', nivel: 6.35, nombre: 'VEL 2', categoria: 'viga_aerea', cantidad: 10, unidadMedida: 'u' },
  { zona: 'zona3', nivel: 6.35, nombre: 'VI 2', categoria: 'viga_aerea', cantidad: 20, unidadMedida: 'u' },
  { zona: 'zona3', nivel: 7.5, nombre: 'VEL 2', categoria: 'viga_aerea', cantidad: 20, unidadMedida: 'u' },
  { zona: 'zona3', nivel: 7.5, nombre: 'VI 2', categoria: 'viga_aerea', cantidad: 12, unidadMedida: 'u' },
  { zona: 'zona3', nivel: 7.5, nombre: 'VI 4', categoria: 'viga_aerea', cantidad: 10, unidadMedida: 'u' },

  // Antepechos — no se clasifican por nivel (nivel: 0 = "Sin nivel")
  { zona: 'aulas', nivel: 0, nombre: 'Antepecho', categoria: 'antepecho', cantidad: 39, unidadMedida: 'u' },
  { zona: 'talleres', nivel: 0, nombre: 'Antepecho', categoria: 'antepecho', cantidad: 39, unidadMedida: 'u' },
  { zona: 'zona3', nivel: 0, nombre: 'Antepecho', categoria: 'antepecho', cantidad: 46, unidadMedida: 'u' },
];

export function createSeedElementos(): ElementoEstructural[] {
  const creadoEn = new Date().toISOString();
  return SEED_DATA.map((item, i) => ({
    id: `seed-${i}-${item.zona}-${item.nombre.toLowerCase().replace(/\s+/g, '-')}-${item.nivel}`,
    nombre: item.nombre,
    categoria: item.categoria,
    zona: item.zona,
    cantidad: item.cantidad,
    unidadMedida: item.unidadMedida,
    foto: null,
    volumen: VOLUMEN_POR_NOMBRE[item.nombre] ?? 0,
    altura: item.nivel,
    materialEncofrado: '',
    creadoEn,
  }));
}

export function createSeedAvances(elementosSembrados: ElementoEstructural[]): AvanceEntry[] {
  const creadoEn = new Date().toISOString();

  const avances: AvanceEntry[] = [];
  AVANCES_CARGADOS.forEach((carga, i) => {
    const elemento = elementosSembrados.find(
      (e) => e.zona === carga.zona && e.altura === carga.nivel && e.nombre === carga.nombre,
    );
    if (!elemento) return;
    avances.push({
      id: `seed-avance-${i}-${elemento.id}`,
      elementoId: elemento.id,
      cantidad: carga.cantidad,
      fecha: carga.fecha,
      precision: carga.precision,
      observaciones: carga.observaciones ?? '',
      creadoEn,
    });
  });
  return avances;
}
