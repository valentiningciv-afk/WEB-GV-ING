import type { AvanceEntry, Categoria, ElementoEstructural, UnidadMedida } from '../types';

export interface ElementoRow {
  id: string;
  nombre: string;
  nombre_pliego: string;
  categoria: Categoria;
  cantidad: number;
  unidad_medida: UnidadMedida;
  foto: string | null;
  volumen: number;
  altura: number;
  material_encofrado: string;
  creado_en: string;
}

export interface AvanceRow {
  id: string;
  elemento_id: string;
  cantidad: number;
  fecha: string;
  observaciones: string;
  creado_en: string;
}

export function elementoFromRow(row: ElementoRow): ElementoEstructural {
  return {
    id: row.id,
    nombre: row.nombre,
    nombrePliego: row.nombre_pliego,
    categoria: row.categoria,
    cantidad: Number(row.cantidad),
    unidadMedida: row.unidad_medida,
    foto: row.foto,
    volumen: Number(row.volumen),
    altura: Number(row.altura),
    materialEncofrado: row.material_encofrado,
    creadoEn: row.creado_en,
  };
}

export function elementoToRow(e: ElementoEstructural): ElementoRow {
  return {
    id: e.id,
    nombre: e.nombre,
    nombre_pliego: e.nombrePliego,
    categoria: e.categoria,
    cantidad: e.cantidad,
    unidad_medida: e.unidadMedida,
    foto: e.foto,
    volumen: e.volumen,
    altura: e.altura,
    material_encofrado: e.materialEncofrado,
    creado_en: e.creadoEn,
  };
}

export function avanceFromRow(row: AvanceRow): AvanceEntry {
  return {
    id: row.id,
    elementoId: row.elemento_id,
    cantidad: Number(row.cantidad),
    fecha: row.fecha,
    observaciones: row.observaciones,
    creadoEn: row.creado_en,
  };
}

export function avanceToRow(a: AvanceEntry): AvanceRow {
  return {
    id: a.id,
    elemento_id: a.elementoId,
    cantidad: a.cantidad,
    fecha: a.fecha,
    observaciones: a.observaciones,
    creado_en: a.creadoEn,
  };
}
