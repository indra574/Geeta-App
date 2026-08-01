const BLOB_SHAPES = [
  '63% 37% 54% 46% / 55% 48% 52% 45%',
  '42% 58% 68% 32% / 52% 42% 58% 48%',
  '55% 45% 38% 62% / 40% 62% 38% 60%',
  '35% 65% 60% 40% / 60% 45% 55% 40%',
]

export default function IllustrationBadge({ emoji, color, index = 0, size = 'lg' }) {
  const dimensions = size === 'lg' ? 'h-24 w-24 text-5xl sm:h-28 sm:w-28 sm:text-6xl' : 'h-16 w-16 text-3xl'
  const shape = BLOB_SHAPES[index % BLOB_SHAPES.length]

  return (
    <div className="relative inline-flex shrink-0 items-center justify-center">
      <div
        className={`flex ${dimensions} items-center justify-center bg-gradient-to-br ${color} shadow-lg shadow-black/15`}
        style={{ borderRadius: shape }}
      >
        <span className="drop-shadow-sm">{emoji}</span>
      </div>
      <span className="absolute -top-1 -right-1 text-lg" aria-hidden="true">
        ✨
      </span>
      <span className="absolute -bottom-1 -left-2 text-sm" aria-hidden="true">
        ⭐
      </span>
    </div>
  )
}
