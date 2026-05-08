import type { Culture, RegionScale } from '@/types'

interface BattleCardProps {
  culture: Culture
  side: 'left' | 'right'
  onVote: (side: 'left' | 'right') => void
  disabled: boolean
}

const regionScaleLabels: Record<RegionScale, string> = {
  metropolitan: '광역시·특별시',
  city: '중소도시',
  'small-city': '소도시',
  town: '소멸위기 지역',
}

export default function BattleCard({
  culture,
  side,
  onVote,
  disabled,
}: BattleCardProps) {
  const isTown = culture.regionScale === 'town'

  return (
    <article className="group flex h-full w-full flex-col overflow-hidden rounded-xl border border-[#EAEAEA] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(0,0,0,0.04)]">
      <div className="relative h-56 border-b border-[#EAEAEA] bg-[#F7F6F3] overflow-hidden sm:h-64 md:h-72">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={culture.imageUrl}
          alt={culture.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 filter mix-blend-multiply opacity-[0.85]"
        />
        <div className="absolute left-4 top-4 flex flex-col items-start gap-2">
          <span className="rounded-md border border-[#EAEAEA] bg-white/95 px-2.5 py-1 font-mono text-xs font-medium tracking-wide text-[#111111] backdrop-blur-sm">
            {culture.region}
          </span>
          <span
            className={`rounded-md border px-2.5 py-1 text-[11px] font-medium tracking-wide backdrop-blur-sm ${
              isTown
                ? 'border-[#FDEBEC] bg-[#FDEBEC]/95 text-[#9F2F2D]'
                : 'border-[#EAEAEA] bg-[#FBFBFA]/95 text-[#787774]'
            }`}
          >
            {regionScaleLabels[culture.regionScale]}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <div className="mb-6 space-y-3">
          <h2 className="font-serif text-2xl tracking-tight text-[#111111]">{culture.title}</h2>
          <p className="text-sm leading-[1.6] text-[#787774]">
            {culture.description}
          </p>
        </div>

        <div className="mt-auto space-y-6">
          <div className="flex flex-wrap gap-2">
            {culture.tags.map(tag => (
              <span
                key={tag}
                className="rounded-full border border-[#EAEAEA] bg-[#FBFBFA] px-3 py-1 text-xs text-[#787774]"
              >
                {tag}
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={() => onVote(side)}
            disabled={disabled}
            className="min-h-[48px] w-full rounded-md border border-[#111111] bg-[#111111] px-5 py-3 text-sm font-medium text-white transition-all hover:bg-[#2F3437] active:scale-[0.98] disabled:cursor-not-allowed disabled:border-[#EAEAEA] disabled:bg-[#F7F6F3] disabled:text-[#A09F9C]"
          >
            이곳에서 답사 시작
          </button>
        </div>
      </div>
    </article>
  )
}
