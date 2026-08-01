import { useEffect, useState } from 'react'

function speak(text, onEnd) {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.rate = 0.8
  utterance.pitch = 1.05
  utterance.onend = onEnd
  utterance.onerror = onEnd
  window.speechSynthesis.speak(utterance)
}

export default function StoryReader({ story, onBack }) {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [showParentNote, setShowParentNote] = useState(false)
  const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window

  useEffect(() => {
    return () => {
      if (canSpeak) window.speechSynthesis.cancel()
    }
  }, [canSpeak])

  const handleReadAloud = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }
    setIsSpeaking(true)
    speak(story.lines.join('. '), () => setIsSpeaking(false))
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b ${story.color}`}>
      <div className="mx-auto max-w-2xl px-6 py-8">
        <button
          type="button"
          onClick={onBack}
          className="rounded-full bg-white/80 px-4 py-2 text-sm font-bold text-purple-800 shadow hover:bg-white"
        >
          ← Back to stories
        </button>

        <div className="mt-6 rounded-3xl bg-white/90 p-6 shadow-xl sm:p-10">
          <div className="text-center text-6xl">{story.emoji}</div>
          <h1 className="mt-2 text-center text-3xl font-extrabold text-purple-900">
            {story.title}
          </h1>

          {canSpeak && (
            <div className="mt-5 flex justify-center">
              <button
                type="button"
                onClick={handleReadAloud}
                className="rounded-full bg-purple-600 px-6 py-3 text-lg font-bold text-white shadow-lg transition hover:bg-purple-700 active:scale-95"
              >
                {isSpeaking ? '⏹ Stop' : '🔊 Read to me'}
              </button>
            </div>
          )}

          <div className="mt-8 space-y-4">
            {story.lines.map((line) => (
              <p
                key={line}
                className="text-center text-xl leading-relaxed text-gray-800 sm:text-2xl"
              >
                {line}
              </p>
            ))}
          </div>

          <div className="mt-8 rounded-2xl bg-amber-100 p-5 text-center">
            <p className="text-sm font-bold uppercase tracking-wide text-amber-700">
              What does it mean?
            </p>
            <p className="mt-2 text-lg font-semibold text-amber-900">
              {story.meaning}
            </p>
          </div>

          <div className="mt-4">
            <button
              type="button"
              onClick={() => setShowParentNote((v) => !v)}
              className="w-full rounded-2xl border-2 border-dashed border-purple-300 p-4 text-left text-sm font-bold text-purple-700 hover:bg-purple-50"
            >
              {showParentNote ? '▲ Hide' : '▼ Show'} notes for parents
            </button>
            {showParentNote && (
              <p className="mt-3 rounded-2xl bg-purple-50 p-4 text-sm leading-relaxed text-purple-800">
                {story.parentNote}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
