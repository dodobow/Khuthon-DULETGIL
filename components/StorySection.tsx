import type { StoryCard } from '@/types'

interface StorySectionProps {
  storyCards: StoryCard[]
  onNext: () => void
}

const noteTones = [
  'bg-[#FBFBFA]',
  'bg-[#F7F6F3]',
]

export default function StorySection({
  storyCards,
  onNext,
}: StorySectionProps) {
  return (
    <section className="w-full rounded-xl border border-[#EAEAEA] bg-white p-8 shadow-sm sm:p-10">
      <div className="space-y-8">
        <header className="space-y-3 border-b border-[#EAEAEA] pb-6">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-[#787774]">
            Phase 04 · local notes
          </p>
          <h2 className="max-w-lg font-serif text-3xl tracking-tight text-[#111111] sm:text-4xl">
            지역의 분위기를 남긴 짧은 메모
          </h2>
          <p className="max-w-xl text-sm leading-[1.7] text-[#787774]">
            안내 문구보다 사람들의 말이 오래 남는 경우가 있습니다.
            지금 고른 지역을 어떤 장면으로 기억하는지 차분히 읽어보세요.
          </p>
        </header>

        <div className="space-y-4">
          {storyCards.map((card, index) => (
            <article
              key={card.id}
              className={`rounded-lg border border-[#EAEAEA] p-5 sm:p-6 ${noteTones[index % noteTones.length]}`}
            >
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[#787774]">
                  <span>{card.region}</span>
                  {card.year && <span>{card.year}</span>}
                  <span>{card.contributor}</span>
                </div>

                <p className="max-w-[34rem] font-serif text-xl leading-[1.6] tracking-[-0.01em] text-[#111111]">
                  “{card.content}”
                </p>
              </div>
            </article>
          ))}
        </div>

        <button
          type="button"
          onClick={onNext}
          className="flex min-h-[56px] w-full items-center justify-center rounded-md bg-[#111111] px-5 py-4 text-sm font-medium text-white transition-all hover:bg-[#2F3437] active:scale-[0.98]"
        >
          기록 정리하기
        </button>
      </div>
    </section>
  )
}
