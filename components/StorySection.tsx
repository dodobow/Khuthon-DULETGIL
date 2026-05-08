import type { StoryCard } from '@/types'

interface StorySectionProps {
  storyCards: StoryCard[]
  onNext: () => void
}

export default function StorySection({
  storyCards,
  onNext,
}: StorySectionProps) {
  return (
    <section className="w-full space-y-5">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white">지역의 이야기 📖</h2>
        <p className="text-sm text-white/70">
          여행지 뒤에 남아 있는 로컬 히스토리
        </p>
      </div>

      <div className="space-y-3">
        {storyCards.map(card => (
          <article
            key={card.id}
            className="w-full rounded-2xl border border-white/20 border-l-4 border-l-violet-400 bg-white/10 p-5 backdrop-blur-md"
          >
            <div className="space-y-4">
              <p className="text-lg leading-8 text-white">
                “{card.content}”
              </p>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                {card.year && (
                  <span className="rounded-full bg-white/10 px-3 py-1 text-white/80">
                    {card.year}
                  </span>
                )}
                <span className="text-white/50">{card.region}</span>
                <span className="text-white/50">·</span>
                <span className="text-white/70">{card.contributor}</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      <button
        type="button"
        onClick={onNext}
        className="min-h-14 w-full rounded-2xl bg-gradient-to-r from-violet-400 to-cyan-400 px-5 py-4 font-bold text-white shadow-lg shadow-cyan-500/20"
      >
        탐험 완료
      </button>
    </section>
  )
}
