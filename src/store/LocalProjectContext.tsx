import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { createSeedAvances, createSeedElementos, SEED_VERSION } from '../data/seedElementos';
import type { AvanceEntry, ElementoEstructural, Proyecto } from '../types';
import { ProjectContext, uid, type ProjectContextValue } from './projectContextBase';

const STORAGE_KEY = 'epet24-hormigon-local-v1';
const VERSION_KEY = 'epet24-hormigon-local-seed-version';

function freshSeed(): Proyecto {
  const elementos = createSeedElementos();
  const avances = createSeedAvances(elementos);
  return { elementos, avances };
}

function loadInitial(): Proyecto {
  try {
    // Si cambió el cómputo base (nueva carga de datos), se descarta lo
    // guardado en este navegador y se arranca de nuevo con el dato fresco —
    // si no, quien ya haya abierto la vista previa antes nunca vería una
    // corrección posterior.
    const storedVersion = localStorage.getItem(VERSION_KEY);
    if (storedVersion !== String(SEED_VERSION)) {
      const data = freshSeed();
      localStorage.setItem(VERSION_KEY, String(SEED_VERSION));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return data;
    }
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Proyecto;
  } catch {
    // localStorage corrupto o inaccesible: se arranca con el cómputo base
  }
  return freshSeed();
}

/**
 * Variante sin backend: guarda todo en el navegador (localStorage) en vez de
 * Supabase. Se usa para publicar una vista previa autocontenida (Artifact)
 * que se pueda compartir sin pedirle a nadie que configure una base de
 * datos. No sincroniza entre dispositivos — cada uno ve su propia copia.
 */
export function LocalProjectProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Proyecto>(loadInitial);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // cuota de almacenamiento excedida: se ignora, los datos siguen en memoria
    }
  }, [data]);

  const addElemento = useCallback((e: Omit<ElementoEstructural, 'id' | 'creadoEn'>) => {
    const id = uid();
    setData((prev) => ({
      ...prev,
      elementos: [...prev.elementos, { ...e, id, creadoEn: new Date().toISOString() }],
    }));
    return id;
  }, []);

  const updateElemento = useCallback(
    (id: string, e: Omit<ElementoEstructural, 'id' | 'creadoEn'>) => {
      setData((prev) => ({
        ...prev,
        elementos: prev.elementos.map((el) => (el.id === id ? { ...el, ...e } : el)),
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
      avances: [...prev.avances, { ...a, id: uid(), creadoEn: new Date().toISOString() }],
    }));
  }, []);

  const updateAvance = useCallback(
    (id: string, a: Omit<AvanceEntry, 'id' | 'creadoEn'>) => {
      setData((prev) => ({
        ...prev,
        avances: prev.avances.map((av) => (av.id === id ? { ...av, ...a } : av)),
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
      loading: false,
      syncError: null,
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

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
}
