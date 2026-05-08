import type { RelayCard } from '@/types'

interface RelaySectionProps {
  relayCards: RelayCard[]
  onNext: () => void
}

export default function RelaySection({
  relayCards,
  onNext,
}: RelaySectionProps) {
  return (
    <section className="w-full space-y-5">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white">
          문화 탐험 계속하기 🗺️
        </h2>
        <p className="text-sm text-white/70">이 지역에서 더 발견할 것들</p>
      </div>

      <div className="space-y-3">
        {relayCards.map(card => (
          <article
            key={card.id}
            className="w-full rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-md"
          >
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-gradient-to-r from-violet-400 to-cyan-400 px-3 py-1 text-sm font-bold text-white">
                  {card.category}
                </span>
                <span className="text-sm font-semibold text-cyan-300">
                  {card.region}
                </span>
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
          </article>
        ))}
      </div>

      <button
        type="button"
        onClick={onNext}
        className="min-h-14 w-full rounded-2xl bg-gradient-to-r from-violet-400 to-cyan-400 px-5 py-4 font-bold text-white shadow-lg shadow-violet-500/20"
      >
        지역 이야기 보기
      </button>
    </section>
  )
}
