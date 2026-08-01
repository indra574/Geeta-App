import { useEffect, useState } from 'react'

function speakSequence(texts, onEnd) {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  let index = 0
  const speakNext = () => {
    if (index >= texts.length) {
      onEnd()
      return
    }
    const utterance = new SpeechSynthesisUtterance(texts[index])
    utterance.rate = 0.8
    utterance.pitch = 1.05
    utterance.onend = () => {
      index += 1
      speakNext()
    }
    utterance.onerror = onEnd
    window.speechSynthesis.speak(utterance)
  }
  speakNext()
}

export default function StoryReader({ story, onBack }) {
  const [isSpeaking, setIsSpeaking] = useState(false)
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
    speakSequence(
      [story.transliteration, story.simpleMeaning, story.mothersWhisper],
      () => setIsSpeaking(false),
    )
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
          <p className="mt-1 text-center text-sm font-semibold text-purple-500">
            {story.reference}
          </p>

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

          <section className="mt-8 rounded-2xl bg-orange-50 p-5 text-center">
            <p className="text-xs font-bold uppercase tracking-wide text-orange-600">
              Original Sanskrit Shlok
            </p>
            <p className="font-devanagari mt-3 text-2xl leading-relaxed text-orange-900 sm:text-3xl">
              {story.sanskrit}
            </p>
          </section>

          <section className="mt-4 rounded-2xl bg-blue-50 p-5 text-center">
            <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
              Shlok in English
            </p>
            <p className="mt-3 text-lg leading-relaxed italic text-blue-900">
              {story.transliteration}
            </p>
          </section>

          <section className="mt-4 rounded-2xl bg-amber-100 p-5 text-center">
            <p className="text-xs font-bold uppercase tracking-wide text-amber-700">
              Simple Meaning
            </p>
            <p className="mt-3 text-lg font-semibold leading-relaxed text-amber-900">
              {story.simpleMeaning}
            </p>
          </section>

          <section className="mt-4 rounded-2xl bg-rose-100 p-5 text-center">
            <p className="text-xs font-bold uppercase tracking-wide text-rose-600">
              🤫 Mother's Whisper
            </p>
            <p className="mt-3 text-xl font-semibold leading-relaxed text-rose-900">
              "{story.mothersWhisper}"
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
