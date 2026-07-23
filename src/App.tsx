import { useState } from 'react';
import { BottomNav } from './components/BottomNav';
import { ProjectProvider } from './store/ProjectContext';
import { InicioScreen } from './screens/InicioScreen';
import { ElementosScreen } from './screens/ElementosScreen';
import { AvanceScreen } from './screens/AvanceScreen';
import { ReportesScreen } from './screens/ReportesScreen';

export type Tab = 'inicio' | 'elementos' | 'avance' | 'reportes';

function App() {
  const [tab, setTab] = useState<Tab>('inicio');

  return (
    <ProjectProvider>
      <div className="min-h-svh flex flex-col bg-[#f2f2f7]">
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
    </ProjectProvider>
  );
}

export default App;
