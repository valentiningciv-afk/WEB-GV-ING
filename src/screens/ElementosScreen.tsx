import { Plus, Boxes } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ElementCard } from '../components/ElementCard';
import { ElementDetailSheet } from '../components/ElementDetailSheet';
import { ElementForm, type ElementFormValue } from '../components/ElementForm';
import { Header } from '../components/Header';
import { EmptyState } from '../components/ui/EmptyState';
import { Sheet } from '../components/ui/Sheet';
import { useProject } from '../store/ProjectContext';
import { CATEGORIAS, ZONAS, type Categoria, type ElementoEstructural, type Zona } from '../types';
import { CATEGORY_STYLES } from '../utils/categoryStyles';

type CategoriaFiltro = 'todas' | Categoria;
type ZonaFiltro = 'todas' | Zona;

export function ElementosScreen() {
  const { elementos, ejecutadoDe, addElemento, updateElemento } = useProject();
  const [zonaFiltro, setZonaFiltro] = useState<ZonaFiltro>('todas');
  const [catFiltro, setCatFiltro] = useState<CategoriaFiltro>('todas');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ElementoEstructural | null>(null);
  const [detail, setDetail] = useState<ElementoEstructural | null>(null);

  const filtrados = useMemo(
    () =>
      elementos.filter(
        (e) =>
          (zonaFiltro === 'todas' || e.zona === zonaFiltro) &&
          (catFiltro === 'todas' || e.categoria === catFiltro),
      ),
    [elementos, zonaFiltro, catFiltro],
  );

  const grupos = useMemo(
    () =>
      ZONAS.map((zona) => ({
        zona,
        categorias: CATEGORIAS.map((cat) => ({
          cat,
          items: filtrados.filter((e) => e.zona === zona.id && e.categoria === cat.id),
        })).filter((g) => g.items.length > 0),
      })).filter((g) => g.categorias.length > 0),
    [filtrados],
  );

  function openNew() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(e: ElementoEstructural) {
    setDetail(null);
    setEditing(e);
    setFormOpen(true);
  }

  function handleSubmit(value: ElementFormValue) {
    if (editing) {
      updateElemento(editing.id, value);
    } else {
      addElemento(value);
    }
    setFormOpen(false);
    setEditing(null);
  }

  return (
    <div>
      <Header
        title="Elementos"
        subtitle={`${elementos.length} elemento${elementos.length === 1 ? '' : 's'} en el catálogo`}
        action={
          <button
            onClick={openNew}
            className="w-10 h-10 rounded-full bg-accent flex items-center justify-center active:bg-blue-600 shadow-sm"
            aria-label="Agregar elemento"
          >
            <Plus size={22} className="text-white" strokeWidth={2.5} />
          </button>
        }
      />

      <div className="px-5 pt-3 overflow-x-auto">
        <div className="flex gap-2 w-max">
          <FilterChip active={zonaFiltro === 'todas'} onClick={() => setZonaFiltro('todas')} label="Todas las zonas" />
          {ZONAS.map((z) => (
            <FilterChip
              key={z.id}
              active={zonaFiltro === z.id}
              onClick={() => setZonaFiltro(z.id)}
              label={z.nombre}
            />
          ))}
        </div>
      </div>

      <div className="px-5 pt-2 pb-1 overflow-x-auto">
        <div className="flex gap-2 w-max">
          <FilterChip subtle active={catFiltro === 'todas'} onClick={() => setCatFiltro('todas')} label="Todas" />
          {CATEGORIAS.map((c) => (
            <FilterChip
              subtle
              key={c.id}
              active={catFiltro === c.id}
              onClick={() => setCatFiltro(c.id)}
              label={c.nombre}
            />
          ))}
        </div>
      </div>

      {elementos.length === 0 ? (
        <EmptyState
          icon={Boxes}
          title="Todavía no hay elementos"
          description="Cargá los elementos estructurales por zona: Ala de Aulas, Ala de Talleres y Zona 3."
          action={
            <button
              onClick={openNew}
              className="px-5 py-2.5 rounded-full bg-accent text-white text-[14px] font-semibold active:bg-blue-600"
            >
              Agregar el primero
            </button>
          }
        />
      ) : grupos.length === 0 ? (
        <EmptyState
          icon={Boxes}
          title="Sin resultados"
          description="No hay elementos que coincidan con estos filtros."
        />
      ) : (
        <div className="px-5 py-3 space-y-7">
          {grupos.map(({ zona, categorias }) => (
            <div key={zona.id}>
              <h2 className="text-[19px] font-bold text-ink mb-3 px-1">{zona.nombre}</h2>
              <div className="space-y-5">
                {categorias.map(({ cat, items }) => {
                  const style = CATEGORY_STYLES[cat.id];
                  return (
                    <div key={cat.id}>
                      <div className="flex items-center gap-2 mb-2 px-1">
                        <span className={`w-2 h-2 rounded-full ${style.bar}`} />
                        <p className="text-[13px] font-semibold text-ink-2 uppercase tracking-wide">
                          {cat.nombre}
                        </p>
                        <span className="text-[12px] text-ink-3">{items.length}</span>
                      </div>
                      <div className="space-y-2">
                        {items.map((e) => (
                          <ElementCard
                            key={e.id}
                            elemento={e}
                            ejecutado={ejecutadoDe(e.id)}
                            onClick={() => setDetail(e)}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <ElementDetailSheet elemento={detail} onClose={() => setDetail(null)} onEdit={openEdit} />

      <Sheet
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        title={editing ? 'Editar elemento' : 'Nuevo elemento'}
        footer={
          <button
            type="submit"
            form="element-form"
            className="w-full py-3.5 rounded-xl bg-accent text-white text-[16px] font-semibold active:bg-blue-600"
          >
            {editing ? 'Guardar cambios' : 'Agregar elemento'}
          </button>
        }
      >
        <ElementForm formId="element-form" initial={editing ?? undefined} onSubmit={handleSubmit} />
      </Sheet>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  subtle,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  subtle?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full whitespace-nowrap ${
        subtle ? 'px-3 py-1 text-[12px]' : 'px-3.5 py-1.5 text-[13px]'
      } font-medium ${active ? 'bg-white text-black' : 'bg-white/[0.08] text-ink-2'}`}
    >
      {label}
    </button>
  );
}
