/** Redondea hacia arriba a un número "prolijo" (1/2/5 × potencia de 10)
 * para usar como techo de eje, así las líneas de referencia muestran
 * valores redondos en vez de fracciones raras. */
export function niceMax(value: number): number {
  if (value <= 0) return 1;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  const normalized = value / magnitude;
  let niceNormalized: number;
  if (normalized <= 1) niceNormalized = 1;
  else if (normalized <= 2) niceNormalized = 2;
  else if (normalized <= 5) niceNormalized = 5;
  else niceNormalized = 10;
  return niceNormalized * magnitude;
}
