import type { RelayCard } from '@/types'

interface RouteCandidateGroupProps {
  title: string
  description: string
  candidates: RelayCard[]
  routePath: RelayCard[]
  source: 'nearby' | 'similar'
  onSelect: (card: RelayCard, source: 'nearby' | 'similar') => void
}

const fallbackImg = (region: string) =>
  `https://picsum.photos/seed/${encodeURIComponent(region)}/160/120`

export default function RouteCandidateGroup({
  title,
  description,
  candidates,
  routePath,
  source,
  onSelect,
}: RouteCandidateGroupProps) {
  const isNearby = source === 'nearby'
  const groupTagColor = isNearby
    ? 'bg-[#EDF3EC] text-[#346538]'
    : 'bg-[#E1F3FE] text-[#1F6C9F]'

  return (
    <div className="space-y-4">
      <header className="space-y-1 border-b border-[#EAEAEA] pb-3">
        <div className="flex items-center gap-2">
          <span className={`rounded-sm px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide ${groupTagColor}`}>
            {source}
          </span>
          <h3 className="font-sans text-sm font-semibold tracking-wide text-[#111111]">{title}</h3>
        </div>
        <p className="text-xs leading-[1.6] text-[#787774]">{description}</p>
      </header>

      <div className="space-y-2">
        {candidates.map(card => {
          const isSelected = routePath.some(route => route.id === card.id)
          const isDisabled = !isSelected && routePath.length >= 5

          return (
            <button
              key={card.id}
              type="button"
              onClick={() => onSelect(card, source)}
              disabled={isDisabled}
              className={`group w-full overflow-hidden rounded-md border text-left transition-all ${
                isSelected
                  ? 'border-[#111111] bg-[#FBFBFA] shadow-[0_2px_8px_rgba(0,0,0,0.04)] ring-1 ring-[#111111]'
                  : 'border-[#EAEAEA] bg-white hover:border-[#A09F9C] hover:bg-[#FBFBFA]'
              } disabled:cursor-not-allowed disabled:opacity-50`}
            >
              <div className="flex items-stretch">
                <div className="relative h-auto w-24 shrink-0 overflow-hidden border-r border-[#EAEAEA] bg-[#F7F6F3]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={card.imageUrl ?? fallbackImg(card.region)}
                    alt={card.region}
                    className="h-full w-full object-cover"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#111111]/40 backdrop-blur-[2px]">
                      <span className="font-mono text-sm font-medium text-white">[x]</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col justify-center gap-2 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded border border-[#EAEAEA] bg-white px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-[#111111]">
                      {card.region}
                    </span>
                    <span className="text-xs text-[#787774]">
                      {card.category}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#111111]">{card.title}</p>
                    <p className="mt-1 line-clamp-2 text-xs leading-[1.5] text-[#787774]">
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
