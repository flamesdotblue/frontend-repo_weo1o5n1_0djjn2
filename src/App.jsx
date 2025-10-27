import { useEffect, useState } from 'react'
import HeaderBar from './components/HeaderBar'
import ChapterNavigator from './components/ChapterNavigator'
import VerseLearning from './components/VerseLearning'
import ChatbotPanel from './components/ChatbotPanel'

const API = import.meta.env.VITE_BACKEND_URL

function App() {
  const [theme, setTheme] = useState('light')
  const [selected, setSelected] = useState(null)
  const [daily, setDaily] = useState(null)
  const [stats, setStats] = useState(null)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  const onSearch = async (q) => {
    if (!q) return
    const res = await fetch(`${API}/api/search?q=${encodeURIComponent(q)}`)
    const data = await res.json()
    if (data.results?.length) {
      setSelected({ chapter: data.results[0].chapter, verse: data.results[0] })
    }
  }

  const loadDaily = async () => {
    const res = await fetch(`${API}/api/daily_verse`)
    const data = await res.json()
    setDaily(data)
    setSelected({ chapter: data.chapter, verse: data })
  }

  const loadStats = async () => {
    const res = await fetch(`${API}/api/stats`)
    const data = await res.json()
    setStats(data)
  }
  useEffect(() => { loadDaily(); loadStats() }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-950 dark:to-gray-900 text-gray-900 dark:text-gray-100">
      <HeaderBar onSearch={onSearch} theme={theme} setTheme={setTheme} />
      <main className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/70 dark:bg-gray-900/60 backdrop-blur rounded-xl border border-black/5 dark:border-white/10 p-4">
            {daily && (
              <div className="text-sm text-gray-600 dark:text-gray-300">
                <div className="font-semibold text-emerald-700 dark:text-emerald-400">Daily verse</div>
                <div className="text-lg mt-1">{daily.devanagari}</div>
                <div className="text-sm mt-1">{daily.transliteration}</div>
              </div>
            )}
          </div>

          <VerseLearning selected={selected} />
        </div>
        <div className="space-y-6">
          <ChapterNavigator onSelectVerse={setSelected} onDaily={loadDaily} />

          <div className="bg-white/70 dark:bg-gray-900/60 backdrop-blur rounded-xl border border-black/5 dark:border-white/10 p-4">
            <h3 className="font-semibold mb-2">Learning stats</h3>
            {stats ? (
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="text-gray-500">Bookmarks</div>
                  <div className="text-2xl font-semibold">{stats.bookmark_count}</div>
                </div>
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="text-gray-500">Practiced</div>
                  <div className="text-2xl font-semibold">{stats.progress_count}</div>
                </div>
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="text-gray-500">Mastered</div>
                  <div className="text-2xl font-semibold">{stats.mastered_count}</div>
                </div>
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="text-gray-500">Avg score</div>
                  <div className="text-2xl font-semibold">{stats.avg_score}%</div>
                </div>
              </div>
            ) : <div className="text-sm text-gray-500">Loading...</div>}
          </div>

          <ChatbotPanel />
        </div>
      </main>
      <footer className="py-8 text-center text-xs text-gray-500">Made with reverence • Learn, pronounce, reflect</footer>
    </div>
  )
}

export default App
