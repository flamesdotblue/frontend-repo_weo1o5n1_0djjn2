import { useEffect, useMemo, useRef, useState } from 'react'
import { Play, Pause, RotateCcw, Repeat, GaugeCircle } from 'lucide-react'

const API = import.meta.env.VITE_BACKEND_URL

function useSpeechSynthesis() {
  const synthRef = useRef(window.speechSynthesis)
  const speak = (text, rate = 1.0, onend) => {
    if (!synthRef.current) return
    const u = new SpeechSynthesisUtterance(text)
    u.rate = rate
    u.lang = 'sa-IN' // Sanskrit; browsers may fallback
    u.onend = onend
    synthRef.current.cancel()
    synthRef.current.speak(u)
  }
  const cancel = () => synthRef.current && synthRef.current.cancel()
  return { speak, cancel }
}

export default function VerseLearning({ selected }) {
  const [rate, setRate] = useState(0.9)
  const [loop, setLoop] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [score, setScore] = useState(null)
  const [diffs, setDiffs] = useState([])
  const [phraseIndex, setPhraseIndex] = useState(0)
  const { speak, cancel } = useSpeechSynthesis()

  const phrases = useMemo(() => {
    if (!selected) return []
    // split by | or comma for phrase-by-phrase
    return selected.verse.transliteration.split(/\||,|\./).map(s => s.trim()).filter(Boolean)
  }, [selected])

  useEffect(() => { setPhraseIndex(0); setScore(null); setDiffs([]) }, [selected])

  const playText = (text) => {
    setPlaying(true)
    speak(text, rate, () => {
      setPlaying(false)
      if (loop) setTimeout(() => playText(text), 400)
    })
  }

  const stop = () => { setPlaying(false); cancel() }

  const evaluate = async (recognized) => {
    if (!selected) return
    const res = await fetch(`${API}/api/evaluate_pronunciation`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target_text: phrases[phraseIndex] || selected.verse.transliteration, recognized_text: recognized })
    })
    const data = await res.json()
    setScore(data.score)
    setDiffs(data.differences || [])
  }

  // Web Speech Recognition (webkit)
  const recRef = useRef(null)
  const [recActive, setRecActive] = useState(false)

  const startRec = () => {
    const WSR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!WSR) { alert('Speech recognition not supported in this browser.'); return }
    const rec = new WSR()
    rec.lang = 'sa-IN'
    rec.continuous = true
    rec.interimResults = true
    rec.onresult = (e) => {
      const t = Array.from(e.results).map(r => r[0].transcript).join(' ')
      evaluate(t)
    }
    rec.onend = () => setRecActive(false)
    rec.start()
    recRef.current = rec
    setRecActive(true)
  }
  const stopRec = () => { if (recRef.current) recRef.current.stop(); setRecActive(false) }

  const renderHighlighted = (text) => {
    if (!diffs.length) return text
    let out = []
    let cursor = 0
    diffs.forEach((d, idx) => {
      if (cursor < d.start) out.push(<span key={`ok-${idx}`}>{text.slice(cursor, d.start)}</span>)
      out.push(<mark key={`bad-${idx}`} className="bg-rose-200/60 dark:bg-rose-400/30 rounded px-0.5">{text.slice(d.start, d.end)}</mark>)
      cursor = d.end
    })
    if (cursor < text.length) out.push(<span key="tail">{text.slice(cursor)}</span>)
    return out
  }

  if (!selected) return (
    <div className="text-sm text-gray-600 dark:text-gray-400">Select a verse to begin learning.</div>
  )

  return (
    <div className="bg-white/70 dark:bg-gray-900/60 backdrop-blur rounded-xl border border-black/5 dark:border-white/10 p-4 space-y-4">
      <div>
        <div className="text-lg font-semibold">Chapter {selected.chapter} • {selected.verse.id}</div>
        <div className="text-2xl leading-relaxed font-medium mt-2">{selected.verse.devanagari}</div>
        <div className="text-sm text-gray-700 dark:text-gray-300 mt-2">
          {renderHighlighted(selected.verse.transliteration)}
        </div>
        <div className="text-xs text-gray-500 mt-1">EN: {selected.verse.translations?.en}</div>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={() => playText(selected.verse.transliteration)} className="px-3 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-2">
          {playing ? <Pause size={16} /> : <Play size={16} />} {playing ? 'Pause' : 'Play'}
        </button>
        <button onClick={() => setLoop(!loop)} className={`px-3 py-2 rounded-md border ${loop ? 'border-emerald-600 text-emerald-700' : 'border-black/10 dark:border-white/10'}`}>
          <Repeat size={16} className="inline mr-1"/> Loop
        </button>
        <div className="flex items-center gap-2 ml-2 text-sm">
          <GaugeCircle size={16} /> Speed
          <input type="range" min="0.6" max="1.4" step="0.05" value={rate}
            onChange={(e) => setRate(parseFloat(e.target.value))} />
          <span className="w-8 text-right">{rate.toFixed(2)}x</span>
        </div>
        <button onClick={() => setPhraseIndex(i => (i + 1) % Math.max(1, phrases.length))} className="ml-auto text-sm px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700">
          Next phrase
        </button>
        <button onClick={() => setPhraseIndex(0)} className="text-sm px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700">
          <RotateCcw size={14} className="inline mr-1"/> Reset phrase
        </button>
      </div>

      <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-sm flex items-center justify-between">
        <div>
          <div className="font-medium">Phrase-by-phrase</div>
          <div className="text-gray-700 dark:text-gray-300">{phrases[phraseIndex] || selected.verse.transliteration}</div>
        </div>
        <div className="flex items-center gap-2">
          {!recActive ? (
            <button onClick={startRec} className="px-3 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700">Start mic</button>
          ) : (
            <button onClick={stopRec} className="px-3 py-2 rounded-md bg-rose-600 text-white hover:bg-rose-700">Stop mic</button>
          )}
          <div className="text-right">
            <div className="text-xs text-gray-500">Pronunciation score</div>
            <div className="text-lg font-semibold">{score !== null ? `${score}%` : '-'}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
