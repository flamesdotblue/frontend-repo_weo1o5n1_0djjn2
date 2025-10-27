import { useState } from 'react';
import { Send, MessageSquareHeart } from 'lucide-react';

const HINTS = [
  'How do I stay calm under pressure?',
  'What does karma really mean?',
  'How to choose duty over doubt?'
];

function botReply(text) {
  const t = text.toLowerCase();
  if (t.includes('calm') || t.includes('fear')) {
    return {
      verse: 'BG 2.48',
      quote: 'yoga-sthaḥ kuru karmāṇi — Be steadfast in yoga; perform your duty without attachment to success or failure.'
    };
  }
  if (t.includes('karma') || t.includes('action')) {
    return {
      verse: 'BG 3.8',
      quote: 'niyataṁ kuru karma tvaṁ — Perform prescribed duty; action is superior to inaction.'
    };
  }
  return {
    verse: 'BG 2.13',
    quote: 'As the embodied soul passes from boyhood to youth to old age, the soul similarly passes into another body at death.'
  };
}

export default function ChatbotPanel() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'I am your Gita companion. Ask anything, and I will respond with gentle guidance and a related verse.' }
  ]);
  const [input, setInput] = useState('');

  const onSend = () => {
    const text = input.trim();
    if (!text) return;
    const userMsg = { role: 'user', content: text };
    const reply = botReply(text);
    const botMsg = { role: 'assistant', content: `${reply.quote} (${reply.verse})` };
    setMessages((m) => [...m, userMsg, botMsg]);
    setInput('');
  };

  return (
    <div className="h-full rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 flex flex-col overflow-hidden">
      <div className="px-4 py-3 border-b border-black/10 dark:border-white/10 flex items-center gap-2">
        <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300">
          <MessageSquareHeart className="w-4 h-4" />
        </div>
        <div className="text-sm font-medium text-black dark:text-white">Gita Companion</div>
      </div>
      <div className="flex-1 p-4 space-y-3 overflow-auto">
        {messages.map((m, idx) => (
          <div key={idx} className={`max-w-[85%] px-3 py-2 rounded-lg ${
            m.role === 'assistant' ? 'bg-violet-100/70 dark:bg-violet-900/30 text-violet-950 dark:text-violet-100 self-start' : 'bg-emerald-100/70 dark:bg-emerald-900/30 text-emerald-950 dark:text-emerald-100 self-end ml-auto'
          }`}>
            {m.content}
          </div>
        ))}
      </div>
      <div className="p-3 border-t border-black/10 dark:border-white/10">
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSend()}
            placeholder={`Try: ${HINTS[Math.floor(Math.random() * HINTS.length)]}`}
            className="flex-1 px-3 py-2 rounded-lg bg-white/70 dark:bg-white/5 border border-black/10 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400/60 text-black dark:text-white"
          />
          <button onClick={onSend} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-500">
            <Send className="w-4 h-4" /> Send
          </button>
        </div>
      </div>
    </div>
  );
}
