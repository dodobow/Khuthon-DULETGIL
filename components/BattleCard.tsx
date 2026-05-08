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
    <article className="w-full overflow-hidden rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md">
      {/* 요구사항에 따라 Next Image 대신 img 태그를 사용한다. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={culture.imageUrl}
        alt={culture.title}
        className="h-56 w-full object-cover"
      />
      <div className="space-y-4 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-cyan-300">
            {culture.region}
          </span>
          <span
            className={`rounded-full bg-white/10 px-3 py-1 text-xs ${
              isTown ? 'text-amber-400' : 'text-white/70'
            }`}
          >
            {regionScaleLabels[culture.regionScale]}
          </span>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">{culture.title}</h2>
          <p className="text-sm leading-6 text-white/70">
            {culture.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {culture.tags.map(tag => (
            <span
              key={tag}
              className="rounded-full bg-white/10 px-3 py-1 text-sm text-white/80"
            >
              {tag}
            </span>
          ))}
        </div>

        <button
          type="button"
          onClick={() => onVote(side)}
          disabled={disabled}
          className="min-h-14 w-full rounded-2xl bg-gradient-to-r from-violet-400 to-cyan-400 px-5 py-4 font-bold text-white shadow-lg shadow-violet-500/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          이 지역에 투표
        </button>
      </div>
    </article>
  )
}
