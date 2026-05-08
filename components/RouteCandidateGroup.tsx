import type { RelayCard } from '@/types'

interface RouteCandidateGroupProps {
  title: string
  description: string
  candidates: RelayCard[]
  routePath: RelayCard[]
  onSelect: (card: RelayCard) => void
}

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
              className={`w-full rounded-2xl border p-4 text-left transition ${
                isSelected
                  ? 'border-cyan-300 bg-cyan-400/10 shadow-lg shadow-cyan-500/20'
                  : 'border-white/20 bg-white/10 hover:border-cyan-300/50'
              } disabled:cursor-not-allowed disabled:opacity-60`}
            >
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-cyan-200">
                    {card.region}
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">
                    {card.category}
                  </span>
                  {isSelected && (
                    <span className="rounded-full bg-cyan-400/15 px-3 py-1 text-xs font-bold text-cyan-200">
                      다시 클릭하면 취소
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-bold text-white">{card.title}</p>
                  <p className="mt-1 text-sm leading-6 text-white/70">
                    {card.description}
                  </p>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
