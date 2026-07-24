import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { createSeedElementos } from '../data/seedElementos';
import type { AvanceEntry, ElementoEstructural, Proyecto } from '../types';

const STORAGE_KEY = 'epet24-hormigon-v1';

function loadInitial(): Proyecto {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Proyecto;
  } catch {
    // localStorage corrupto o inaccesible: se arranca con el cómputo base
  }
  // Primer uso en este dispositivo: se precarga el cómputo total del proyecto.
  return { elementos: createSeedElementos(), avances: [] };
}

interface ProjectContextValue {
  elementos: ElementoEstructural[];
  avances: AvanceEntry[];
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

const ProjectContext = createContext<ProjectContextValue | null>(null);

function uid(): string {
  return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
}

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Proyecto>(loadInitial);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // cuota de almacenamiento excedida: se ignora, los datos siguen en memoria
    }
  }, [data]);

  const addElemento = useCallback(
    (e: Omit<ElementoEstructural, 'id' | 'creadoEn'>) => {
      const id = uid();
      setData((prev) => ({
        ...prev,
        elementos: [
          ...prev.elementos,
          { ...e, id, creadoEn: new Date().toISOString() },
        ],
      }));
      return id;
    },
    [],
  );

  const updateElemento = useCallback(
    (id: string, e: Omit<ElementoEstructural, 'id' | 'creadoEn'>) => {
      setData((prev) => ({
        ...prev,
        elementos: prev.elementos.map((el) =>
          el.id === id ? { ...el, ...e } : el,
        ),
      }));
    },
    [],
  );

  const deleteElemento = useCallback((id: string) => {
    setData((prev) => ({
      elementos: prev.elementos.filter((el) => el.id !== id),
      avances: prev.avances.filter((a) => a.elementoId !== id),
    }));
  }, []);

  const addAvance = useCallback((a: Omit<AvanceEntry, 'id' | 'creadoEn'>) => {
    setData((prev) => ({
      ...prev,
      avances: [
        ...prev.avances,
        { ...a, id: uid(), creadoEn: new Date().toISOString() },
      ],
    }));
  }, []);

  const updateAvance = useCallback(
    (id: string, a: Omit<AvanceEntry, 'id' | 'creadoEn'>) => {
      setData((prev) => ({
        ...prev,
        avances: prev.avances.map((av) =>
          av.id === id ? { ...av, ...a } : av,
        ),
      }));
    },
    [],
  );

  const deleteAvance = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      avances: prev.avances.filter((a) => a.id !== id),
    }));
  }, []);

  const ejecutadoDe = useCallback(
    (elementoId: string) =>
      data.avances
        .filter((a) => a.elementoId === elementoId)
        .reduce((sum, a) => sum + a.cantidad, 0),
    [data.avances],
  );

  const value = useMemo<ProjectContextValue>(
    () => ({
      elementos: data.elementos,
      avances: data.avances,
      addElemento,
      updateElemento,
      deleteElemento,
      addAvance,
      updateAvance,
      deleteAvance,
      ejecutadoDe,
    }),
    [
      data,
      addElemento,
      updateElemento,
      deleteElemento,
      addAvance,
      updateAvance,
      deleteAvance,
      ejecutadoDe,
    ],
  );

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject(): ProjectContextValue {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error('useProject debe usarse dentro de ProjectProvider');
  return ctx;
}
