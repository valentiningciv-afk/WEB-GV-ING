import { useState } from 'react';
import { useProject } from '../store/ProjectContext';
import type { ElementoEstructural } from '../types';
import { CATEGORY_STYLES } from '../utils/categoryStyles';
import { todayISO } from '../utils/format';
import { PhotoThumb } from './PhotoPicker';
import { Field, inputClass } from './ui/Field';
import { ProgressBar } from './ui/ProgressBar';
import { Sheet } from './ui/Sheet';
import { Stepper } from './ui/Stepper';

interface RegisterAvanceSheetProps {
  elemento: ElementoEstructural | null;
  onClose: () => void;
}

export function RegisterAvanceSheet({ elemento, onClose }: RegisterAvanceSheetProps) {
  const { addAvance, ejecutadoDe } = useProject();

  if (!elemento) return null;
  return <Inner key={elemento.id} elemento={elemento} onClose={onClose} addAvance={addAvance} ejecutado={ejecutadoDe(elemento.id)} />;
}

function Inner({
  elemento,
  onClose,
  addAvance,
  ejecutado,
}: {
  elemento: ElementoEstructural;
  onClose: () => void;
  addAvance: (a: { elementoId: string; cantidad: number; fecha: string; observaciones: string }) => void;
  ejecutado: number;
}) {
  const restante = Math.max(0, elemento.cantidad - ejecutado);
  const [cantidad, setCantidad] = useState(Math.min(1, restante) || 1);
  const [fecha, setFecha] = useState(todayISO());
  const [observaciones, setObservaciones] = useState('');
  const style = CATEGORY_STYLES[elemento.categoria];

  function handleSubmit() {
    if (cantidad <= 0) return;
    addAvance({ elementoId: elemento.id, cantidad, fecha, observaciones: observaciones.trim() });
    onClose();
  }

  return (
    <Sheet
      open
      onClose={onClose}
      title="Registrar avance"
      footer={
        <button
          onClick={handleSubmit}
          disabled={cantidad <= 0}
          className="w-full py-3.5 rounded-xl bg-[#007AFF] text-white text-[16px] font-semibold active:bg-[#0062cc] disabled:opacity-40"
        >
          Guardar avance
        </button>
      }
    >
      <div className="flex items-center gap-3 bg-white rounded-2xl p-3 mb-4">
        <PhotoThumb src={elemento.foto} sizeClass="w-14 h-14" />
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-semibold text-[#1c1c1e] truncate">{elemento.nombre}</p>
          <p className="text-[12.5px] text-[#8e8e93] mb-1">
            {ejecutado}/{elemento.cantidad} hecho
          </p>
          <ProgressBar
            percent={(ejecutado / elemento.cantidad) * 100}
            colorClass={style.bar}
            heightClass="h-1.5"
          />
        </div>
      </div>

      {restante === 0 ? (
        <p className="text-[14px] text-losa-700 bg-losa-50 rounded-xl px-3.5 py-3 mb-4 font-medium">
          Este elemento ya está completo. Podés seguir registrando avances adicionales si corresponde.
        </p>
      ) : (
        <p className="text-[13px] text-[#8e8e93] px-1 mb-4">
          Quedan <strong className="text-[#1c1c1e]">{restante}</strong> unidad{restante === 1 ? '' : 'es'} por hormigonar.
        </p>
      )}

      <Field label="Cantidad hormigonada">
        <div className="bg-white rounded-xl ring-1 ring-black/[0.06] px-3.5 py-2.5 flex justify-center">
          <Stepper value={cantidad} onChange={setCantidad} min={1} max={restante || undefined} />
        </div>
      </Field>

      <Field label="Fecha">
        <input
          type="date"
          className={inputClass}
          value={fecha}
          max={todayISO()}
          onChange={(e) => setFecha(e.target.value)}
        />
      </Field>

      <Field label="Observaciones (opcional)">
        <textarea
          className={`${inputClass} min-h-16 resize-none`}
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          placeholder="Ej: Se hormigonó con bomba, clima favorable"
        />
      </Field>
    </Sheet>
  );
}
