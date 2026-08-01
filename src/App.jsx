import { useState } from 'react'
import { stories } from './data/stories.js'
import StoryReader from './StoryReader.jsx'

function App() {
  const [selectedId, setSelectedId] = useState(null)
  const selected = stories.find((s) => s.id === selectedId) ?? null

  if (selected) {
    return <StoryReader story={selected} onBack={() => setSelectedId(null)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-100 via-amber-50 to-sky-100">
      <header className="px-6 pt-10 pb-6 text-center">
        <div className="text-6xl">🪷</div>
        <h1 className="mt-2 text-4xl font-extrabold text-purple-900 sm:text-5xl">
          Geeta for Little Ones
        </h1>
        <p className="mx-auto mt-3 max-w-md text-lg text-purple-700">
          Sit together and read these gentle Bhagavad Gita stories out loud to
          your little one.
        </p>
      </header>

      <main className="mx-auto grid max-w-4xl grid-cols-1 gap-5 px-6 pb-16 sm:grid-cols-2">
        {stories.map((story) => (
          <button
            key={story.id}
            type="button"
            onClick={() => setSelectedId(story.id)}
            className={`flex items-center gap-4 rounded-3xl bg-gradient-to-br ${story.color} p-5 text-left shadow-lg shadow-black/5 transition hover:-translate-y-1 hover:shadow-xl active:translate-y-0 active:scale-95`}
          >
            <span className="text-5xl drop-shadow-sm">{story.emoji}</span>
            <span className="flex flex-col">
              <span className="text-xl font-bold text-white drop-shadow-sm">
                {story.title}
              </span>
              <span className="text-xs font-semibold text-white/80">
                {story.reference}
              </span>
            </span>
          </button>
        ))}
      </main>

      <footer className="pb-8 text-center text-sm text-purple-400">
        Made with love, for tiny hearts and big stories. 💛
      </footer>
    </div>
  )
}

export default App
