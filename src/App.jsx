import { useMemo, useState } from 'react';
import Spline from '@splinetool/react-spline';
import HeaderBar from './components/HeaderBar';
import ChapterNavigator from './components/ChapterNavigator';
import VerseLearning from './components/VerseLearning';
import ChatbotPanel from './components/ChatbotPanel';

export default function App() {
  const [query, setQuery] = useState('');
  const [selection, setSelection] = useState(null);

  // Responsive layout columns
  const layoutCols = useMemo(() => 'grid-cols-1 lg:grid-cols-[340px_minmax(0,1fr)_360px]', []);

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-emerald-50 to-white dark:from-[#0b1111] dark:to-black">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/7rVn7R0U1w2m-Scene.splinecode" style={{ width: '100%', height: '100%' }} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/70 via-white/60 to-white/80 dark:from-black/60 dark:via-black/70 dark:to-black/80" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-3 md:px-6 pb-10">
        <HeaderBar query={query} onQueryChange={setQuery} />

        <main className={`mt-6 grid ${layoutCols} gap-4 md:gap-6`}>
          <section className="min-h-[360px] lg:min-h-[640px]">
            <ChapterNavigator
              query={query}
              current={selection}
              onPick={(sel) => setSelection(sel)}
            />
          </section>

          <section className="min-h-[360px] lg:min-h-[640px]">
            <VerseLearning selection={selection} />
          </section>

          <section className="min-h-[360px] lg:min-h-[640px]">
            <ChatbotPanel />
          </section>
        </main>

        <footer className="mt-8 text-center text-xs text-black/60 dark:text-white/60">
          Built for mindful practice • Tap a verse, listen, then speak and get instant feedback
        </footer>
      </div>
    </div>
  );
}
