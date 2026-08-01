import { useEffect, useMemo, useRef, useState } from 'react'
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

// Prefer a female, Indian-accented voice when the browser/OS exposes one.
// The Web Speech API has no gender field, so we go by known voice names
// (e.g. Heera/Neerja on Windows/Edge, Lekha for Hindi). Availability varies
// a lot by device — Android Chrome and Windows Edge tend to have the best
// selection of en-IN voices, Safari/iOS the least.
const FEMALE_NAME_HINTS = ['heera', 'neerja', 'lekha', 'kalpana', 'veena', 'priya', 'female']
const MALE_NAME_HINTS = ['ravi', 'prabhat', 'rishi', 'hemant', 'male']

function isIndian(voice) {
  return voice.lang === 'en-IN' || voice.lang === 'hi-IN' || /india/i.test(voice.name)
}
function isFemaleNamed(voice) {
  return FEMALE_NAME_HINTS.some((hint) => voice.name.toLowerCase().includes(hint))
}
function isMaleNamed(voice) {
  return MALE_NAME_HINTS.some((hint) => voice.name.toLowerCase().includes(hint))
}

function pickIndianFemaleVoice(voices) {
  return (
    voices.find((v) => isIndian(v) && isFemaleNamed(v)) ||
    voices.find((v) => isIndian(v) && !isMaleNamed(v)) ||
    voices.find((v) => isIndian(v)) ||
    voices.find((v) => isFemaleNamed(v) && v.lang?.startsWith('en')) ||
    voices.find((v) => v.lang?.startsWith('en')) ||
    voices[0] ||
    null
  )
}

function speak(text, voice, onEnd) {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.rate = 0.85
  utterance.pitch = 1.05
  if (voice) utterance.voice = voice
  utterance.onend = onEnd
  utterance.onerror = onEnd
  window.speechSynthesis.speak(utterance)
}

function Paragraphs({ text, className }) {
  return text.split('\n\n').map((para) => (
    <p key={para.slice(0, 24)} className={className}>
      {para}
    </p>
  ))
}

