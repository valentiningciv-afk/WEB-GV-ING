import { useState } from 'react';
import type { Categoria, ElementoEstructural, UnidadMedida, Zona } from '../types';
import { CategoryPicker } from './CategoryPicker';
import { ZonaPicker } from './ZonaPicker';
import { PhotoPicker } from './PhotoPicker';
import { Field, inputClass } from './ui/Field';
import { Stepper } from './ui/Stepper';

export interface ElementFormValue {
  nombre: string;
  categoria: Categoria;
  zona: Zona;
  cantidad: number;
  unidadMedida: UnidadMedida;
  foto: string | null;
  volumen: number;
  altura: number;
  materialEncofrado: string;
}

interface ElementFormProps {
  initial?: ElementoEstructural;
  onSubmit: (value: ElementFormValue) => void;
  formId: string;
}

export function ElementForm({ initial, onSubmit, formId }: ElementFormProps) {
  const [nombre, setNombre] = useState(initial?.nombre ?? '');
  const [categoria, setCategoria] = useState<Categoria>(initial?.categoria ?? 'viga_aerea');
  const [zona, setZona] = useState<Zona>(initial?.zona ?? 'aulas');
  const [unidadMedida, setUnidadMedida] = useState<UnidadMedida>(initial?.unidadMedida ?? 'u');
  const [cantidad, setCantidad] = useState(initial?.cantidad ?? 1);
  const [foto, setFoto] = useState<string | null>(initial?.foto ?? null);
  const [volumen, setVolumen] = useState(initial?.volumen ?? 0);
  const [altura, setAltura] = useState(initial?.altura ?? 0);
  const [materialEncofrado, setMaterialEncofrado] = useState(
    initial?.materialEncofrado ?? '',
  );

  return (
    <form
      id={formId}
      onSubmit={(e) => {
        e.preventDefault();
        if (!nombre.trim()) return;
        onSubmit({
          nombre: nombre.trim(),
          categoria,
          zona,
          cantidad,
          unidadMedida,
          foto,
          volumen,
          altura,
          materialEncofrado: materialEncofrado.trim(),
        });
      }}
    >
      <Field label="Zona / frente de avance">
        <ZonaPicker value={zona} onChange={setZona} />
      </Field>

      <Field label="Categoría">
        <CategoryPicker value={categoria} onChange={setCategoria} />
      </Field>

      <Field label="Nombre" hint="Ej: VIT, VE, VEL 1, VI 2">
        <input
          className={inputClass}
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre que usamos en obra"
          required
        />
      </Field>

      <Field label="Foto de la sección">
        <PhotoPicker value={foto} onChange={setFoto} />
      </Field>

      <Field label="Unidad de medida del cómputo">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setUnidadMedida('u')}
            className={`rounded-xl px-3 py-2.5 text-[14px] font-medium border-2 ${
              unidadMedida === 'u'
                ? 'bg-accent/15 border-accent text-accent'
                : 'bg-surface-2 border-transparent text-ink'
            }`}
          >
            Unidades
          </button>
          <button
            type="button"
            onClick={() => setUnidadMedida('m2')}
            className={`rounded-xl px-3 py-2.5 text-[14px] font-medium border-2 ${
              unidadMedida === 'm2'
                ? 'bg-accent/15 border-accent text-accent'
                : 'bg-surface-2 border-transparent text-ink'
            }`}
          >
            m² (superficie)
          </button>
        </div>
      </Field>

      <Field label={unidadMedida === 'u' ? 'Cantidad total en esta zona' : 'Superficie total en esta zona (m²)'}>
        {unidadMedida === 'u' ? (
          <div className="bg-surface rounded-xl ring-1 ring-white/[0.08] px-3.5 py-2.5 flex justify-center">
            <Stepper value={cantidad} onChange={setCantidad} min={1} />
          </div>
        ) : (
          <input
            className={inputClass}
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            value={cantidad}
            onChange={(e) => setCantidad(Number(e.target.value))}
            placeholder="0.00"
          />
        )}
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Volumen (m³/u)">
          <input
            className={inputClass}
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            value={volumen}
            onChange={(e) => setVolumen(Number(e.target.value))}
            placeholder="0.00"
          />
        </Field>
        <Field label="Altura (m)">
          <input
            className={inputClass}
            type="number"
            inputMode="decimal"
            step="0.1"
            min="0"
            value={altura}
            onChange={(e) => setAltura(Number(e.target.value))}
            placeholder="0.0"
          />
        </Field>
      </div>

      <Field
        label="Material de encofrado"
        hint="Ej: Fenólico 18mm + puntales + clavadera de pino"
      >
        <textarea
          className={`${inputClass} min-h-20 resize-none`}
          value={materialEncofrado}
          onChange={(e) => setMaterialEncofrado(e.target.value)}
          placeholder="Detalle del material necesario para encofrar"
        />
      </Field>
    </form>
  );
}
