import type { AvanceEntry, Categoria, ElementoEstructural, UnidadMedida, Zona } from '../types';

/**
 * Cómputo real del proyecto EPET 24, desglosado por zona (frente de avance)
 * y nivel — según planilla "Vigas por ala y sector". El campo "altura" se
 * reutiliza como nivel (2.20 = nivel +2,20).
 *
 * "ejecutado" es la cantidad ya hormigonada informada a la fecha de esta
 * carga; se registra como un único avance de arranque por elemento.
 */

/**
 * Se incrementa cada vez que cambian los datos de este archivo. La vista
 * previa local (sin backend) usa este número para saber que tiene que
 * descartar lo guardado en el navegador y recargar el cómputo fresco —
 * si no, quien ya la haya abierto antes nunca vería una corrección nueva.
 */
export const SEED_VERSION = 7;

interface SeedRow {
  zona: Zona;
  nivel: number;
  nombre: string;
  categoria: Categoria;
  cantidad: number;
  unidadMedida: UnidadMedida;
  ejecutado?: number;
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
};

/**
 * Avances puntuales informados con fecha propia (día a día), separados del
 * "ejecutado" base de SEED_DATA porque ese representa el arranque del
 * proyecto sin fecha conocida. Cada entrada se matchea contra SEED_DATA por
 * zona + nivel + nombre.
 */
interface AvanceDiario {
  zona: Zona;
  nivel: number;
  nombre: string;
  cantidad: number;
  fecha: string;
  observaciones?: string;
}

const AVANCES_DIARIOS: AvanceDiario[] = [
  { zona: 'talleres', nivel: 2.2, nombre: 'VEL 1', cantidad: 10, fecha: '2026-08-04' },
  { zona: 'talleres', nivel: 2.2, nombre: 'VIT', cantidad: 10, fecha: '2026-08-04' },
];

const SEED_DATA: SeedRow[] = [
  // Ala de Aulas
  { zona: 'aulas', nivel: 2.2, nombre: 'VEL 1', categoria: 'viga_aerea', cantidad: 40, unidadMedida: 'u', ejecutado: 40 },
  { zona: 'aulas', nivel: 2.2, nombre: 'VIT', categoria: 'viga_aerea', cantidad: 38, unidadMedida: 'u', ejecutado: 38 },
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
  { zona: 'zona3', nivel: 2.2, nombre: 'VEL 1', categoria: 'viga_aerea', cantidad: 36, unidadMedida: 'u', ejecutado: 16 },
  { zona: 'zona3', nivel: 2.2, nombre: 'VIT', categoria: 'viga_aerea', cantidad: 19, unidadMedida: 'u', ejecutado: 15 },
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
  const fecha = new Date().toISOString().slice(0, 10);
  const creadoEn = new Date().toISOString();
  const avances: AvanceEntry[] = [];

  SEED_DATA.forEach((item, i) => {
    if (!item.ejecutado) return;
    const elemento = elementosSembrados[i];
    avances.push({
      id: `seed-avance-${elemento.id}`,
      elementoId: elemento.id,
      cantidad: item.ejecutado,
      fecha,
      observaciones: 'Carga inicial del cómputo (fecha real no informada)',
      creadoEn,
      fechaAproximada: true,
    });
  });

  AVANCES_DIARIOS.forEach((diario, i) => {
    const elemento = elementosSembrados.find(
      (e) => e.zona === diario.zona && e.altura === diario.nivel && e.nombre === diario.nombre,
    );
    if (!elemento) return;
    avances.push({
      id: `seed-avance-diario-${i}-${elemento.id}`,
      elementoId: elemento.id,
      cantidad: diario.cantidad,
      fecha: diario.fecha,
      observaciones: diario.observaciones ?? '',
      creadoEn,
    });
  });

  return avances;
}
