import { useState } from 'react'

const FEATURES = [
  {
    emoji: '📜',
    title: '24 Real Bhagavad Gita Verses',
    body: 'Genuine shloks, chosen and simplified for the youngest hearts — with the original Sanskrit and its chapter & verse reference.',
  },
  {
    emoji: '🧸',
    title: 'Four Gentle Layers for Every Verse',
    body: 'The Sanskrit shlok, an English reading of it, a simple elaborated meaning, a short story to tell, and a warm "mother\'s whisper" just for your little one.',
  },
  {
    emoji: '🎯',
    title: 'Duolingo-Style Guided Reading',
    body: 'Tap a verse, then move through it one gentle step at a time with a progress bar — easy for a parent to follow along, even one-handed.',
  },
  {
    emoji: '🔊',
    title: 'Read-Aloud, Indian Voice',
    body: "A built-in \"Read to me\" button, tuned to prefer a warm, female, Indian-accented voice where your device supports it.",
  },
]

const OUTCOMES = [
  'A calm, loving ritual to share together — story time that becomes bonding time.',
  'Early emotional vocabulary: naming feelings, and learning that they come and go.',
  'First seeds of values like kindness, patience, gratitude, and courage — in tiny, toddler-sized doses.',
  'An early, gentle introduction to Sanskrit and their cultural heritage.',
  'The quiet, repeated message that they are loved, safe, and never alone.',
]

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export default function SignupPage({ onSignedUp }) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const trimmed = email.trim()
    if (!isValidEmail(trimmed)) {
      setError('Please enter a valid email address.')
      return
    }
    setError('')
    setIsSubmitting(true)

    try {
      await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      })
    } catch {
      // Best-effort: a backend hiccup shouldn't lock a parent out of the app.
    }

    setIsSubmitting(false)
    onSignedUp(trimmed)
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

      <div className="relative mx-auto max-w-2xl px-6 py-10">
        <div className="text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[40%_60%_55%_45%/55%_45%_55%_45%] bg-gradient-to-br from-purple-400 to-fuchsia-500 text-5xl shadow-xl shadow-purple-500/20">
            🦚
          </div>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-purple-900 sm:text-5xl">
            Gita for Little Ones
          </h1>
          <p className="mx-auto mt-3 max-w-md text-lg font-medium text-purple-700">
            A gentle place for parents to read the Bhagavad Gita's wisdom out
            loud to children under five — one small verse at a time.
          </p>
        </div>

        <section className="mt-10">
          <h2 className="text-center text-sm font-bold tracking-wide text-purple-500 uppercase">
            What's inside
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-3xl bg-white/90 p-5 shadow-sm">
                <div className="text-3xl">{f.emoji}</div>
                <p className="mt-2 text-base font-bold text-slate-800">{f.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-3xl bg-amber-100 p-6">
          <h2 className="text-center text-sm font-bold tracking-wide text-amber-700 uppercase">
            What your little one gains
          </h2>
          <ul className="mt-4 space-y-3">
            {OUTCOMES.map((line) => (
              <li key={line} className="flex items-start gap-3 text-amber-900">
                <span className="mt-0.5 shrink-0">🌼</span>
                <span className="text-base leading-relaxed font-medium">{line}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10 rounded-3xl bg-white/90 p-6 shadow-lg shadow-purple-900/10 sm:p-8">
          <h2 className="text-center text-2xl font-bold text-purple-900">
            Start reading together
          </h2>
          <p className="mt-2 text-center text-sm font-medium text-purple-600">
            Pop in your email to unlock all 24 verses — free.
          </p>
          <form onSubmit={handleSubmit} className="mt-5">
            <label htmlFor="signup-email" className="sr-only">
              Email address
            </label>
            <input
              id="signup-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-full border-2 border-purple-100 bg-white px-5 py-3 text-center text-lg font-medium text-slate-800 outline-none focus:border-purple-400"
            />
            {error && (
              <p className="mt-2 text-center text-sm font-bold text-rose-600">{error}</p>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-4 w-full rounded-full bg-purple-600 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-purple-700 active:scale-95 disabled:opacity-60"
            >
              {isSubmitting ? 'One moment…' : 'Start Reading Together →'}
            </button>
          </form>
          <p className="mt-4 text-center text-xs font-medium text-slate-400">
            We'll only use your email to give you access — no spam, ever.
          </p>
        </section>

        <footer className="pt-10 pb-4 text-center text-sm font-medium text-purple-400">
          Made with love, for tiny hearts and big stories. 💛
        </footer>
      </div>
    </div>
  )
}
