import type { Zona } from '../types';

export interface ZonaStyle {
  ring: string;
  text: string;
  bg: string;
  bar: string;
}

// Tailwind escanea el texto fuente de forma estática, así que cada clase va
// escrita literal (no se puede armar con template strings en tiempo de
// ejecución).
export const ZONA_STYLES: Record<Zona, ZonaStyle> = {
  aulas: {
    ring: 'text-aulas',
    text: 'text-aulas',
    bg: 'bg-aulas/15',
    bar: 'bg-aulas',
  },
  talleres: {
    ring: 'text-talleres',
    text: 'text-talleres',
    bg: 'bg-talleres/15',
    bar: 'bg-talleres',
  },
  zona3: {
    ring: 'text-zona3',
    text: 'text-zona3',
    bg: 'bg-zona3/15',
    bar: 'bg-zona3',
  },
};

export interface ZonaChartStyle {
  fill: string;
  text: string;
  dot: string;
}

/** Variante de los colores de zona ajustada (más oscura/saturada) para
 * usarse como marca de dato en gráficos — ver --color-*-chart en
 * index.css, validados como paleta categórica con el script de dataviz. */
export const ZONA_CHART_STYLES: Record<Zona, ZonaChartStyle> = {
  aulas: {
    fill: 'bg-aulas-chart',
    text: 'text-aulas-chart',
    dot: 'bg-aulas-chart',
  },
  talleres: {
    fill: 'bg-talleres-chart',
    text: 'text-talleres-chart',
    dot: 'bg-talleres-chart',
  },
  zona3: {
    fill: 'bg-zona3-chart',
    text: 'text-zona3-chart',
    dot: 'bg-zona3-chart',
  },
};
