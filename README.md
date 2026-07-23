# EPET 24 — Control de Avance de Hormigón

Aplicación web para organizar y controlar el avance de estructura de hormigón del proyecto **EPET 24**.

## Qué hace

- Carga del catálogo de elementos estructurales del proyecto (vigas aéreas, losas, columnas y columnas con ménsulas), con nombre, cantidad, foto de sección, volumen de hormigón, altura y material de encofrado necesario.
- Registro de avance: qué cantidad de cada elemento se hormigonó y en qué fecha.
- Acumulado automático por elemento y por categoría, con porcentaje de avance a la fecha.
- Panel general con el resumen del proyecto (tipo "anillos" de actividad) para que todo el equipo sepa cuánto falta.

## Stack

- React + TypeScript + Vite
- Tailwind CSS (diseño estilo iOS/Apple, navegación inferior por solapas)
- Persistencia local en el navegador (localStorage) — sin backend

## Desarrollo

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
