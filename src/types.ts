export type Categoria = 'viga_aerea' | 'losa' | 'columna' | 'columna_mensula';

export interface CategoriaInfo {
  id: Categoria;
  nombre: string;
  nombreSingular: string;
  color: 'viga' | 'losa' | 'columna' | 'mensula';
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
];

export function getCategoriaInfo(id: Categoria): CategoriaInfo {
  return CATEGORIAS.find((c) => c.id === id) ?? CATEGORIAS[0];
}

export interface ElementoEstructural {
  id: string;
  nombre: string;
  categoria: Categoria;
  cantidad: number;
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
