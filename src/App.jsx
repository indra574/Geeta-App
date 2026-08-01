import { useState } from 'react'
import { stories } from './data/stories.js'
import IllustrationBadge from './IllustrationBadge.jsx'
import StoryReader from './StoryReader.jsx'

function App() {
  const [selectedId, setSelectedId] = useState(null)
  const selectedIndex = stories.findIndex((s) => s.id === selectedId)
  const selected = selectedIndex >= 0 ? stories[selectedIndex] : null

  if (selected) {
    const nextStory = stories[(selectedIndex + 1) % stories.length]
    return (
      <StoryReader
        key={selected.id}
        story={selected}
        onBack={() => setSelectedId(null)}
        onNext={() => setSelectedId(nextStory.id)}
      />
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-orange-50 via-amber-50 to-sky-50">
      <div
        className="pointer-events-none absolute -top-16 -left-16 h-64 w-64 rounded-full bg-orange-200/50 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-40 -right-20 h-72 w-72 rounded-full bg-purple-200/50 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-sky-200/50 blur-3xl"
        aria-hidden="true"
      />

      <header className="relative px-6 pt-10 pb-6 text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[40%_60%_55%_45%/55%_45%_55%_45%] bg-gradient-to-br from-purple-400 to-fuchsia-500 text-5xl shadow-xl shadow-purple-500/20">
          🦚
        </div>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-purple-900 sm:text-5xl">
          Gita for Little Ones
        </h1>
        <p className="mx-auto mt-3 max-w-md text-lg font-medium text-purple-700">
          Sit together and read these gentle Bhagavad Gita verses out loud to
          your little one.
        </p>
      </header>

      <main className="relative mx-auto grid max-w-4xl grid-cols-2 gap-4 px-5 pb-16 sm:grid-cols-3 sm:gap-5 sm:px-6">
        {stories.map((story, index) => (
          <button
            key={story.id}
            type="button"
            onClick={() => setSelectedId(story.id)}
            className="group flex flex-col items-center gap-3 rounded-[2rem] bg-white/90 p-4 shadow-[0_10px_25px_-10px_rgba(88,28,135,0.25)] transition hover:-translate-y-1 hover:shadow-[0_18px_35px_-12px_rgba(88,28,135,0.35)] active:scale-95 sm:p-5"
          >
            <IllustrationBadge emoji={story.emoji} color={story.color} index={index} />
            <span className="text-center text-base font-semibold leading-tight text-slate-800 sm:text-lg">
              {story.title}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-500">
              {story.reference}
            </span>
          </button>
        ))}
      </main>

      <footer className="relative pb-8 text-center text-sm font-medium text-purple-400">
        Made with love, for tiny hearts and big stories. 💛
      </footer>
    </div>
  )
}

export default App
