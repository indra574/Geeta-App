# Gita for Little Ones

A gentle, colorful web app for parents to read simple Bhagavad Gita stories
aloud to children under five.

Each story retells a core Gita theme (friendship, effort without worry over
outcomes, everyone having their own gift, kindness to all beings, naming
your feelings, and finding love everywhere) in a few very simple sentences,
followed by a one-line "what does it mean?" for the child and a longer note
for the parent with context on the original teaching.

## Features

- A colorful, tap-friendly grid of stories on the home screen.
- A story reader with big text, one short sentence per line.
- A **"Read to me"** button that uses the browser's built-in text-to-speech,
  so the app can narrate the story too.
- A collapsible **"Notes for parents"** section on each story with a bit more
  context, in case the child asks questions.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL in your browser.

### Other scripts

- `npm run build` — production build
- `npm run preview` — preview the production build locally
- `npm run lint` — lint the source

## Adding a new story

Stories live in `src/data/stories.js`. Each entry has an `id`, `emoji`,
Tailwind gradient `color`, `title`, an array of short `lines` to read aloud,
a one-line `meaning`, and a longer `parentNote`.
