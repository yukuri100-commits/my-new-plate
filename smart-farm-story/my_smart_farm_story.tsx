import React, { useMemo, useState } from 'react';

type FarmData = {
  person: string; crop: string; animals: string; tech: string;
  fruit: string; tech2: string; adjective: string; ending: string;
};

const defaults: FarmData = {
  person: 'grandma', crop: 'rice', animals: 'ducks', tech: 'smartphone',
  fruit: 'watermelons', tech2: 'drones', adjective: 'organic',
  ending: 'healthy and good for the earth',
};

const chips: Record<keyof FarmData, string[]> = {
  person: ['grandma', 'grandpa', 'uncle', 'aunt'], crop: ['rice', 'corn', 'lettuce', 'tomatoes'],
  animals: ['ducks', 'chickens', 'bees', 'cows'], tech: ['smartphone', 'tablet', 'camera'],
  fruit: ['watermelons', 'pumpkins', 'apples', 'tomatoes'], tech2: ['drones', 'robots', 'sensors'],
  adjective: ['organic', 'fresh', 'yummy', 'natural'],
  ending: ['healthy and good for the earth', 'fresh and super yummy', 'kind to animals and nature'],
};

export default function App() {
  const [data, setData] = useState<FarmData>(defaults);
  const [page, setPage] = useState<'build' | 'farm'>('build');
  const [duckFood, setDuckFood] = useState(0);
  const [target] = useState(() => 6 + Math.floor(Math.random() * 5));
  const [found, setFound] = useState<number[]>([]);
  const [farmChoice, setFarmChoice] = useState('');
  const [basket, setBasket] = useState<string[]>([]);
  const [question, setQuestion] = useState('');
  const [message, setMessage] = useState('');

  const pronoun = /grandpa|uncle|dad|brother/i.test(data.person) ? 'He' : 'She';
  const possessive = pronoun === 'He' ? 'his' : 'her';
  const story = useMemo(() => `This is my ${data.person}. ${pronoun} grows the best ${data.crop} in town. Look at these happy ${data.animals}! Because of their hard work, we can eat healthy ${data.crop} every day.\n\nMy ${data.person} knows everything on the farm with ${possessive} ${data.tech}. Do you know how many ${data.fruit} there are? ${data.tech2} can count them in a short time.\n\nToday we choose something ${data.adjective}. It is ${data.ending}.`, [data, pronoun, possessive]);
  const update = (key: keyof FarmData, value: string) => setData(old => ({ ...old, [key]: value }));
  const speak = () => {
    window.speechSynthesis?.cancel();
    const voice = new SpeechSynthesisUtterance(story);
    voice.lang = 'en-US'; voice.rate = .88;
    window.speechSynthesis?.speak(voice);
  };
  const watermelon = (id: number) => {
    if (found.includes(id) || found.length >= target) return;
    setFound(old => [...old, id]);
  };
  const addBasket = (item: string) => setBasket(old => old.includes(item) ? old.filter(x => x !== item) : [...old, item]);
  const copyReport = async () => {
    const report = `MY SMART FARM REPORT\n\n${story}\n\nDuck care: ${duckFood} snack(s) shared.\nDrone count: ${found.length}/${target} watermelons found.\nAnimal-friendly choice: ${farmChoice || 'Not chosen'}.\nOrganic basket: ${basket.join(', ') || 'Empty'}.\nMy question: ${question || 'Not written'}.`;
    try { await navigator.clipboard.writeText(report); setMessage('Your learning report is copied!'); }
    catch { setMessage('Please allow clipboard access, then try again.'); }
  };

  return <main className="min-h-screen bg-[#eaf8ff] p-4 sm:p-8 text-slate-800">
    <style>{`
      @keyframes float { 50% { transform: translateY(-9px) rotate(2deg); } }
      @keyframes wiggle { 25% { transform: rotate(-5deg) } 75% { transform:rotate(5deg) } }
      .float { animation: float 3s ease-in-out infinite; } .wiggle:hover { animation: wiggle .35s ease-in-out; }
      .field { background:linear-gradient(135deg,#7ecb4f,#c8ee69 46%,#73bd48); }
      .watermelon { filter:drop-shadow(0 3px 2px #4b7a2b80); transition:.2s; } .watermelon:hover { transform:scale(1.18) rotate(-8deg); }
    `}</style>
    <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border-4 border-white bg-white shadow-2xl">
      <header className="relative overflow-hidden bg-gradient-to-r from-[#159447] via-[#55be55] to-[#a9dd64] px-6 py-7 text-white">
        <span className="absolute right-8 top-2 text-7xl opacity-25">☀</span>
        <p className="mb-1 font-bold tracking-[.2em] text-green-100">READ · PLAY · CREATE</p>
        <h1 className="text-3xl font-black sm:text-5xl">🌾 My Smart Farm Story</h1>
        <p className="mt-2 text-lg text-green-50">Learn English with a kind, clever farm!</p>
      </header>

      <nav className="flex gap-2 border-b bg-amber-50 p-3">
        <button onClick={() => setPage('build')} className={`rounded-full px-5 py-2 font-bold ${page === 'build' ? 'bg-amber-400 text-amber-950' : 'text-slate-500'}`}>1. Build my story</button>
        <button onClick={() => setPage('farm')} className={`rounded-full px-5 py-2 font-bold ${page === 'farm' ? 'bg-green-600 text-white' : 'text-slate-500'}`}>2. Explore the farm</button>
      </nav>

      {page === 'build' ? <section className="p-5 sm:p-8">
        <div className="mb-6 rounded-2xl border-l-8 border-sky-400 bg-sky-50 p-4 text-sky-900"><b>Before you read:</b> Choose words to create your own farm story, then enter the farm to play the picture activities.</div>
        <div className="grid gap-4 md:grid-cols-2">
          {(Object.keys(data) as (keyof FarmData)[]).map((key, index) => <div key={key} className="rounded-2xl border border-green-100 bg-green-50 p-4">
            <label className="block font-extrabold capitalize text-green-900">{index + 1}. {key === 'tech2' ? 'Modern machine' : key === 'fruit' ? 'Food to count' : key}</label>
            <input value={data[key]} onChange={e => update(key, e.target.value)} className="mt-2 w-full rounded-xl border-2 border-green-200 bg-white p-3 text-lg outline-none focus:border-green-500" />
            <div className="mt-2 flex flex-wrap gap-2">{chips[key].map(word => <button key={word} onClick={() => update(key, word)} className="rounded-full border border-green-300 bg-white px-3 py-1 text-sm hover:bg-green-200">{word}</button>)}</div>
          </div>)}
        </div>
        <div className="mt-7 rounded-3xl border-2 border-dashed border-amber-300 bg-[#fffdf4] p-6">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3"><h2 className="text-2xl font-black text-amber-800">📖 My farm story</h2><button onClick={speak} className="rounded-full bg-purple-600 px-5 py-2 font-bold text-white hover:bg-purple-700">🔊 Listen</button></div>
          <p className="whitespace-pre-line text-lg leading-8">{story}</p>
        </div>
        <div className="mt-6 text-center"><button onClick={() => setPage('farm')} className="rounded-full bg-green-600 px-8 py-4 text-xl font-black text-white shadow-lg transition hover:scale-105 hover:bg-green-700">Enter my smart farm →</button></div>
      </section> : <section className="space-y-6 p-5 sm:p-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <article className="overflow-hidden rounded-3xl border-4 border-sky-100 bg-sky-100">
            <div className="bg-gradient-to-b from-sky-300 to-sky-100 p-5 text-center"><span className="float inline-block text-6xl">🦆</span><h2 className="text-2xl font-black">Happy ducks, healthy rice</h2><p>Tap a rice snack to help the ducks work in the paddy.</p></div>
            <div className="field flex min-h-48 flex-col items-center justify-center p-5"><div className="text-7xl">🌾 🦆 🌾</div><button onClick={() => setDuckFood(x => x + 1)} className="wiggle mt-4 rounded-full bg-amber-300 px-6 py-3 text-lg font-black text-amber-950 shadow">🌾 Give rice snack ({duckFood})</button>{duckFood >= 3 && <p className="mt-3 rounded-full bg-white px-4 py-2 font-bold text-green-700">Wonderful! The ducks are happy!</p>}</div>
          </article>
          <article className="overflow-hidden rounded-3xl border-4 border-sky-100 bg-sky-100">
            <div className="bg-sky-300 p-5 text-center"><span className="float inline-block text-6xl">🚁</span><h2 className="text-2xl font-black">Drone watermelon mission</h2><p>Find {target} watermelons. The drone counts them quickly!</p></div>
            <div className="field relative min-h-48 overflow-hidden p-4">{Array.from({ length: 12 }, (_, i) => <button key={i} onClick={() => watermelon(i)} aria-label="watermelon" className={`watermelon absolute text-4xl ${found.includes(i) ? 'opacity-25 grayscale' : ''}`} style={{ left: `${5 + (i * 29) % 88}%`, top: `${8 + (i * 43) % 68}%` }}>🍉</button>)}<div className="absolute bottom-3 left-3 rounded-full bg-white px-4 py-2 font-black text-green-800">Count: {found.length} / {target}</div>{found.length === target && <div className="absolute inset-0 grid place-items-center bg-green-900/45 text-center text-2xl font-black text-white">Mission complete!<br/>⭐ Great counting! ⭐</div>}</div>
          </article>
        </div>
        <article className="rounded-3xl border-4 border-green-100 bg-gradient-to-br from-lime-100 to-green-50 p-6">
          <h2 className="text-2xl font-black text-green-800">🐔 Animal-Friendly Farm</h2><p className="mt-1">Which choice helps farm animals feel happy?</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">{[['Run in a big field', '✅'], ['Keep them in a tiny cage', '❌'], ['Give clean water and shade', '✅']].map(([choice, mark]) => <button key={choice} onClick={() => setFarmChoice(choice)} className={`rounded-2xl border-2 p-4 font-bold transition ${farmChoice === choice ? (mark === '✅' ? 'border-green-500 bg-green-200' : 'border-rose-400 bg-rose-100') : 'border-white bg-white hover:-translate-y-1'}`}>{mark} {choice}</button>)}</div>
          {farmChoice && <p className="mt-4 font-bold">{farmChoice.includes('tiny') ? 'Try again: animals need space, comfort, and care.' : 'Excellent choice! Happy hens can lay healthy eggs.'}</p>
        </article>
        <article className="rounded-3xl border-4 border-amber-100 bg-amber-50 p-6">
          <h2 className="text-2xl font-black text-amber-800">🛒 Organic market basket</h2><p>Pick food that is fresh and good for people, animals, and the earth.</p>
          <div className="mt-4 flex flex-wrap gap-3">{['🍅 tomatoes', '🥬 lettuce', '🍎 apples', '🥕 carrots'].map(item => <button key={item} onClick={() => addBasket(item)} className={`rounded-full px-4 py-2 font-bold ${basket.includes(item) ? 'bg-green-600 text-white' : 'bg-white text-amber-900 shadow hover:bg-amber-200'}`}>{basket.includes(item) ? '✓ ' : ''}{item}</button>)}</div>
          <p className="mt-4 rounded-xl bg-white p-3">My basket: <b>{basket.length ? basket.join(', ') : 'Choose some organic food!'}</b></p>
        </article>
        <article className="rounded-3xl border-4 border-purple-100 bg-purple-50 p-6"><h2 className="text-2xl font-black text-purple-800">💡 Think like a smart farmer</h2><p>Write a question about the farm. Start with <b>How, Why, What,</b> or <b>Can</b>.</p><div className="mt-4 flex flex-col gap-3 sm:flex-row"><input value={question} onChange={e => setQuestion(e.target.value)} placeholder="How can drones help farmers?" className="min-w-0 flex-1 rounded-xl border-2 border-purple-200 p-3 outline-none focus:border-purple-500" /><button onClick={() => setMessage(question.endsWith('?') ? 'Great question! You are thinking like a smart farmer.' : 'Add a question mark (?) and try again!')} className="rounded-xl bg-purple-600 px-5 py-3 font-bold text-white">Check question</button></div></article>
        <div className="flex flex-wrap justify-center gap-3"><button onClick={copyReport} className="rounded-full bg-slate-800 px-6 py-3 font-bold text-white">📋 Copy learning report</button><button onClick={() => { setDuckFood(0); setFound([]); setFarmChoice(''); setBasket([]); setQuestion(''); setMessage(''); }} className="rounded-full border-2 border-slate-300 px-6 py-3 font-bold">↻ Play again</button></div>
        {message && <p className="rounded-2xl bg-sky-100 p-4 text-center font-bold text-sky-900">{message}</p>}
      </section>}
    </div>
  </main>;
}
