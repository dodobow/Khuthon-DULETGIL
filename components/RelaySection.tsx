import type { RelayCard } from '@/types'

interface RelaySectionProps {
  relayCards: RelayCard[]
  selectedRelayCard: RelayCard | null
  onSelectRelay: (card: RelayCard) => void
  onNext: () => void
}

export default function RelaySection({
  relayCards,
  selectedRelayCard,
  onSelectRelay,
  onNext,
}: RelaySectionProps) {
  return (
    <section className="w-full space-y-5">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white">
          문화 탐험 계속하기 🗺️
        </h2>
        <p className="text-sm text-white/70">
          다음으로 이어갈 문화를 직접 선택해 보세요
        </p>
        <p className="text-xs leading-5 text-white/50">
          당신의 선택이 하나의 문화 탐험 루트가 됩니다.
        </p>
      </div>

      <div className="space-y-3">
        {relayCards.map(card => {
          const isSelected = selectedRelayCard?.id === card.id

          return (
            <button
              key={card.id}
              type="button"
              onClick={() => onSelectRelay(card)}
              className={`w-full rounded-2xl border p-5 text-left backdrop-blur-md transition ${
                isSelected
                  ? 'border-cyan-300 bg-cyan-400/10 shadow-lg shadow-cyan-500/20'
                  : 'border-white/20 bg-white/10 hover:border-cyan-300/50'
              }`}
            >
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-gradient-to-r from-violet-400 to-cyan-400 px-3 py-1 text-sm font-bold text-white">
                    {card.category}
                  </span>
                  <span className="text-sm font-semibold text-cyan-300">
                    {card.region}
                  </span>
                  {isSelected && (
                    <span className="rounded-full bg-cyan-400/15 px-3 py-1 text-xs font-bold text-cyan-200">
                      선택됨
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">{card.title}</h3>
                  <p className="text-sm leading-6 text-white/70">
                    {card.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {card.tags.map(tag => (
                    <span
                      key={tag}
                      className="rounded-full bg-white/10 px-3 py-1 text-sm text-white/80"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      <button
        type="button"
        onClick={onNext}
        disabled={!selectedRelayCard}
        className="min-h-14 w-full rounded-2xl bg-gradient-to-r from-violet-400 to-cyan-400 px-5 py-4 font-bold text-white shadow-lg shadow-violet-500/20 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {selectedRelayCard
          ? '선택한 문화로 이야기 보기'
          : '이어갈 문화를 먼저 선택해 주세요'}
      </button>
    </section>
  )
}
