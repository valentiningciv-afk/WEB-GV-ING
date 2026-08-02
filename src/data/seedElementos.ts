import type { AvanceEntry, Categoria, ElementoEstructural, UnidadMedida, Zona } from '../types';

/**
 * Cómputo real del proyecto EPET 24, desglosado por zona (frente de avance)
 * y nivel — según planilla "Vigas por ala y sector". El campo "altura" se
 * reutiliza como nivel (2.20 = nivel +2,20).
 *
 * "ejecutado" es la cantidad ya hormigonada informada a la fecha de esta
 * carga; se registra como un único avance de arranque por elemento.
 *
 * Nota: en Zona 3 nivel +2,20, "VIT" figura en la planilla con Cant. Total
 * = 4 un, pero el usuario confirmó por chat que el total real es 19 un.
 * Se usa 19 (lo confirmado) hasta que se corrija en la planilla de origen.
 */
interface SeedRow {
  zona: Zona;
  nivel: number;
  nombre: string;
  categoria: Categoria;
  cantidad: number;
  unidadMedida: UnidadMedida;
  ejecutado?: number;
}

const SEED_DATA: SeedRow[] = [
  // Ala de Aulas
  { zona: 'aulas', nivel: 2.2, nombre: 'VEL 1', categoria: 'viga_aerea', cantidad: 40, unidadMedida: 'u', ejecutado: 40 },
  { zona: 'aulas', nivel: 2.2, nombre: 'VIT', categoria: 'viga_aerea', cantidad: 38, unidadMedida: 'u', ejecutado: 38 },
  { zona: 'aulas', nivel: 2.2, nombre: 'VE', categoria: 'viga_aerea', cantidad: 31, unidadMedida: 'u' },
  { zona: 'aulas', nivel: 4.25, nombre: 'VEL 2', categoria: 'viga_aerea', cantidad: 38, unidadMedida: 'u' },
  { zona: 'aulas', nivel: 4.25, nombre: 'VI 3', categoria: 'viga_aerea', cantidad: 38, unidadMedida: 'u' },
  { zona: 'aulas', nivel: 4.25, nombre: 'VI 2', categoria: 'viga_aerea', cantidad: 27, unidadMedida: 'u' },
  { zona: 'aulas', nivel: 4.25, nombre: 'Losa 1', categoria: 'losa', cantidad: 238, unidadMedida: 'm2' },

  // Ala de Talleres
  { zona: 'talleres', nivel: 2.2, nombre: 'VEL 1', categoria: 'viga_aerea', cantidad: 40, unidadMedida: 'u' },
  { zona: 'talleres', nivel: 2.2, nombre: 'VIT', categoria: 'viga_aerea', cantidad: 38, unidadMedida: 'u' },
  { zona: 'talleres', nivel: 2.2, nombre: 'VE', categoria: 'viga_aerea', cantidad: 21, unidadMedida: 'u' },
  { zona: 'talleres', nivel: 4.25, nombre: 'VI 2', categoria: 'viga_aerea', cantidad: 27, unidadMedida: 'u' },
  { zona: 'talleres', nivel: 4.25, nombre: 'VE', categoria: 'viga_aerea', cantidad: 28, unidadMedida: 'u' },
  { zona: 'talleres', nivel: 6.35, nombre: 'VEL 2', categoria: 'viga_aerea', cantidad: 38, unidadMedida: 'u' },
  { zona: 'talleres', nivel: 6.35, nombre: 'VI 3', categoria: 'viga_aerea', cantidad: 38, unidadMedida: 'u' },
  { zona: 'talleres', nivel: 6.35, nombre: 'VI 2', categoria: 'viga_aerea', cantidad: 20, unidadMedida: 'u' },
  { zona: 'talleres', nivel: 6.35, nombre: 'Losa 1', categoria: 'losa', cantidad: 238, unidadMedida: 'm2' },

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
  { zona: 'zona3', nivel: 4.25, nombre: 'Losa 1', categoria: 'losa', cantidad: 410, unidadMedida: 'm2' },
  { zona: 'zona3', nivel: 4.25, nombre: 'Losa 2', categoria: 'losa', cantidad: 90, unidadMedida: 'm2' },
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
    volumen: 0,
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
      observaciones: 'Avance informado al cargar el cómputo por zona',
      creadoEn,
    });
  });

  return avances;
}
