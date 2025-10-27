import { useMemo } from 'react';

const SAMPLE_DATA = [
  {
    id: 1,
    name: 'Chapter 1 – Arjuna’s Dilemma',
    verses: [
      {
        id: 1,
        sa: 'धृतराष्ट्र उवाच | धर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः |',
        en: 'Dhritarashtra said: At Kurukshetra, the field of Dharma, assembled for battle...',
        tr: 'dhṛtarāśtra uvāca | dharmakṣetre kurukṣetre samavetā yuyutsavaḥ |',
      },
      {
        id: 2,
        sa: 'पश्यैतां पाण्डुपुत्राणामाचार्य महतीं चमूम् |',
        en: 'Behold, O teacher, this mighty army of the sons of Pandu...',
        tr: 'paśyaitāṁ pāṇḍu-putrāṇām ācārya mahatīṁ camūm |',
      },
    ],
  },
  {
    id: 2,
    name: 'Chapter 2 – The Yoga of Knowledge',
    verses: [
      {
        id: 11,
        sa: 'अशोच्यानन्वशोचस्त्वं प्रज्ञावादांश्च भाषसे |',
        en: 'You grieve for those who should not be grieved for, yet speak words of wisdom...',
        tr: 'aśocyān anvaśocas tvaṁ prajñā-vādāṁś ca bhāṣase |',
      },
      {
        id: 13,
        sa: 'देहिनोऽस्मिन्यथा देहे कौमारं यौवनं जरा |',
        en: 'Just as the embodied soul continuously passes in this body, from boyhood to youth to old age...',
        tr: 'dehino ’smin yathā dehe kaumāraṁ yauvanaṁ jarā |',
      },
    ],
  },
  {
    id: 3,
    name: 'Chapter 3 – The Yoga of Action',
    verses: [
      {
        id: 8,
        sa: 'नियतं कुरु कर्म त्वं कर्म ज्यायो ह्यकर्मणः |',
        en: 'Perform your prescribed duty, for doing so is better than not working...',
        tr: 'niyataṁ kuru karma tvaṁ karma jyāyo hy akarmaṇaḥ |',
      },
    ],
  },
];

export default function ChapterNavigator({ query, current, onPick }) {
  const filtered = useMemo(() => {
    const q = (query || '').toLowerCase();
    if (!q) return SAMPLE_DATA;
    return SAMPLE_DATA.map((c) => ({
      ...c,
      verses: c.verses.filter(
        (v) => v.sa.toLowerCase().includes(q) || v.tr.toLowerCase().includes(q) || v.en.toLowerCase().includes(q)
      ),
    })).filter((c) => c.verses.length > 0);
  }, [query]);

  return (
    <div className="space-y-4">
      {filtered.map((chapter) => (
        <div key={chapter.id} className="rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 overflow-hidden">
          <div className="px-4 py-3 text-sm font-medium bg-black/5 dark:bg-white/5 text-black dark:text-white">
            {chapter.name}
          </div>
          <ul className="divide-y divide-black/5 dark:divide-white/10">
            {chapter.verses.map((v) => {
              const isActive = current && current.chapterId === chapter.id && current.verseId === v.id;
              return (
                <li key={v.id}>
                  <button
                    onClick={() => onPick({ chapterId: chapter.id, verseId: v.id, verse: v, chapter })}
                    className={`w-full text-left px-4 py-3 hover:bg-emerald-100/50 dark:hover:bg-emerald-900/20 transition ${
                      isActive ? 'bg-emerald-100/60 dark:bg-emerald-900/30' : ''
                    }`}
                  >
                    <div className="text-[13px] text-emerald-700 dark:text-emerald-300 mb-1">{`Chapter ${chapter.id}, Verse ${v.id}`}</div>
                    <div className="text-sm text-black dark:text-white line-clamp-2">{v.tr}</div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
