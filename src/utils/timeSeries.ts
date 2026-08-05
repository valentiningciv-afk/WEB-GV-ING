import type { AvanceEntry, ElementoEstructural, Zona } from '../types';

export interface DiaVolumen {
  fecha: string;
  volumen: number;
  registros: number;
  porZona: Partial<Record<Zona, number>>;
}

/** Agrupa los avances por fecha y calcula el volumen (m³) vertido cada día:
 * cantidad hormigonada × volumen unitario del elemento (m³/u para vigas,
 * espesor en m para losas, ya que ambos representan "m³ por unidad de
 * unidadMedida"). */
export function volumenPorFecha(
  avances: AvanceEntry[],
  elementos: ElementoEstructural[],
): DiaVolumen[] {
  const elementoById = new Map(elementos.map((e) => [e.id, e]));
  const porFecha = new Map<string, DiaVolumen>();

  for (const a of avances) {
    const elemento = elementoById.get(a.elementoId);
    if (!elemento) continue;
    const volumen = a.cantidad * elemento.volumen;
    const dia = porFecha.get(a.fecha) ?? { fecha: a.fecha, volumen: 0, registros: 0, porZona: {} };
    dia.volumen += volumen;
    dia.registros += 1;
    dia.porZona[elemento.zona] = (dia.porZona[elemento.zona] ?? 0) + volumen;
    porFecha.set(a.fecha, dia);
  }

  return [...porFecha.values()].sort((a, b) => a.fecha.localeCompare(b.fecha));
}

export interface PuntoAcumulado extends DiaVolumen {
  acumulado: number;
}

/** Convierte la serie diaria en un acumulado corrido (total a la fecha). */
export function acumuladoPorFecha(dias: DiaVolumen[]): PuntoAcumulado[] {
  let corrido = 0;
  return dias.map((d) => {
    corrido += d.volumen;
    return { ...d, acumulado: corrido };
  });
}
