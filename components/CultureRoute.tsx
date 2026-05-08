import type { RelayCard } from '@/types'

interface CultureRouteProps {
  selectedRegion: string
  routePath: RelayCard[]
  connectionReasons?: string[]
}

export default function CultureRoute({
  selectedRegion,
  routePath,
  connectionReasons,
}: CultureRouteProps) {
  return (
    <section className="rounded-2xl border border-cyan-400/30 bg-white/10 p-4">
      <div className="space-y-3">
        <p className="text-center text-sm font-bold text-cyan-300">내가 만든 문화 탐험 루트</p>
        <div className="space-y-1">
          <p className="text-base font-black text-white">{selectedRegion}</p>
          {routePath.map((card, i) => (
            <div key={card.id} className="space-y-0.5 pl-3">
              <p className="text-xs text-white/45">
                ↓ {connectionReasons?.[i] ?? '지역 문화 흐름이에요'}
              </p>
              <p className="text-base font-black text-white">
                {card.region}
                <span className="ml-2 text-sm font-normal text-white/60">{card.title}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
