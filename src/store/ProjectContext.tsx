import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { createSeedAvances, createSeedElementos } from '../data/seedElementos';
import { supabase } from '../lib/supabase';
import {
  avanceFromRow,
  avanceToRow,
  elementoFromRow,
  elementoToRow,
  type AvanceRow,
  type ElementoRow,
} from '../lib/mappers';
import type { AvanceEntry, ElementoEstructural } from '../types';

function uid(): string {
  return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
}

interface ProjectContextValue {
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

const ProjectContext = createContext<ProjectContextValue | null>(null);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [elementos, setElementos] = useState<ElementoEstructural[]>([]);
  const [avances, setAvances] = useState<AvanceEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncError, setSyncError] = useState<string | null>(null);
  const avancesRef = useRef(avances);
  avancesRef.current = avances;

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      const [elementosRes, avancesRes] = await Promise.all([
        supabase.from('elementos').select('*'),
        supabase.from('avances').select('*'),
      ]);

      if (cancelled) return;

      if (elementosRes.error || avancesRes.error) {
        setSyncError(
          (elementosRes.error ?? avancesRes.error)?.message ??
            'No se pudo conectar con la base de datos compartida.',
        );
        setLoading(false);
        return;
      }

      let elementosData = (elementosRes.data as ElementoRow[]).map(elementoFromRow);
      let avancesData = (avancesRes.data as AvanceRow[]).map(avanceFromRow);

      const seedElementos = createSeedElementos();
      if (elementosData.length === 0 && seedElementos.length > 0) {
        const { error: insertElError } = await supabase
          .from('elementos')
          .insert(seedElementos.map(elementoToRow));
        if (!insertElError) {
          elementosData = seedElementos;
          const seedAvances = createSeedAvances(seedElementos);
          if (seedAvances.length > 0) {
            const { error: insertAvError } = await supabase
              .from('avances')
              .insert(seedAvances.map(avanceToRow));
            if (!insertAvError) {
              avancesData = seedAvances;
            }
          }
        }
      }

      if (cancelled) return;
      setElementos(elementosData);
      setAvances(avancesData);
      setLoading(false);
    }

    bootstrap();

    const channel = supabase
      .channel('epet24-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'elementos' },
        (payload) => {
          if (payload.eventType === 'DELETE') {
            const oldId = (payload.old as Partial<ElementoRow>).id;
            setElementos((prev) => prev.filter((e) => e.id !== oldId));
            return;
          }
          const elemento = elementoFromRow(payload.new as ElementoRow);
          setElementos((prev) => {
            const idx = prev.findIndex((e) => e.id === elemento.id);
            if (idx === -1) return [...prev, elemento];
            const next = [...prev];
            next[idx] = elemento;
            return next;
          });
        },
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'avances' },
        (payload) => {
          if (payload.eventType === 'DELETE') {
            const oldId = (payload.old as Partial<AvanceRow>).id;
            setAvances((prev) => prev.filter((a) => a.id !== oldId));
            return;
          }
          const avance = avanceFromRow(payload.new as AvanceRow);
          setAvances((prev) => {
            const idx = prev.findIndex((a) => a.id === avance.id);
            if (idx === -1) return [...prev, avance];
            const next = [...prev];
            next[idx] = avance;
            return next;
          });
        },
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, []);

  const addElemento = useCallback((e: Omit<ElementoEstructural, 'id' | 'creadoEn'>) => {
    const nuevo: ElementoEstructural = { ...e, id: uid(), creadoEn: new Date().toISOString() };
    setElementos((prev) => [...prev, nuevo]);
    supabase
      .from('elementos')
      .insert(elementoToRow(nuevo))
      .then(({ error }) => {
        if (error) {
          setSyncError(error.message);
          setElementos((prev) => prev.filter((el) => el.id !== nuevo.id));
        } else {
          setSyncError(null);
        }
      });
    return nuevo.id;
  }, []);

  const updateElemento = useCallback(
    (id: string, e: Omit<ElementoEstructural, 'id' | 'creadoEn'>) => {
      setElementos((prev) => prev.map((el) => (el.id === id ? { ...el, ...e } : el)));
      const actualizado = elementos.find((el) => el.id === id);
      const creadoEn = actualizado?.creadoEn ?? new Date().toISOString();
      supabase
        .from('elementos')
        .update(elementoToRow({ ...e, id, creadoEn }))
        .eq('id', id)
        .then(({ error }) => setSyncError(error ? error.message : null));
    },
    [elementos],
  );

  const deleteElemento = useCallback((id: string) => {
    setElementos((prev) => prev.filter((el) => el.id !== id));
    setAvances((prev) => prev.filter((a) => a.elementoId !== id));
    supabase
      .from('elementos')
      .delete()
      .eq('id', id)
      .then(({ error }) => setSyncError(error ? error.message : null));
  }, []);

  const addAvance = useCallback((a: Omit<AvanceEntry, 'id' | 'creadoEn'>) => {
    const nuevo: AvanceEntry = { ...a, id: uid(), creadoEn: new Date().toISOString() };
    setAvances((prev) => [...prev, nuevo]);
    supabase
      .from('avances')
      .insert(avanceToRow(nuevo))
      .then(({ error }) => {
        if (error) {
          setSyncError(error.message);
          setAvances((prev) => prev.filter((av) => av.id !== nuevo.id));
        } else {
          setSyncError(null);
        }
      });
  }, []);

  const updateAvance = useCallback(
    (id: string, a: Omit<AvanceEntry, 'id' | 'creadoEn'>) => {
      const actual = avancesRef.current.find((av) => av.id === id);
      const creadoEn = actual?.creadoEn ?? new Date().toISOString();
      setAvances((prev) => prev.map((av) => (av.id === id ? { ...av, ...a } : av)));
      supabase
        .from('avances')
        .update(avanceToRow({ ...a, id, creadoEn }))
        .eq('id', id)
        .then(({ error }) => setSyncError(error ? error.message : null));
    },
    [],
  );

  const deleteAvance = useCallback((id: string) => {
    setAvances((prev) => prev.filter((a) => a.id !== id));
    supabase
      .from('avances')
      .delete()
      .eq('id', id)
      .then(({ error }) => setSyncError(error ? error.message : null));
  }, []);

  const ejecutadoDe = useCallback(
    (elementoId: string) =>
      avances
        .filter((a) => a.elementoId === elementoId)
        .reduce((sum, a) => sum + a.cantidad, 0),
    [avances],
  );

  const value = useMemo<ProjectContextValue>(
    () => ({
      elementos,
      avances,
      loading,
      syncError,
      addElemento,
      updateElemento,
      deleteElemento,
      addAvance,
      updateAvance,
      deleteAvance,
      ejecutadoDe,
    }),
    [
      elementos,
      avances,
      loading,
      syncError,
      addElemento,
      updateElemento,
      deleteElemento,
      addAvance,
      updateAvance,
      deleteAvance,
      ejecutadoDe,
    ],
  );

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
}

export function useProject(): ProjectContextValue {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error('useProject debe usarse dentro de ProjectProvider');
  return ctx;
}
