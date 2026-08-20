import { Box, Layers, RectangleHorizontal, Milestone, BrickWall } from 'lucide-react';
import type { Categoria } from '../types';

export interface CategoryStyle {
  bg50: string;
  bg100: string;
  text600: string;
  text700: string;
  bar: string;
  ring: string;
  chip: string;
  icon: typeof Box;
}

// Tailwind escanea el texto fuente de forma estática, así que cada clase va
// escrita literal (no se puede armar con template strings en tiempo de
// ejecución) — de ahí la repetición en vez de una función generadora.
export const CATEGORY_STYLES: Record<Categoria, CategoryStyle> = {
  viga_aerea: {
    bg50: 'bg-viga/10',
    bg100: 'bg-viga/15',
    text600: 'text-viga',
    text700: 'text-viga',
    bar: 'bg-viga',
    ring: 'text-viga',
    chip: 'bg-viga/15 text-viga',
    icon: RectangleHorizontal,
  },
  losa: {
    bg50: 'bg-losa/10',
    bg100: 'bg-losa/15',
    text600: 'text-losa',
    text700: 'text-losa',
    bar: 'bg-losa',
    ring: 'text-losa',
    chip: 'bg-losa/15 text-losa',
    icon: Layers,
  },
  columna: {
    bg50: 'bg-columna/10',
    bg100: 'bg-columna/15',
    text600: 'text-columna',
    text700: 'text-columna',
    bar: 'bg-columna',
    ring: 'text-columna',
    chip: 'bg-columna/15 text-columna',
    icon: Box,
  },
  columna_mensula: {
    bg50: 'bg-mensula/10',
    bg100: 'bg-mensula/15',
    text600: 'text-mensula',
    text700: 'text-mensula',
    bar: 'bg-mensula',
    ring: 'text-mensula',
    chip: 'bg-mensula/15 text-mensula',
    icon: Milestone,
  },
  antepecho: {
    bg50: 'bg-antepecho/10',
    bg100: 'bg-antepecho/15',
    text600: 'text-antepecho',
    text700: 'text-antepecho',
    bar: 'bg-antepecho',
    ring: 'text-antepecho',
    chip: 'bg-antepecho/15 text-antepecho',
    icon: BrickWall,
  },
};
