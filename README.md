# EPET 24 — Control de Avance de Hormigón

Aplicación web para organizar y controlar el avance de estructura de hormigón del proyecto **EPET 24**.

## Qué hace

- Carga del catálogo de elementos estructurales del proyecto (vigas aéreas, losas, columnas y columnas con ménsulas), con nombre, cantidad, foto de sección, volumen de hormigón, altura y material de encofrado necesario.
- Registro de avance: qué cantidad de cada elemento se hormigonó y en qué fecha.
- Acumulado automático por elemento y por categoría, con porcentaje de avance a la fecha.
- Panel general con el resumen del proyecto (tipo "anillos" de actividad) para que todo el equipo sepa cuánto falta.

- Todo el equipo ve el mismo avance actualizado en tiempo real, desde cualquier celular.

## Stack

- React + TypeScript + Vite
- Tailwind CSS (diseño estilo iOS/Apple, navegación inferior por solapas)
- Supabase (Postgres + tiempo real) como base de datos compartida

## Base de datos (Supabase)

El esquema vive en [`supabase/schema.sql`](supabase/schema.sql). Para configurar un proyecto Supabase nuevo, pegar y ejecutar ese archivo completo en **SQL Editor** del panel de Supabase. Es seguro volver a correrlo (usa `if not exists`).

La URL del proyecto y la clave pública ("publishable key") están en `src/lib/supabase.ts`. Esa clave está pensada para vivir en el cliente — el control de acceso real lo hacen las políticas de Row Level Security definidas en el esquema, no el secreto de la clave.

## Desarrollo

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
