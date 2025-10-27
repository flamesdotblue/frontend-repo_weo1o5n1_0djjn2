import { useEffect, useState } from 'react';
import { BookOpenText, Search, Sun, Moon } from 'lucide-react';

export default function HeaderBar({ query, onQueryChange }) {
  const [dark, setDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    return document.documentElement.classList.contains('dark');
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [dark]);

  return (
    <header className="w-full py-4 px-4 md:px-6 flex items-center gap-3 border-b border-black/5 dark:border-white/10 backdrop-blur-sm bg-white/60 dark:bg-black/40 rounded-b-xl">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
          <BookOpenText className="w-5 h-5" />
        </div>
        <div className="leading-tight">
          <div className="font-semibold text-black dark:text-white tracking-tight">Gita Pronounce</div>
          <div className="text-xs text-black/60 dark:text-white/60">Learn Bhagavad Gita recitation</div>
        </div>
      </div>

      <div className="flex-1" />

      <div className="hidden md:flex items-center w-full max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/50 dark:text-white/50" />
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search verses or keywords..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/80 dark:bg-white/5 border border-black/10 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/60 text-black dark:text-white placeholder:text-black/50 dark:placeholder:text-white/50"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={() => setDark((d) => !d)}
        className="ml-3 inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 hover:bg-white/90 dark:hover:bg-white/10 transition text-black dark:text-white"
        aria-label="Toggle theme"
      >
        {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        <span className="hidden sm:inline text-sm">{dark ? 'Light' : 'Dark'}</span>
      </button>
    </header>
  );
}
