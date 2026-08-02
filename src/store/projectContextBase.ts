import { createContext, useContext } from 'react';
import type { AvanceEntry, ElementoEstructural } from '../types';

export interface ProjectContextValue {
  elementos: ElementoEstructural[];
  avances: AvanceEntry[];
  loading: boolean;
  syncError: string | null;
  addElemento: (e: Omit<ElementoEstructural, 'id' | 'creadoEn'>) => string;
  updateElemento: (
    id: string,
    e: Omit<ElementoEstructural, 'id' | 'creadoEn'>,
  ) => void;
  deleteElemento: (id: string) => void;
  addAvance: (a: Omit<AvanceEntry, 'id' | 'creadoEn'>) => void;
  updateAvance: (id: string, a: Omit<AvanceEntry, 'id' | 'creadoEn'>) => void;
  deleteAvance: (id: string) => void;
  ejecutadoDe: (elementoId: string) => number;
}

export const ProjectContext = createContext<ProjectContextValue | null>(null);

export function useProject(): ProjectContextValue {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error('useProject debe usarse dentro de ProjectProvider');
  return ctx;
}

export function uid(): string {
  return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
}
