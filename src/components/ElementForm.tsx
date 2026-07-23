import { useState } from 'react';
import type { Categoria, ElementoEstructural } from '../types';
import { CategoryPicker } from './CategoryPicker';
import { PhotoPicker } from './PhotoPicker';
import { Field, inputClass } from './ui/Field';
import { Stepper } from './ui/Stepper';

export interface ElementFormValue {
  nombre: string;
  categoria: Categoria;
  cantidad: number;
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
        onSubmit({ nombre: nombre.trim(), categoria, cantidad, foto, volumen, altura, materialEncofrado: materialEncofrado.trim() });
      }}
    >
      <Field label="Categoría">
        <CategoryPicker value={categoria} onChange={setCategoria} />
      </Field>

      <Field label="Nombre del elemento" hint="Ej: Viga V1, Losa Nivel +3.50, Columna C4">
        <input
          className={inputClass}
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre o identificador"
          required
        />
      </Field>

      <Field label="Foto de la sección">
        <PhotoPicker value={foto} onChange={setFoto} />
      </Field>

      <Field label="Cantidad total en el proyecto">
        <div className="bg-white rounded-xl ring-1 ring-black/[0.06] px-3.5 py-2.5 flex justify-center">
          <Stepper value={cantidad} onChange={setCantidad} min={1} />
        </div>
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
