import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL

export default function ChapterNavigator({ onSelectVerse, onDaily }) {
  const [chapters, setChapters] = useState([])
  const [selected, setSelected] = useState(1)
  const [verses, setVerses] = useState([])

  useEffect(() => {
    fetch(`${API}/api/chapters`).then(r => r.json()).then(d => setChapters(d.chapters || []))
  }, [])

  useEffect(() => {
    if (!selected) return
    fetch(`${API}/api/verses?chapter=${selected}`).then(r => r.json()).then(d => setVerses(d.verses || []))
  }, [selected])

  return (
    <div className="bg-white/70 dark:bg-gray-900/60 backdrop-blur rounded-xl border border-black/5 dark:border-white/10 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold">Chapters</h2>
        <button onClick={onDaily} className="text-emerald-700 dark:text-emerald-400 text-sm hover:underline">Daily verse</button>
      </div>
      <div className="grid grid-cols-6 gap-2">
        {chapters.map(ch => (
          <button
            key={ch.number}
            onClick={() => setSelected(ch.number)}
            className={`text-sm px-2 py-1 rounded-md border ${selected === ch.number ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-gray-50 dark:bg-gray-800 border-black/10 dark:border-white/10'}`}
          >
            {ch.number}
          </button>
        ))}
      </div>
      <div className="mt-4 max-h-56 overflow-auto pr-2">
        {verses.length === 0 && (
          <div className="text-xs text-gray-500">No verses in this demo chapter.</div>
        )}
        {verses.map(v => (
          <div key={v.id} className="py-2 border-b border-black/5 dark:border-white/10">
            <div className="text-[15px] font-medium">{v.devanagari}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">{v.transliteration}</div>
            <div className="mt-1">
              <button
                onClick={() => onSelectVerse({ chapter: selected, verse: v })}
                className="text-xs text-emerald-700 dark:text-emerald-400 hover:underline"
              >
                Learn this verse
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
