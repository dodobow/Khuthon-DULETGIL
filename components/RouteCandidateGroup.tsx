import type { RelayCard } from '@/types'

interface RouteCandidateGroupProps {
  title: string
  description: string
  candidates: RelayCard[]
  routePath: RelayCard[]
  onSelect: (card: RelayCard) => void
}

const fallbackImg = (region: string) =>
  `https://picsum.photos/seed/${encodeURIComponent(region)}/160/120`

export default function RouteCandidateGroup({
  title,
  description,
  candidates,
  routePath,
  onSelect,
}: RouteCandidateGroupProps) {
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <p className="text-sm text-white/50">{description}</p>
      </div>

      <div className="space-y-2">
        {candidates.map(card => {
          const isSelected = routePath.some(route => route.id === card.id)
          const isDisabled = !isSelected && routePath.length >= 5

          return (
            <button
              key={card.id}
              type="button"
              onClick={() => onSelect(card)}
              disabled={isDisabled}
              className={`w-full rounded-2xl border text-left transition ${
                isSelected
                  ? 'border-cyan-300 bg-cyan-400/10 shadow-lg shadow-cyan-500/20'
                  : 'border-white/20 bg-white/10 hover:border-cyan-300/50'
              } disabled:cursor-not-allowed disabled:opacity-60`}
            >
              <div className="flex items-stretch">
                {/* 지역 대표 이미지 */}
                <div className="relative h-auto w-28 shrink-0 overflow-hidden rounded-l-2xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={card.imageUrl ?? fallbackImg(card.region)}
                    alt={card.region}
                    className="h-full w-full object-cover"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 flex items-center justify-center bg-cyan-400/30">
                      <span className="text-xl">✓</span>
                    </div>
                  )}
                </div>

                {/* 텍스트 영역 */}
                <div className="flex flex-1 flex-col justify-center gap-2 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-cyan-200">
                      {card.region}
                    </span>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">
                      {card.category}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-white">{card.title}</p>
                    <p className="mt-1 text-sm leading-6 text-white/70">
                      {card.description}
                    </p>
                  </div>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
