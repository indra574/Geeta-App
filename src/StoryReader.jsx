import { useEffect, useRef, useState } from 'react'
import IllustrationBadge from './IllustrationBadge.jsx'

function getVoices() {
  return new Promise((resolve) => {
    const existing = window.speechSynthesis.getVoices()
    if (existing.length) {
      resolve(existing)
      return
    }
    window.speechSynthesis.onvoiceschanged = () => {
      resolve(window.speechSynthesis.getVoices())
    }
  })
}

// Prefer an Indian-accented voice when the browser/OS exposes one.
// Availability varies by device — Chrome on Android/desktop and Edge on
// Windows commonly ship an en-IN voice, Safari/iOS often does not.
function pickIndianVoice(voices) {
  return (
    voices.find((v) => v.lang === 'en-IN') ||
    voices.find((v) => v.lang === 'hi-IN') ||
    voices.find((v) => /india/i.test(v.name)) ||
    voices.find((v) => v.lang?.startsWith('en')) ||
    voices[0] ||
    null
  )
}

function speakSequence(texts, voice, onEnd) {
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
    if (voice) utterance.voice = voice
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
  const voiceRef = useRef(null)

  useEffect(() => {
    if (!canSpeak) return
    getVoices().then((voices) => {
      voiceRef.current = pickIndianVoice(voices)
    })
    return () => {
      window.speechSynthesis.cancel()
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
      voiceRef.current,
      () => setIsSpeaking(false),
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-orange-50 via-amber-50 to-sky-50">
      <div
        className="pointer-events-none absolute -top-16 -right-16 h-64 w-64 rounded-full bg-purple-200/50 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 -left-16 h-64 w-64 rounded-full bg-sky-200/50 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-2xl px-6 py-8">
        <button
          type="button"
          onClick={onBack}
          className="rounded-full bg-white/90 px-4 py-2 text-sm font-bold text-purple-800 shadow hover:bg-white"
        >
          ← Back to verses
        </button>

        <div className="mt-6 rounded-[2.5rem] bg-white/90 p-6 shadow-xl shadow-purple-900/10 sm:p-10">
          <div className="flex justify-center">
            <IllustrationBadge emoji={story.emoji} color={story.color} size="lg" />
          </div>
          <h1 className="mt-4 text-center text-3xl font-bold text-purple-900">
            {story.title}
          </h1>
          <p className="mt-1 text-center text-sm font-bold text-purple-500">
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

          <section className="mt-8 rounded-3xl bg-orange-50 p-5 text-center">
            <p className="text-xs font-bold tracking-wide text-orange-600 uppercase">
              Original Sanskrit Shlok
            </p>
            <p className="font-devanagari mt-3 text-2xl leading-relaxed text-orange-900 sm:text-3xl">
              {story.sanskrit}
            </p>
          </section>

          <section className="mt-4 rounded-3xl bg-blue-50 p-5 text-center">
            <p className="text-xs font-bold tracking-wide text-blue-600 uppercase">
              Shlok in English
            </p>
            <p className="mt-3 text-lg leading-relaxed text-blue-900 italic">
              {story.transliteration}
            </p>
          </section>

          <section className="mt-4 rounded-3xl bg-amber-100 p-5 text-center">
            <p className="text-xs font-bold tracking-wide text-amber-700 uppercase">
              Simple Meaning
            </p>
            <p className="mt-3 text-lg font-semibold leading-relaxed text-amber-900">
              {story.simpleMeaning}
            </p>
          </section>

          <section className="mt-4 rounded-3xl bg-rose-100 p-5 text-center">
            <p className="text-xs font-bold tracking-wide text-rose-600 uppercase">
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
