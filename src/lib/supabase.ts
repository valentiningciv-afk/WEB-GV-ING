import { createClient } from '@supabase/supabase-js';

// La URL y la clave "publishable" de Supabase están pensadas para vivir en el
// cliente (equivalente al viejo "anon key"): el control de acceso real lo
// hacen las políticas de Row Level Security en la base, no el secreto de esta
// clave. Por eso no hace falta ocultarla en variables de entorno.
const SUPABASE_URL = 'https://sdselsicumjvnzelsqnl.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_BbYgyiRVBQQ-O0VZCkcKEg_jVIUIf1u';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  realtime: {
    params: { eventsPerSecond: 5 },
  },
});
