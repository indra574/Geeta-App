# Gita for Little Ones

A gentle, colorful web app for parents to read the Bhagavad Gita's wisdom
out loud to children under five — 24 real verses, each unpacked in a
Duolingo-style step-through lesson.

## Features

- A signup/landing page describing the app, gated behind an email address
  (stored server-side; see "Email signup storage" below).
- A colorful, tap-friendly grid of 24 verses on the home screen, each with
  an illustrated badge and its chapter.verse reference.
- A step-through lesson per verse: the original Sanskrit shlok, an English
  transliteration, an elaborated simple meaning, a short story a parent can
  tell their child, and a warm "mother's whisper" letter — one screen at a
  time, with a progress bar and Continue/Back navigation, ending in a
  completion screen that can jump straight into the next verse.
- A **"Read to me"** button on every step that uses the browser's built-in
  text-to-speech, preferring a female, Indian-accented voice where the
  device/browser provides one.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL in your browser. Note that `/api/signup`
(see below) only runs when deployed on Vercel (or via `vercel dev`), not
under plain `vite dev` — locally, the signup form still unlocks the app
even if that request fails, since the frontend treats the save as
best-effort.

### Other scripts

- `npm run build` — production build
- `npm run preview` — preview the production build locally
- `npm run lint` — lint the source

## Email signup storage

`api/signup.js` is a Vercel serverless function that stores each signup
email in a Postgres `signups` table (created automatically on first use).
To enable it on a deployed project:

1. In the Vercel dashboard, open the project → **Storage** tab → create a
   **Postgres** database (Neon, via the Vercel Marketplace integration) and
   connect it to this project. This injects a `DATABASE_URL` (or
   `POSTGRES_URL`) environment variable automatically — no secrets need to
   be pasted into the code.
2. Redeploy. New signups will land in the `signups` table.

If no database is connected, the signup form still unlocks the app locally
(the frontend never blocks access on the API call succeeding) — emails
just won't be persisted anywhere until storage is wired up.

## Adding a new verse

Verses live in `src/data/stories.js`, listed in Gita order (by chapter, then
verse). Each entry has an `id`, `emoji`, Tailwind gradient `color`, `title`,
`reference` (chapter.verse), `sanskrit`, `transliteration`, `plot` (the
Mahabharata narrative context — when and why this shlok was spoken), `story`
(a short tale to share), and `mothersWhisper` (a letter-style passage,
paragraphs separated by `\n\n`).
