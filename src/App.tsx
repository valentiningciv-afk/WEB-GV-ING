import { WifiOff } from 'lucide-react';
import { useState } from 'react';
import { BottomNav } from './components/BottomNav';
import { ProjectProvider } from './store/ProjectContext';
import { LocalProjectProvider } from './store/LocalProjectContext';
import { useProject } from './store/projectContextBase';
import { InicioScreen } from './screens/InicioScreen';
import { ElementosScreen } from './screens/ElementosScreen';
import { AvanceScreen } from './screens/AvanceScreen';
import { ReportesScreen } from './screens/ReportesScreen';

export type Tab = 'inicio' | 'elementos' | 'avance' | 'reportes';

const IS_LOCAL_PREVIEW = import.meta.env.VITE_BACKEND === 'local';

function AppShell() {
  const [tab, setTab] = useState<Tab>('inicio');
  const { loading, syncError } = useProject();

  if (loading) {
    return (
      <div className="min-h-svh flex items-center justify-center bg-app">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-white/15 border-t-accent animate-spin" />
          <p className="text-[13px] text-ink-2">Conectando con la base del proyecto…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-svh flex flex-col bg-app">
      {IS_LOCAL_PREVIEW && (
        <div className="bg-accent/90 text-white text-[12px] px-4 py-1.5 text-center pt-[calc(env(safe-area-inset-top)+6px)]">
          Vista previa — los datos se guardan solo en este dispositivo, no se comparten
        </div>
      )}
      {syncError && (
        <div className="bg-red-500/90 text-white text-[12.5px] px-4 py-2 flex items-center gap-2 pt-[calc(env(safe-area-inset-top)+8px)]">
          <WifiOff size={14} className="shrink-0" />
          <span className="truncate">Sin conexión con la base compartida: {syncError}</span>
        </div>
      )}
      <main className="flex-1 pb-[calc(64px+env(safe-area-inset-bottom))]">
        <div className="max-w-lg mx-auto w-full">
          {tab === 'inicio' && <InicioScreen onNavigate={setTab} />}
          {tab === 'elementos' && <ElementosScreen />}
          {tab === 'avance' && <AvanceScreen />}
          {tab === 'reportes' && <ReportesScreen />}
        </div>
      </main>
      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}

// Modo local (sin Supabase): usado para publicar una vista previa
// autocontenida que no depende de tener la base de datos configurada.
const Provider = import.meta.env.VITE_BACKEND === 'local' ? LocalProjectProvider : ProjectProvider;

function App() {
  return (
    <Provider>
      <AppShell />
    </Provider>
  );
}

export default App;
