import type { AvanceEntry, ElementoEstructural, Zona } from '../types';

export interface MesVolumen {
  /** 'YYYY-MM' */
  mes: string;
  /** m³ de todas las categorías ese mes */
  volumenTotal: number;
  /** m³ solo de vigas aéreas ese mes */
  volumenVigas: number;
  /** unidades de vigas aéreas hormigonadas ese mes */
  vigas: number;
  registros: number;
  porZona: Partial<Record<Zona, number>>;
}

/** Agrupa los avances por mes y calcula, para cada uno, el volumen (m³)
 * vertido: cantidad hormigonada × volumen unitario del elemento (m³/u para
 * vigas, espesor en m para losas). Descarta las entradas sin fecha real
 * conocida (fechaAproximada). */
export function volumenPorMes(
  avances: AvanceEntry[],
  elementos: ElementoEstructural[],
): MesVolumen[] {
  const elementoById = new Map(elementos.map((e) => [e.id, e]));
  const porMes = new Map<string, MesVolumen>();

  for (const a of avances) {
    if (a.fechaAproximada) continue;
    const elemento = elementoById.get(a.elementoId);
    if (!elemento) continue;
    const mes = a.fecha.slice(0, 7);
    const volumen = a.cantidad * elemento.volumen;
    const bucket = porMes.get(mes) ?? {
      mes,
      volumenTotal: 0,
      volumenVigas: 0,
      vigas: 0,
      registros: 0,
      porZona: {},
    };
    bucket.volumenTotal += volumen;
    bucket.registros += 1;
    if (elemento.categoria === 'viga_aerea') {
      bucket.volumenVigas += volumen;
      bucket.vigas += a.cantidad;
    }
    bucket.porZona[elemento.zona] = (bucket.porZona[elemento.zona] ?? 0) + volumen;
    porMes.set(mes, bucket);
  }

  return [...porMes.values()].sort((a, b) => a.mes.localeCompare(b.mes));
}

export interface PuntoAcumuladoMes extends MesVolumen {
  acumulado: number;
}

/** Convierte la serie mensual en un acumulado corrido (total de vigas
 * aéreas, en m³, a esa altura del proyecto). */
export function acumuladoPorMes(meses: MesVolumen[]): PuntoAcumuladoMes[] {
  let corrido = 0;
  return meses.map((m) => {
    corrido += m.volumenVigas;
    return { ...m, acumulado: corrido };
  });
}

/** Promedio de vigas aéreas (unidades) hormigonadas por mes, contando solo
 * los meses con al menos un registro. */
export function promedioVigasPorMes(meses: MesVolumen[]): number {
  if (meses.length === 0) return 0;
  const total = meses.reduce((sum, m) => sum + m.vigas, 0);
  return total / meses.length;
}
