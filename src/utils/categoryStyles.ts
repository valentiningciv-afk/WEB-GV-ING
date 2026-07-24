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

export const CATEGORY_STYLES: Record<Categoria, CategoryStyle> = {
  viga_aerea: {
    bg50: 'bg-viga-50',
    bg100: 'bg-viga-100',
    text600: 'text-viga-600',
    text700: 'text-viga-700',
    bar: 'bg-viga-500',
    ring: 'text-viga-500',
    chip: 'bg-viga-100 text-viga-700',
    icon: RectangleHorizontal,
  },
  losa: {
    bg50: 'bg-losa-50',
    bg100: 'bg-losa-100',
    text600: 'text-losa-600',
    text700: 'text-losa-700',
    bar: 'bg-losa-500',
    ring: 'text-losa-500',
    chip: 'bg-losa-100 text-losa-700',
    icon: Layers,
  },
  columna: {
    bg50: 'bg-columna-50',
    bg100: 'bg-columna-100',
    text600: 'text-columna-600',
    text700: 'text-columna-700',
    bar: 'bg-columna-500',
    ring: 'text-columna-500',
    chip: 'bg-columna-100 text-columna-700',
    icon: Box,
  },
  columna_mensula: {
    bg50: 'bg-mensula-50',
    bg100: 'bg-mensula-100',
    text600: 'text-mensula-600',
    text700: 'text-mensula-700',
    bar: 'bg-mensula-500',
    ring: 'text-mensula-500',
    chip: 'bg-mensula-100 text-mensula-700',
    icon: Milestone,
  },
  antepecho: {
    bg50: 'bg-antepecho-50',
    bg100: 'bg-antepecho-100',
    text600: 'text-antepecho-600',
    text700: 'text-antepecho-700',
    bar: 'bg-antepecho-500',
    ring: 'text-antepecho-500',
    chip: 'bg-antepecho-100 text-antepecho-700',
    icon: BrickWall,
  },
};
