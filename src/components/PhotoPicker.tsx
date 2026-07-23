import { Camera, ImageOff, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { compressImage } from '../utils/image';

interface PhotoPickerProps {
  value: string | null;
  onChange: (dataUrl: string | null) => void;
}

export function PhotoPicker({ value, onChange }: PhotoPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setLoading(true);
    try {
      const compressed = await compressImage(file);
      onChange(compressed);
    } finally {
      setLoading(false);
    }
  }

  if (value) {
    return (
      <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-black/[0.04] ring-1 ring-black/[0.06]">
        <img src={value} alt="Sección del elemento" className="w-full h-full object-cover" />
        <button
          type="button"
          onClick={() => onChange(null)}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/55 backdrop-blur flex items-center justify-center"
          aria-label="Quitar foto"
        >
          <X size={16} className="text-white" />
        </button>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="absolute bottom-2 right-2 px-3 py-1.5 rounded-full bg-black/55 backdrop-blur text-white text-[12px] font-medium flex items-center gap-1.5"
        >
          <Camera size={14} /> Cambiar
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="file-input-hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      disabled={loading}
      className="w-full aspect-[4/3] rounded-2xl bg-white ring-1 ring-black/[0.06] flex flex-col items-center justify-center gap-2 text-[#8e8e93] active:bg-black/[0.02]"
    >
      {loading ? (
        <span className="text-[13px]">Procesando…</span>
      ) : (
        <>
          <span className="w-11 h-11 rounded-full bg-black/[0.05] flex items-center justify-center">
            <Camera size={20} strokeWidth={1.75} />
          </span>
          <span className="text-[13px] font-medium">Foto de la sección</span>
        </>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="file-input-hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </button>
  );
}

export function PhotoThumb({ src, sizeClass = 'w-14 h-14' }: { src: string | null; sizeClass?: string }) {
  if (!src) {
    return (
      <div className={`${sizeClass} rounded-xl bg-black/[0.05] flex items-center justify-center shrink-0`}>
        <ImageOff size={18} className="text-[#c7c7cc]" strokeWidth={1.75} />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt=""
      className={`${sizeClass} rounded-xl object-cover shrink-0 ring-1 ring-black/[0.06]`}
    />
  );
}