export default function StoryReader({ story, onBack, onNext }) {
  const [stepIndex, setStepIndex] = useState(-1) // -1 intro, 0..N-1 content, N complete
  const [isSpeaking, setIsSpeaking] = useState(false)
  const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window
  const voiceRef = useRef(null)

  const steps = useMemo(
    () => [
      {
        key: 'sanskrit',
        eyebrow: 'Original Sanskrit Shlok',
        readText: story.transliteration,
        bg: 'bg-orange-50',
        label: 'text-orange-600',
        content: (
          <p className="font-devanagari text-center text-2xl leading-relaxed text-orange-900 sm:text-3xl">
            {story.sanskrit}
          </p>
        ),
      },
      {
        key: 'transliteration',
        eyebrow: 'Shlok in English',
        readText: story.transliteration,
        bg: 'bg-blue-50',
        label: 'text-blue-600',
        content: (
          <p className="text-center text-lg leading-relaxed text-blue-900 italic">
            {story.transliteration}
          </p>
        ),
      },
      {
        key: 'meaning',
        eyebrow: 'Simple Meaning',
        readText: story.simpleMeaning,
        bg: 'bg-amber-100',
        label: 'text-amber-700',
        content: (
          <Paragraphs
            text={story.simpleMeaning}
            className="text-left text-lg leading-relaxed font-medium text-amber-900"
          />
        ),
      },
      {
        key: 'story',
        eyebrow: 'A Story to Share',
        readText: story.story,
        bg: 'bg-teal-50',
        label: 'text-teal-700',
        content: (
          <Paragraphs
            text={story.story}
            className="text-left text-lg leading-relaxed text-teal-900"
          />
        ),
      },
      {
        key: 'whisper',
        eyebrow: "🤫 Mother's Whisper",
        readText: story.mothersWhisper,
        bg: 'bg-rose-100',
        label: 'text-rose-600',
        content: (
          <Paragraphs
            text={story.mothersWhisper}
            className="mb-3 text-left text-lg leading-relaxed font-semibold text-rose-900 last:mb-0"
          />
        ),
      },
    ],
    [story],
  )

  const total = steps.length
  const isIntro = stepIndex === -1
  const isComplete = stepIndex === total
  const currentStep = !isIntro && !isComplete ? steps[stepIndex] : null
  const progressPct = isIntro ? 0 : isComplete ? 100 : ((stepIndex + 1) / total) * 100

  useEffect(() => {
    if (!canSpeak) return
    getVoices().then((voices) => {
      voiceRef.current = pickIndianFemaleVoice(voices)
    })
    return () => {
      window.speechSynthesis.cancel()
    }
  }, [canSpeak])

  useEffect(() => {
    setIsSpeaking(false)
    if (canSpeak) window.speechSynthesis.cancel()
  }, [stepIndex, canSpeak])

  const handleReadAloud = () => {
    if (!currentStep) return
    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }
    setIsSpeaking(true)
    speak(currentStep.readText, voiceRef.current, () => setIsSpeaking(false))
  }

  const goNext = () => setStepIndex((i) => Math.min(i + 1, total))
  const goBack = () => setStepIndex((i) => Math.max(i - 1, -1))

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-orange-50 via-amber-50 to-sky-50">
      <div className="sticky top-0 z-10 flex items-center gap-3 bg-white/70 px-5 pt-4 pb-3 backdrop-blur">
        <button
          type="button"
          onClick={onBack}
          aria-label="Close"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-lg font-bold text-purple-700 shadow"
        >
          ✕
        </button>
        <div className="h-3 flex-1 overflow-hidden rounded-full bg-purple-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-purple-400 to-fuchsia-500 transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center px-6 pt-6 pb-28">
        {isIntro && (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <IllustrationBadge emoji={story.emoji} color={story.color} size="lg" />
            <h1 className="mt-5 text-3xl font-bold text-purple-900">{story.title}</h1>
            <p className="mt-1 text-sm font-bold text-purple-500">{story.reference}</p>
            <p className="mt-4 max-w-xs text-base font-medium text-purple-700">
              The shlok, its meaning, a story to share, and a mother's whisper — five
              gentle steps.
            </p>
          </div>
        )}

        {currentStep && (
          <div className="w-full max-w-xl">
            <div className="mb-4 flex items-center justify-between">
              <p className={`text-xs font-bold tracking-wide uppercase ${currentStep.label}`}>
                {currentStep.eyebrow}
              </p>
              {canSpeak && (
                <button
                  type="button"
                  onClick={handleReadAloud}
                  className="rounded-full bg-purple-600 px-4 py-1.5 text-sm font-bold text-white shadow transition hover:bg-purple-700 active:scale-95"
                >
                  {isSpeaking ? '⏹ Stop' : '🔊 Read'}
                </button>
              )}
            </div>
            <div className={`rounded-3xl ${currentStep.bg} p-6`}>{currentStep.content}</div>
          </div>
        )}

        {isComplete && (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <div className="text-6xl">🎉</div>
            <h1 className="mt-4 text-2xl font-bold text-purple-900">
              You explored this verse together!
            </h1>
            <p className="mt-2 max-w-xs text-base font-medium text-purple-600">
              {story.title} · {story.reference}
            </p>
            <div className="mt-8 flex w-full max-w-xs flex-col gap-3">
              <button
                type="button"
                onClick={onNext}
                className="rounded-full bg-purple-600 px-6 py-3 text-lg font-bold text-white shadow-lg transition hover:bg-purple-700 active:scale-95"
              >
                Next Verse →
              </button>
              <button
                type="button"
                onClick={onBack}
                className="rounded-full bg-white px-6 py-3 text-lg font-bold text-purple-700 shadow transition hover:bg-purple-50 active:scale-95"
              >
                Back to All Verses
              </button>
            </div>
          </div>
        )}
      </div>

      {!isComplete && (
        <div className="sticky bottom-0 z-10 flex gap-3 border-t border-black/5 bg-white/90 px-5 py-4 backdrop-blur">
          {!isIntro && (
            <button
              type="button"
              onClick={goBack}
              aria-label="Previous"
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-purple-100 text-xl font-bold text-purple-700 active:scale-95"
            >
              ←
            </button>
          )}
          <button
            type="button"
            onClick={goNext}
            className="flex-1 rounded-full bg-purple-600 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-purple-700 active:scale-95"
          >
            {isIntro ? "Let's Begin →" : stepIndex === total - 1 ? 'Finish ✓' : 'Continue'}
          </button>
        </div>
      )}
    </div>
  )
}
