import { useState } from 'react'
import { Sun, Moon, Search } from 'lucide-react'

export default function HeaderBar({ onSearch, theme, setTheme }) {
  const [query, setQuery] = useState('')

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light')

  const submit = (e) => {
    e.preventDefault()
    onSearch(query)
  }

  return (
    <header className="w-full sticky top-0 z-20 backdrop-blur bg-white/70 dark:bg-black/40 border-b border-black/5 dark:border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
        <div className="text-2xl font-semibold tracking-tight">
          <span className="text-emerald-600">श्रीमद्</span> <span className="text-gray-900 dark:text-gray-100">भगवद्गीता</span>
        </div>
        <form onSubmit={submit} className="flex-1 flex items-center gap-2">
          <div className="flex items-center gap-2 flex-1 bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-2">
            <Search size={18} className="text-gray-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search verses, words, translations..."
              className="bg-transparent outline-none w-full text-sm"
            />
          </div>
          <button className="px-3 py-2 text-sm rounded-full bg-emerald-600 text-white hover:bg-emerald-700">Search</button>
        </form>
        <button
          aria-label="Toggle theme"
          onClick={toggleTheme}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>
    </header>
  )
}
