import { useState } from 'react'
import { Send } from 'lucide-react'

const API = import.meta.env.VITE_BACKEND_URL

export default function ChatbotPanel() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])

  const ask = async () => {
    if (!input.trim()) return
    const user = { role: 'user', text: input }
    setMessages(m => [...m, user])
    setInput('')
    const res = await fetch(`${API}/api/chatbot`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: user.text }) })
    const data = await res.json()
    const bot = { role: 'bot', text: data.reply, verses: data.verses }
    setMessages(m => [...m, bot])
  }

  return (
    <div className="bg-white/70 dark:bg-gray-900/60 backdrop-blur rounded-xl border border-black/5 dark:border-white/10 p-4 flex flex-col h-full">
      <h3 className="font-semibold mb-2">Gita Companion</h3>
      <div className="flex-1 overflow-auto space-y-3 pr-2">
        {messages.length === 0 && <div className="text-sm text-gray-500">Ask about duty, anxiety, attachment, purpose...</div>}
        {messages.map((m, idx) => (
          <div key={idx} className={m.role === 'user' ? 'text-right' : ''}>
            <div className={`inline-block px-3 py-2 rounded-lg ${m.role === 'user' ? 'bg-emerald-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}>
              <div className="text-sm whitespace-pre-wrap">{m.text}</div>
            </div>
            {m.verses && (
              <div className="mt-2 space-y-2">
                {m.verses.map((v, i) => (
                  <div key={i} className="text-xs border border-black/5 dark:border-white/10 rounded-lg p-2">
                    <div className="font-medium">{v.id} • Chapter {v.chapter}</div>
                    <div className="text-[13px] mt-1">{v.devanagari}</div>
                    <div className="text-[12px] text-gray-600 dark:text-gray-400 mt-1">{v.transliteration}</div>
                    <div className="text-[12px] mt-1">EN: {v.translations?.en}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Share your situation..." className="flex-1 px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-800 outline-none" />
        <button onClick={ask} className="px-3 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-2"><Send size={16}/> Ask</button>
      </div>
    </div>
  )
}
