export type Categoria =
  | 'viga_aerea'
  | 'losa'
  | 'columna'
  | 'columna_mensula'
  | 'antepecho';

export type UnidadMedida = 'u' | 'm2';

export const UNIDAD_LABELS: Record<UnidadMedida, { corta: string; larga: string }> = {
  u: { corta: 'u.', larga: 'unidades' },
  m2: { corta: 'm²', larga: 'm²' },
};

export interface CategoriaInfo {
  id: Categoria;
  nombre: string;
  nombreSingular: string;
  color: 'viga' | 'losa' | 'columna' | 'mensula' | 'antepecho';
  descripcion: string;
}

export const CATEGORIAS: CategoriaInfo[] = [
  {
    id: 'viga_aerea',
    nombre: 'Vigas Aéreas',
    nombreSingular: 'Viga aérea',
    color: 'viga',
    descripcion: 'Vigas suspendidas entre apoyos',
  },
  {
    id: 'losa',
    nombre: 'Losas',
    nombreSingular: 'Losa',
    color: 'losa',
    descripcion: 'Paños de losa por nivel',
  },
  {
    id: 'columna',
    nombre: 'Columnas',
    nombreSingular: 'Columna',
    color: 'columna',
    descripcion: 'Columnas de hormigón armado',
  },
  {
    id: 'columna_mensula',
    nombre: 'Columnas con Ménsulas',
    nombreSingular: 'Columna con ménsula',
    color: 'mensula',
    descripcion: 'Columnas con apoyo tipo ménsula',
  },
  {
    id: 'antepecho',
    nombre: 'Antepechos',
    nombreSingular: 'Antepecho',
    color: 'antepecho',
    descripcion: 'Antepechos perimetrales',
  },
];

export function getCategoriaInfo(id: Categoria): CategoriaInfo {
  return CATEGORIAS.find((c) => c.id === id) ?? CATEGORIAS[0];
}

/** Frentes de avance de la obra — cómo se organiza el trabajo en el día a día. */
export type Zona = 'aulas' | 'talleres' | 'zona3';

export interface ZonaInfo {
  id: Zona;
  nombre: string;
  nombreCorto: string;
}

export const ZONAS: ZonaInfo[] = [
  { id: 'aulas', nombre: 'Ala de Aulas', nombreCorto: 'Aulas' },
  { id: 'talleres', nombre: 'Ala de Talleres', nombreCorto: 'Talleres' },
  { id: 'zona3', nombre: 'Zona 3', nombreCorto: 'Zona 3' },
];

export function getZonaInfo(id: Zona): ZonaInfo {
  return ZONAS.find((z) => z.id === id) ?? ZONAS[0];
}

export interface ElementoEstructural {
  id: string;
  nombre: string;
  categoria: Categoria;
  zona: Zona;
  cantidad: number;
  unidadMedida: UnidadMedida;
  foto: string | null;
  volumen: number;
  altura: number;
  materialEncofrado: string;
  creadoEn: string;
}

export interface AvanceEntry {
  id: string;
  elementoId: string;
  cantidad: number;
  fecha: string;
  observaciones: string;
  creadoEn: string;
}

export interface Proyecto {
  elementos: ElementoEstructural[];
  avances: AvanceEntry[];
}
