-- EPET 24 · Avance de Hormigón — esquema de base de datos
-- Pegar y ejecutar completo en Supabase → SQL Editor.
-- Se puede volver a correr sin romper nada (usa "if not exists").

create table if not exists elementos (
  id text primary key,
  nombre text not null,
  categoria text not null check (categoria in ('viga_aerea', 'losa', 'columna', 'columna_mensula', 'antepecho')),
  zona text not null check (zona in ('aulas', 'talleres', 'zona3')),
  cantidad numeric not null default 0,
  unidad_medida text not null check (unidad_medida in ('u', 'm2')),
  foto text,
  volumen numeric not null default 0,
  altura numeric not null default 0,
  material_encofrado text not null default '',
  creado_en timestamptz not null default now()
);

-- Reconcilia el esquema si la tabla ya existía de una corrida anterior
-- (antes de que se agregara "zona" o se sacara "nombre_pliego").
alter table elementos add column if not exists zona text;
update elementos set zona = 'aulas' where zona is null;
alter table elementos alter column zona set not null;
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'elementos_zona_check'
  ) then
    alter table elementos add constraint elementos_zona_check
      check (zona in ('aulas', 'talleres', 'zona3'));
  end if;
end $$;
alter table elementos drop column if exists nombre_pliego;

create table if not exists avances (
  id text primary key,
  elemento_id text not null references elementos (id) on delete cascade,
  cantidad numeric not null,
  fecha date not null,
  observaciones text not null default '',
  creado_en timestamptz not null default now()
);

create index if not exists avances_elemento_id_idx on avances (elemento_id);

-- Row Level Security: el equipo comparte el link de la app sin login propio,
-- así que se habilita lectura y escritura abierta a quien tenga la clave
-- pública. No hay datos sensibles (solo avance de obra), pero si más adelante
-- quieren restringirlo con usuarios/login, estas políticas son el lugar donde
-- ajustarlo.
alter table elementos enable row level security;
alter table avances enable row level security;

drop policy if exists "elementos_select" on elementos;
drop policy if exists "elementos_insert" on elementos;
drop policy if exists "elementos_update" on elementos;
drop policy if exists "elementos_delete" on elementos;
create policy "elementos_select" on elementos for select using (true);
create policy "elementos_insert" on elementos for insert with check (true);
create policy "elementos_update" on elementos for update using (true) with check (true);
create policy "elementos_delete" on elementos for delete using (true);

drop policy if exists "avances_select" on avances;
drop policy if exists "avances_insert" on avances;
drop policy if exists "avances_update" on avances;
drop policy if exists "avances_delete" on avances;
create policy "avances_select" on avances for select using (true);
create policy "avances_insert" on avances for insert with check (true);
create policy "avances_update" on avances for update using (true) with check (true);
create policy "avances_delete" on avances for delete using (true);

-- Habilita las actualizaciones en tiempo real (para que todos los celulares
-- vean el avance apenas alguien lo carga, sin recargar la página).
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'elementos'
  ) then
    alter publication supabase_realtime add table elementos;
  end if;
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'avances'
  ) then
    alter publication supabase_realtime add table avances;
  end if;
end $$;
