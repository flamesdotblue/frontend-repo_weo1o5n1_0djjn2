import { useEffect, useMemo, useRef, useState } from 'react';
import { Volume2, Pause, Mic, MicOff, RotateCcw } from 'lucide-react';

function similarity(a, b) {
  if (!a && !b) return 1;
  const s1 = (a || '').toLowerCase();
  const s2 = (b || '').toLowerCase();
  const set1 = new Set(s1.split(/\s+/));
  const set2 = new Set(s2.split(/\s+/));
  const inter = [...set1].filter((w) => set2.has(w)).length;
  const union = new Set([...set1, ...set2]).size || 1;
  return inter / union;
}

export default function VerseLearning({ selection }) {
  const [rate, setRate] = useState(0.95);
  const [loop, setLoop] = useState(false);
  const [listening, setListening] = useState(false);
  const [heard, setHeard] = useState('');
  const [score, setScore] = useState(0);
  const [voiceReady, setVoiceReady] = useState(false);
  const [preferredLang, setPreferredLang] = useState('en-IN');
  const recRef = useRef(null);
  const synthRef = useRef(null);
  const voiceRef = useRef(null);

  const verse = selection?.verse;

  const phrases = useMemo(() => {
    if (!verse?.tr) return [];
    // split by bar or comma for phrase-by-phrase practice
    return verse.tr.split(/\s*[|,]\s*/).filter(Boolean);
  }, [verse]);

  // Initialize Speech Synthesis and pick an Indian accent voice if available
  useEffect(() => {
    if (typeof window === 'undefined') return;
    synthRef.current = window.speechSynthesis || null;
    if (!synthRef.current) return;

    const pickVoice = () => {
      const voices = synthRef.current.getVoices?.() || [];
      if (!voices.length) return;
      // Prefer Indian voices/languages
      const byLangPriority = [
        (v) => v.lang?.toLowerCase() === 'en-in',
        (v) => v.lang?.toLowerCase() === 'hi-in',
        (v) => v.lang?.toLowerCase()?.includes('in'),
        (v) => /india|hindi|indian/i.test(v.name || ''),
      ];
      let chosen = null;
      for (const test of byLangPriority) {
        chosen = voices.find(test);
        if (chosen) break;
      }
      if (!chosen) chosen = voices.find((v) => v.lang?.toLowerCase().startsWith('en')) || voices[0] || null;
      voiceRef.current = chosen || null;
      // Set preferred language for recognition based on chosen voice
      const lang = (chosen?.lang || '').toLowerCase();
      setPreferredLang(lang.includes('hi') ? 'hi-IN' : (lang.includes('en') ? 'en-IN' : 'en-IN'));
      setVoiceReady(true);
    };

    // Some browsers need onvoiceschanged to fire before voices are available
    if (synthRef.current.onvoiceschanged !== undefined) {
      synthRef.current.onvoiceschanged = pickVoice;
    }
    // Try immediately as well
    pickVoice();

    return () => {
      if (synthRef.current) synthRef.current.onvoiceschanged = null;
    };
  }, []);

  // Speech Recognition for live feedback (use Indian locale if available)
  useEffect(() => {
    if (!listening) return;
    const SR = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (!SR) return;
    const rec = new SR();
    // Sanskrit recognition has limited support; Hindi/English (India) are more widely available
    rec.lang = preferredLang || 'en-IN';
    rec.continuous = true;
    rec.interimResults = true;
    rec.onresult = (e) => {
      let text = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        const t = res[0]?.transcript || '';
        text = t;
      }
      setHeard(text);
      setScore(Math.round(similarity(text, verse?.tr) * 100));
    };
    rec.onend = () => {
      if (listening) rec.start();
    };
    recRef.current = rec;
    rec.start();
    return () => {
      rec.stop();
    };
  }, [listening, verse, preferredLang]);

  const speak = (text) => {
    if (!synthRef.current) return;
    const u = new SpeechSynthesisUtterance(text);
    const chosen = voiceRef.current;
    if (chosen) {
      u.voice = chosen;
      u.lang = chosen.lang;
    } else {
      // Fallback to Indian English
      u.lang = 'en-IN';
    }
    u.rate = rate;
    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } catch (_) {
      // no-op
    }
  };

  useEffect(() => {
    if (!loop || !verse || !voiceReady) return;
    const id = setInterval(() => {
      speak(verse.tr);
    }, Math.max(2200, 3600 / rate));
    return () => clearInterval(id);
  }, [loop, verse, rate, voiceReady]);

  if (!verse) {
    return (
      <div className="h-full rounded-2xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 flex items-center justify-center text-black/70 dark:text-white/60">
        Select a verse to begin your practice.
      </div>
    );
  }

  return (
    <div className="h-full rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-4 md:p-6 flex flex-col gap-4">
      <div>
        <div className="text-[13px] text-emerald-700 dark:text-emerald-300 mb-1">{`Chapter ${selection.chapterId}, Verse ${selection.verseId}`}</div>
        <div className="text-2xl md:text-3xl leading-snug font-semibold text-black dark:text-white">
          {verse.sa}
        </div>
        <div className="mt-2 text-black/80 dark:text-white/80">{verse.tr}</div>
        <div className="mt-2 text-sm text-black/60 dark:text-white/60">{verse.en}</div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button onClick={() => speak(verse.tr)} disabled={!voiceReady} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-60">
          <Volume2 className="w-4 h-4" /> Play
        </button>
        <button onClick={() => window.speechSynthesis?.cancel()} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-black/10 dark:bg-white/10 text-black dark:text-white">
          <Pause className="w-4 h-4" /> Stop
        </button>
        <label className="ml-2 text-sm text-black/70 dark:text-white/70">Speed
          <input
            type="range"
            min={0.6}
            max={1.4}
            step={0.05}
            value={rate}
            onChange={(e) => setRate(parseFloat(e.target.value))}
            className="ml-2 align-middle"
          />
        </label>
        <button
          onClick={() => setLoop((l) => !l)}
          className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${
            loop ? 'border-emerald-400 text-emerald-700 dark:text-emerald-300' : 'border-black/10 dark:border-white/10 text-black dark:text-white'
          }`}
        >
          <RotateCcw className="w-4 h-4" /> Loop {loop ? 'On' : 'Off'}
        </button>
        <button
          onClick={() => setListening((s) => !s)}
          className={`ml-auto inline-flex items-center gap-2 px-3 py-2 rounded-lg ${
            listening ? 'bg-rose-600 text-white' : 'bg-blue-600 text-white'
          }`}
        >
          {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />} {listening ? 'Stop' : 'Start'} Mic
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-black/10 dark:border-white/10 p-3 bg-white/70 dark:bg-white/5">
          <div className="text-xs text-black/60 dark:text-white/60 mb-1">What you said</div>
          <div className="min-h-[64px] text-black dark:text-white">{heard || '—'}</div>
        </div>
        <div className="rounded-xl border border-black/10 dark:border-white/10 p-3 bg-white/70 dark:bg-white/5">
          <div className="text-xs text-black/60 dark:text-white/60 mb-1">Match score</div>
          <div className="text-2xl font-semibold text-emerald-700 dark:text-emerald-300">{score}%</div>
          <div className="mt-1 h-2 w-full bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500" style={{ width: `${score}%` }} />
          </div>
        </div>
      </div>

      {phrases.length > 1 && (
        <div className="mt-2">
          <div className="text-sm font-medium text-black dark:text-white mb-2">Phrase practice</div>
          <div className="flex flex-wrap gap-2">
            {phrases.map((p, i) => (
              <button key={i} onClick={() => speak(p)} disabled={!voiceReady} className="px-3 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 hover:bg-emerald-100/50 dark:hover:bg-emerald-900/20 disabled:opacity-60">
                {p}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
