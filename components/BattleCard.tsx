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
    <article className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-white/15 bg-white/[0.08] shadow-2xl shadow-black/20 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-cyan-300/40">
      <div className="relative h-56 overflow-hidden sm:h-64 md:h-72">
        {/* 요구사항에 따라 Next Image 대신 img 태그를 사용한다. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={culture.imageUrl}
          alt={culture.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f1a] via-[#0f0f1a]/20 to-transparent" />
        <div className="absolute bottom-4 left-4 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-cyan-300/30 bg-cyan-300/15 px-3 py-1 text-sm font-bold text-cyan-100 backdrop-blur-md">
            {culture.region}
          </span>
          <span
            className={`rounded-full border border-white/15 bg-black/25 px-3 py-1 text-xs font-semibold backdrop-blur-md ${
              isTown ? 'text-amber-300' : 'text-white/75'
            }`}
          >
            {regionScaleLabels[culture.regionScale]}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col space-y-5 p-5 sm:p-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-white">{culture.title}</h2>
          <p className="text-sm leading-6 text-white/65">
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
          className="mt-auto min-h-14 w-full rounded-2xl bg-gradient-to-r from-violet-500 to-cyan-400 px-5 py-4 font-bold text-white shadow-lg shadow-violet-500/20 transition hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
        >
          이 지역에 투표
        </button>
      </div>
    </article>
  )
}
