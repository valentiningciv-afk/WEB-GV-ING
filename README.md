# EPET 24 — Control de Avance de Hormigón

Aplicación web para organizar y controlar el avance de estructura de hormigón del proyecto **EPET 24**.

## Qué hace

- Catálogo de elementos estructurales organizado por zona (frente de avance), nivel y categoría: nombre, cantidad, foto de sección, volumen de hormigón, nivel y material de encofrado necesario.
- Registro de avance: qué cantidad de cada elemento se hormigonó y en qué fecha.
- Acumulado automático por elemento, por zona y por categoría, con porcentaje de avance a la fecha.
- Panel general con anillos de progreso de vigas y losas.

## Stack

- React + TypeScript + Vite
- Tailwind CSS (diseño estilo iOS/Apple en modo oscuro, navegación inferior por solapas)
- Persistencia local en el dispositivo (localStorage) — pensada para un único usuario a cargo de la carga de datos, sin backend ni configuración adicional.

Cuando cambia el cómputo base del proyecto (`src/data/seedElementos.ts`), se incrementa `SEED_VERSION` en ese mismo archivo para que la app detecte la actualización y recargue los datos frescos la próxima vez que se abra.

## Desarrollo

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
